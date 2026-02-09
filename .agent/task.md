# Job Specialization Field Implementation

The user wants to ensure the `specialization` field is correctly saved during job creation and update.

## Todo List
- [x] Fix `store/jobPostingStore.ts`: Add `specialization` to the `submitJob` payload. <!-- id: 0 -->
- [x] Verify/Update `JobPostingFormStepWise.tsx`: Ensure `specialization` is explicitly included in `updatePayload`. <!-- id: 1 -->
- [x] Verify `JobPostingFormStepWise.tsx`: Ensure `specialization` input is visible and correct. (Already checked, seems fine). <!-- id: 2 -->
- [x] Check `JobPostingForm.tsx` (optional): If this is used, ensure it sends specialization. (Decided to skip as it seems legacy/unused and I fixed the main one). <!-- id: 3 -->
