import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Entity, EntityType, User, Institution, RoleEnum, InstituteRoles } from '@/lib/api/types';
import { getUser } from '@/lib/api/services/user';
import { getInstitution } from '@/lib/api/services/institute';
import { getUserType, clearAuthToken, setAuthToken } from '@/lib/api/utils';

interface EntityState {
    // State
    entity: Entity | null;
    entityType: EntityType | null;
    isLoading: boolean;
    error: string | null;
    initialized: boolean;

    // Actions
    initialize: () => Promise<void>;
    login: (token: string, type: EntityType) => Promise<void>;
    logout: () => void;
    fetchEntity: () => Promise<void>;

    // Helpers
    updateEntity: (updates: Partial<Entity>) => void;
}

const getInitialEntityType = (): EntityType | null => {
    if (typeof window === 'undefined') return null;

    try {
        // Try to get from cookie via utils
        const typeFromCookie = getUserType();
        if (typeFromCookie) {
            if (Object.values(RoleEnum).includes(typeFromCookie as RoleEnum)) return EntityType.USER;
            if (Object.values(InstituteRoles).includes(typeFromCookie as InstituteRoles)) return EntityType.INSTITUTE;
            if (typeFromCookie === 'USER' || typeFromCookie === 'user') return EntityType.USER;
            if (typeFromCookie === 'INSTITUTE' || typeFromCookie === 'institute') return EntityType.INSTITUTE;
        }
    } catch (error) {
        console.error('Error reading entity type from cookie:', error);
    }

    return null;
};

export const useEntityStore = create<EntityState>()(
    devtools(
        persist(
            (set, get) => ({
                entity: null,
                entityType: null,
                isLoading: false,
                error: null,
                initialized: false,

                initialize: async () => {
                    if (typeof window === 'undefined') {
                        set({ initialized: true });
                        return;
                    }

                    try {
                        const storedType = getInitialEntityType();
                        if (storedType) {
                            set({ entityType: storedType });
                            await get().fetchEntity();
                        }
                    } catch (error) {
                        console.error('Error initializing entity store:', error);
                        set({ error: 'Failed to initialize' });
                    } finally {
                        set({ initialized: true });
                    }
                },

                login: async (token: string, type: EntityType) => {
                    setAuthToken(token, type); // Store type in cookie
                    set({ entityType: type, isLoading: true });
                    await get().fetchEntity();
                },

                logout: () => {
                    clearAuthToken();
                    set({ entity: null, entityType: null, error: null });

                    // Also clear specific stores to ensure no stale data
                    // We can't directly import other stores here to avoid circular dependencies if they import this
                    // But consumers of logout should essentially rely on this store.
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('user-store');
                        localStorage.removeItem('institution-store');
                    }
                },

                fetchEntity: async () => {
                    const { entityType } = get();
                    if (!entityType) return;

                    set({ isLoading: true, error: null });

                    try {
                        let data: Entity;

                        if (entityType === EntityType.USER) {
                            data = await getUser();
                        } else {
                            data = await getInstitution();
                        }

                        set({ entity: data, isLoading: false });
                    } catch (error: any) {
                        console.error('Failed to fetch entity:', error);
                        // If unauthorized, auto-logout
                        if (error?.response?.status === 401) {
                            get().logout();
                        } else {
                            set({ error: error.message || 'Failed to load profile', isLoading: false });
                        }
                    }
                },

                updateEntity: (updates: Partial<Entity>) => {
                    const { entity } = get();
                    if (!entity) return;
                    set({ entity: { ...entity, ...updates } as Entity });
                }
            }),
            {
                name: 'entity-store',
                partialize: (state) => ({
                    entity: state.entity,
                    entityType: state.entityType,
                }),
            }
        ),
        { name: 'Entity Store' }
    )
);
