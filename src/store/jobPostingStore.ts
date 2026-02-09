import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { JobCreateParams } from '@/lib/api/types'
import { createJob } from '@/lib/api/services/job'

interface Specialty {
  id?: string;
  name: string;
  description?: string;
}

interface JobPostingDraft extends Partial<JobCreateParams> {
  id?: string;
  lastSaved?: string;

}

interface JobPostingState {
  currentDraft: JobPostingDraft | null;

  isSubmitting: boolean;
  isSaving: boolean;
  error: string | null;

  editMode: boolean;
  editJobId: string | null;

  setDraft: (draft: Partial<JobPostingDraft>) => void;
  updateField: <K extends keyof JobPostingDraft>(field: K, value: JobPostingDraft[K]) => void;
  saveDraft: () => void;
  loadDraft: () => void;
  clearDraft: () => void;

  addSpecialty: (specialty: Specialty) => void;
  removeSpecialty: (index: number) => void;
  updateSpecialty: (index: number, specialty: Specialty) => void;

  submitJob: () => Promise<any>;

  setEditMode: (jobId: string, jobData: Partial<JobCreateParams>) => void;
  clearEditMode: () => void;

  reset: () => void;
}

const initialState = {
  isSubmitting: false,
  isSaving: false,
  error: null,
  editMode: false,
  editJobId: null,
  currentDraft: {
    role: "",
    skills: [],
    city: "",
    country: "",
  } as any, // Cast to any to avoid strict partial checks on initial load if needed, or better, keep null and handle in component
}

export const useJobPostingStore = create<JobPostingState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setDraft: (draft) => {
          set((state) => ({
            currentDraft: {
              ...state.currentDraft,
              ...draft,
              lastSaved: new Date().toISOString(),
            },
          }))
        },

        updateField: (field, value) => {
          set((state) => ({
            currentDraft: {
              ...state.currentDraft,
              [field]: value,
              lastSaved: new Date().toISOString(),
            },
          }))
        },

        saveDraft: () => {
          set({ isSaving: true })
          // Auto-save is handled by persist middleware
          setTimeout(() => {
            set({ isSaving: false })
          }, 500)
        },

        loadDraft: () => {
          // Draft is automatically loaded from localStorage by persist middleware
          console.log('Draft loaded from localStorage')
        },

        clearDraft: () => {
          set({
            currentDraft: null,
            error: null,
          })
        },

        addSpecialty: (specialty) => {
          set((state) => ({
            currentDraft: {
              ...state.currentDraft,
              specialties: [
                ...(state.currentDraft?.specialties || []),
                specialty,
              ],
              lastSaved: new Date().toISOString(),
            },
          }))
        },

        removeSpecialty: (index) => {
          set((state) => {
            const specialties = [...(state.currentDraft?.specialties || [])]
            specialties.splice(index, 1)
            return {
              currentDraft: {
                ...state.currentDraft,
                specialties,
                lastSaved: new Date().toISOString(),
              },
            }
          })
        },

        updateSpecialty: (index, specialty) => {
          set((state) => {
            const specialties = [...(state.currentDraft?.specialties || [])]
            specialties[index] = specialty
            return {
              currentDraft: {
                ...state.currentDraft,
                specialties,
                lastSaved: new Date().toISOString(),
              },
            }
          })
        },

        submitJob: async () => {
          const { currentDraft, editMode, editJobId } = get()

          if (!currentDraft) {
            set({ error: 'No draft to submit' })
            throw new Error('No draft to submit')
          }

          set({ isSubmitting: true, error: null })

          try {
            const requiredFields = [
              'title',
              'fullDescription',
              'jobType',
              'workLocation',
              'experienceLevel',
              'requirements',
              'salaryMin',
              'salaryMax',
              'role',
            ]

            // Check if skills array is present and has at least one item
            if (!currentDraft.skills || currentDraft.skills.length === 0) {
              throw new Error('At least one skill is required');
            }


            for (const field of requiredFields) {
              if (!currentDraft[field as keyof JobPostingDraft]) {
                throw new Error(`${field} is required`)
              }
            }

            // Prepare the payload
            const payload: JobCreateParams = {
              title: currentDraft.title!,
              fullDescription: currentDraft.fullDescription!,
              jobType: currentDraft.jobType!,
              workLocation: currentDraft.workLocation!,
              experienceLevel: currentDraft.experienceLevel!,
              requirements: currentDraft.requirements!,
              salaryMin: currentDraft.salaryMin!,
              salaryMax: currentDraft.salaryMax!,
              shortDescription: currentDraft.shortDescription || null,
              salaryCurrency: currentDraft.salaryCurrency || 'INR',
              applicationDeadline: currentDraft.applicationDeadline || null,
              contactEmail: currentDraft.contactEmail || null,
              contactPhone: currentDraft.contactPhone || null,
              contactPerson: currentDraft.contactPerson || null,
              additionalInfo: currentDraft.additionalInfo || null,
              role: currentDraft.role!,
              skills: currentDraft.skills!,
              city: currentDraft.city || undefined,
              country: currentDraft.country || undefined,
              speciality: currentDraft.speciality || null,
              subSpeciality: currentDraft.subSpeciality || null,
              //   specialties: currentDraft.specialties || [],
            }

            // Submit to API
            const res = await createJob(payload)

            console.log("response api of create job", res)

            // Clear all state on success (including persisted data)
            set({
              ...initialState,
            })

            return res
          } catch (error) {
            console.error('Failed to submit job:', error)
            set({
              error: error instanceof Error ? error.message : 'Failed to submit job',
              isSubmitting: false,
            })
            // Re-throw the error so the form component can handle it with proper backend error messages
            throw error
          }
        },

        setEditMode: (jobId, jobData) => {
          set({
            editMode: true,
            editJobId: jobId,
            currentDraft: {
              ...jobData,
              lastSaved: new Date().toISOString(),
            },
          })
        },

        clearEditMode: () => {
          set({
            editMode: false,
            editJobId: null,
          })
        },

        reset: () => {
          set(initialState)
        },
      }),
      {
        name: 'job-posting-store',
        partialize: (state) => ({
          currentDraft: state.currentDraft,
        }),
      }
    ),
    {
      name: 'job-posting-store',
    }
  )
)
