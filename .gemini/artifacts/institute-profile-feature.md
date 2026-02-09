# Institute Profile Viewing Feature - Implementation Summary

## ✅ Feature Implemented

Users can now view full institute profiles directly from job detail pages by clicking on the institute name or logo.

## 🎯 What Was Built

### 1. **InstituteProfileModal Component**
**Location**: `src/app/(home)/find-jobs/[jobId]/_components/InstituteProfileModal.tsx`

A comprehensive modal component that displays full institute profile information:

#### Features:
- **Loading State**: Shows spinner while fetching data
- **Error Handling**: Displays error message with retry button
- **Comprehensive Profile Display**:
  - Institute header with logo/initials and verification badge
  - About section
  - Detailed information grid (location, established year, ownership, etc.)
  - Contact information (email, phone)
  - Services offered
  - Specialties
- **Responsive Design**: Works on all screen sizes
- **Smooth Animations**: Fade-in effects and transitions

#### API Integration:
- Uses `getInstitutionById(instituteId)` from `@/lib/api/services/institute`
- Fetches complete institute profile when modal opens
- Handles loading and error states gracefully

### 2. **Job Details Page Updates**
**Location**: `src/app/(home)/find-jobs/[jobId]/page.tsx`

#### Changes Made:
1. **Imports Added**:
   - `InstituteProfileModal` component
   - `useEntity` hook for entity-based access control

2. **State Management**:
   - Added `showInstituteModal` state to control modal visibility
   - Integrated `isUser` from `useEntity()` hook

3. **Click Handlers**:
   - `handleViewInstituteProfile()`: Opens modal only for users

4. **UI Enhancements**:
   - **Institute Logo** (lines 286-297):
     - Clickable for users
     - Hover effect: Blue ring appears on hover
     - Cursor changes to pointer
     - Tooltip: "Click to view institute profile"
   
   - **Institute Name** (lines 298-306):
     - Clickable for users
     - Hover effect: Text color changes to blue
     - Cursor changes to pointer
     - Tooltip: "Click to view institute profile"

5. **Modal Integration**:
   - Modal only renders for users (`isUser` check)
   - Requires valid `job.instituteId`
   - Properly integrated with existing modals

## 🔐 Access Control

### Entity-Based Behavior:
- **Users** (Doctor, Nurse, Student, Other):
  ✅ Can click institute name/logo
  ✅ See hover effects and cursor changes
  ✅ View full institute profile in modal

- **Institutions** (Hospital, Clinic, Lab, Pharmacy):
  ❌ Cannot click institute name/logo
  ❌ No hover effects or cursor changes
  ❌ Modal does not render

### Implementation:
```typescript
const { isUser } = useEntity();

// Conditional rendering
className={`... ${isUser ? 'cursor-pointer hover:ring-4 hover:ring-blue-200' : ''}`}

// Conditional modal rendering
{isUser && job.instituteId && (
  <InstituteProfileModal ... />
)}
```

## 🎨 User Experience

### Visual Indicators:
1. **Cursor Change**: Pointer cursor on hover (users only)
2. **Logo Hover Effect**: Blue ring appears around logo
3. **Name Hover Effect**: Text color changes to blue
4. **Tooltips**: "Click to view institute profile"

### Modal UX:
1. **Loading State**: 
   - Spinner with "Loading institute profile..." message
   
2. **Error State**:
   - Error icon and message
   - "Try Again" button to retry fetch
   
3. **Success State**:
   - Beautiful, organized profile display
   - Scrollable content for long profiles
   - Close button in header and footer

### Responsive Design:
- Modal adapts to screen size
- Maximum width: 3xl (48rem)
- Maximum height: 90vh
- Scrollable content area
- Works on mobile, tablet, and desktop

## 📊 Data Flow

```
Job Details Page
    ↓
User clicks institute name/logo
    ↓
handleViewInstituteProfile() called
    ↓
Check: isUser && job.instituteId?
    ↓ (Yes)
setShowInstituteModal(true)
    ↓
InstituteProfileModal renders
    ↓
useEffect triggers fetchInstituteProfile()
    ↓
API call: getInstitutionById(instituteId)
    ↓
Display institute profile data
```

## 🔧 Technical Details

### State Management:
```typescript
const [showInstituteModal, setShowInstituteModal] = useState(false);
const [institute, setInstitute] = useState<Institution | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

### API Call:
```typescript
const fetchInstituteProfile = async () => {
  setLoading(true);
  setError(null);
  try {
    const data = await getInstitutionById(instituteId);
    setInstitute(data);
  } catch (err: any) {
    setError(err.message || 'Failed to load institute profile');
  } finally {
    setLoading(false);
  }
};
```

### Conditional Rendering:
```typescript
// Logo
<div 
  onClick={handleViewInstituteProfile}
  className={`... ${isUser ? 'cursor-pointer hover:ring-4 hover:ring-blue-200' : ''}`}
  title={isUser ? 'Click to view institute profile' : ''}
>

// Name
<span 
  onClick={handleViewInstituteProfile}
  className={`... ${isUser ? 'cursor-pointer hover:text-blue-600' : ''}`}
  title={isUser ? 'Click to view institute profile' : ''}
>
```

## 🚀 Benefits

1. **Improved UX**: Users can learn about institutes without leaving the job page
2. **Entity-Aware**: Respects user roles and permissions
3. **Scalable**: Easy to extend with more features
4. **Maintainable**: Clean separation of concerns
5. **Accessible**: Clear visual indicators and tooltips
6. **Responsive**: Works on all devices
7. **Error-Resilient**: Graceful error handling and retry mechanism

## 📝 Files Modified/Created

### Created:
- `src/app/(home)/find-jobs/[jobId]/_components/InstituteProfileModal.tsx`

### Modified:
- `src/app/(home)/find-jobs/[jobId]/page.tsx`

## ✅ Testing Checklist

- [x] Users can click institute logo
- [x] Users can click institute name
- [x] Hover effects work correctly
- [x] Modal opens with correct institute data
- [x] Loading state displays properly
- [x] Error state displays with retry button
- [x] Modal closes correctly
- [x] Institutions cannot trigger modal
- [x] No hover effects for institutions
- [x] Modal is responsive
- [x] All institute data fields display correctly
- [x] Contact links work (mailto, tel)
- [x] Services and specialties render as badges

## 🎉 Success Criteria Met

✅ Institute name and logo are clickable for users
✅ Cursor changes to pointer on hover
✅ Clear visual affordance (hover effects)
✅ Full institute profile fetched using `GET /institutes/get-institute/:id`
✅ Institute ID derived from job data
✅ Proper loading and error states
✅ Only works for User entity (not Institutions)
✅ Clean separation between job and institute data
✅ Follows existing project patterns
✅ Works with client-side navigation
✅ Scalable and maintainable code

---

**Status**: Feature is production-ready and fully operational! 🚀
