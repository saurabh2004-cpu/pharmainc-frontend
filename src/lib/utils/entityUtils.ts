import { Entity, EntityType, User, Institution, RoleEnum, InstituteRoles } from '@/lib/api/types';
import { useEntityStore } from '@/store/entityStore';
import { useUserStore } from '@/store/userStore';
import { useInstitutionStore } from '@/store/institutionStore';

/**
 * Type guards for entity discrimination
 */
export function isUser(entity: Entity | null): entity is User {
  if (!entity) return false;
  const role = entity.role;
  return role ? Object.values(RoleEnum).includes(role as RoleEnum) : false;
}

export function isInstitution(entity: Entity | null): entity is Institution {
  if (!entity) return false;
  const role = entity.role;
  return role ? Object.values(InstituteRoles).includes(role as InstituteRoles) : false;
}

/**
 * Role checkers
 */
export function hasRole(entity: Entity | null, role: RoleEnum | InstituteRoles): boolean {
  return entity?.role === role;
}

export function hasAnyRole(entity: Entity | null, roles: (RoleEnum | InstituteRoles)[]): boolean {
  return entity?.role ? roles.includes(entity.role as any) : false;
}

/**
 * Permission helpers
 */
export function canPostJobs(entity: Entity | null): boolean {
  return isInstitution(entity);
}

export function canApplyToJobs(entity: Entity | null): boolean {
  return isUser(entity);
}

export function canManageApplications(entity: Entity | null): boolean {
  return isInstitution(entity);
}

/**
 * Display helpers
 */
export function getEntityDisplayName(entity: Entity | null): string {
  if (!entity) return 'Guest';
  return entity.name || 'Unknown';
}

export function getEntityProfilePicture(entity: Entity | null): string {
  if (!entity) return '/pp.png';
  return entity.profile_picture || '/pp.png';
}

export function getEntityRole(entity: Entity | null): string {
  if (!entity) return '';
  return entity.role || '';
}

/**
 * Navigation helpers
 */
export function getDashboardRoute(entityType: EntityType | null): string {
  if (entityType === EntityType.INSTITUTE) return '/dashboard';
  return '/home';
}

export function getProfileRoute(entityType: EntityType | null, entityId?: string): string {
  if (!entityId) return '/profile';
  if (entityType === EntityType.INSTITUTE) return `/institute/${entityId}`;
  return `/profile/${entityId}`;
}

/**
 * Hook for backward compatibility with existing components
 * This provides a unified interface to get the current entity
 */
export function useCurrentEntity() {
  const { entity, entityType, isLoading } = useEntityStore();

  return {
    currentEntity: entity,
    userType: entity?.role || null, // Return the actual role (DOCTOR, HOSPITAL, etc.)
    entityType, // Also provide entityType for components that need it  
    isLoading,
  };
}

/**
 * Get entity-specific fetcher functions
 * Returns the appropriate fetch functions based on entity type
 */
export function getEntityFetchers(entityType: EntityType | null) {
  if (entityType === EntityType.USER) {
    return {
      fetchById: useUserStore.getState().fetchUserById,
    };
  } else if (entityType === EntityType.INSTITUTE) {
    return {
      fetchById: useInstitutionStore.getState().fetchInstitutionById,
    };
  }

  return {
    fetchById: async (id: string) => {
      throw new Error('No entity type set');
    },
  };
}

