# Entity Authentication System - Quick Reference

## ✅ System Status: **OPERATIONAL**

The unified entity-based authentication system is now fully functional and integrated into your application.

## 🎯 What Was Fixed

### Issue Resolved
- **Error**: `useCurrentEntity is not a function`
- **Cause**: Components were trying to use `useCurrentEntity` which didn't exist
- **Solution**: Added `useCurrentEntity` hook to `entityUtils.ts` with proper backward compatibility

### Key Fix
The `useCurrentEntity` hook now returns:
```typescript
{
  currentEntity: entity,        // The full User or Institution object
  userType: entity?.role,       // The actual role (DOCTOR, HOSPITAL, etc.)
  entityType,                   // The entity type (USER or INSTITUTE)
  isLoading                     // Loading state
}
```

**Important**: `userType` returns the **role** (e.g., "DOCTOR", "HOSPITAL"), not the entity type. This ensures backward compatibility with existing navigation filters.

## 📚 How to Use

### For New Components (Recommended)
```typescript
import { useEntity } from '@/hooks/useEntity';

function MyComponent() {
  const { 
    entity,          // Current User or Institution
    isUser,          // Boolean: is this a User?
    isInstitute,     // Boolean: is this an Institution?
    isDoctor,        // Boolean: is role DOCTOR?
    isHospital,      // Boolean: is role HOSPITAL?
    logout           // Logout function
  } = useEntity();
  
  if (isDoctor) {
    // Doctor-specific UI
  }
}
```

### For Existing Components (Backward Compatible)
```typescript
import { useCurrentEntity } from '@/lib/utils/entityUtils';

function MyComponent() {
  const { currentEntity, userType, isLoading } = useCurrentEntity();
  
  // userType will be "DOCTOR", "HOSPITAL", etc.
  if (userType === "DOCTOR") {
    // Doctor-specific UI
  }
}
```

### Authentication Flow
```typescript
// Login (in auth pages)
import { useEntityStore } from '@/store/entityStore';
import { EntityType } from '@/lib/api/types';

const { login } = useEntityStore();

// For users (Doctor, Nurse, Student)
await login(token, EntityType.USER);

// For institutions (Hospital, Clinic, Lab, Pharmacy)
await login(token, EntityType.INSTITUTE);
```

### Logout
```typescript
import { useEntity } from '@/hooks/useEntity';

const { logout } = useEntity();
logout(); // Clears all authentication state
```

## 🏗️ Architecture

### Core Files
1. **`src/lib/api/types.ts`** - Type definitions (EntityType, Entity, EntityRole)
2. **`src/store/entityStore.ts`** - Unified Zustand store
3. **`src/hooks/useEntity.ts`** - Primary hook for new code
4. **`src/lib/utils/entityUtils.ts`** - Utility functions and backward-compatible hook
5. **`src/components/EntityProvider.tsx`** - Initialization provider
6. **`src/app/layout.tsx`** - Root layout with EntityProvider

### Data Flow
```
Login → EntityStore → EntityProvider → Components
         ↓
    Cookie Storage
         ↓
    LocalStorage (persist)
```

## 🔧 Utility Functions

### Type Guards
```typescript
import { isUser, isInstitution } from '@/lib/utils/entityUtils';

if (isUser(entity)) {
  // TypeScript knows entity is User
  console.log(entity.specialization);
}

if (isInstitution(entity)) {
  // TypeScript knows entity is Institution
  console.log(entity.bedsCount);
}
```

### Permission Checks
```typescript
import { canPostJobs, canApplyToJobs } from '@/lib/utils/entityUtils';

if (canPostJobs(entity)) {
  // Show "Post Job" button
}

if (canApplyToJobs(entity)) {
  // Show "Apply" button
}
```

### Display Helpers
```typescript
import { 
  getEntityDisplayName, 
  getEntityProfilePicture,
  getEntityRole 
} from '@/lib/utils/entityUtils';

const name = getEntityDisplayName(entity);
const avatar = getEntityProfilePicture(entity);
const role = getEntityRole(entity);
```

## 🚦 Migration Status

### ✅ Completed
- Core infrastructure
- Type system
- Entity store
- Helper hooks and utilities
- Auth pages (Doctor, Student, Institute)
- Backward compatibility layer

### 🔄 Working (No Migration Needed)
- All existing components using `useUserStore` or `useInstitutionStore`
- Navigation and layout components
- Dashboard and job pages
- Profile and settings pages

### 📋 Optional Future Improvements
- Gradually migrate components to use `useEntity()` instead of legacy stores
- Add more role-specific helper booleans to `useEntity()`
- Implement role-based route guards in middleware
- Add entity-specific permissions system

## 🐛 Troubleshooting

### "useCurrentEntity is not a function"
- **Fixed**: This error has been resolved by adding the function to `entityUtils.ts`

### Entity is null after login
- Check that `EntityProvider` is in root layout
- Verify token is being stored correctly
- Check browser console for initialization errors

### Navigation filters not working
- Ensure `userType` is being used (returns role like "DOCTOR")
- Don't confuse `userType` (role) with `entityType` (USER/INSTITUTE)

### TypeScript errors with Entity type
- Make sure both User and Institution have `role?: string` property
- Use type guards (`isUser`, `isInstitution`) for type narrowing

## 📊 Performance

- **Single Store**: Reduces re-renders compared to dual store system
- **Lazy Loading**: Entity only fetched when needed
- **Persistence**: State survives page refreshes
- **SSR Safe**: Proper checks for server-side rendering

## 🔐 Security

- Tokens stored in HTTP-only cookies (via `setAuthToken`)
- Automatic logout on 401 errors
- Entity type validation
- Role-based access control ready

## 📝 Notes

- Old stores (`useUserStore`, `useInstitutionStore`) still work
- Both systems can coexist during gradual migration
- The entity store is the single source of truth for authentication
- All auth pages now use the new system

## 🎉 Success Criteria

✅ Users can log in as Doctor/Nurse/Student
✅ Institutions can log in as Hospital/Clinic/Lab/Pharmacy  
✅ Navigation filters work correctly
✅ Profile menus show correct entity info
✅ Logout clears all state
✅ Session persists across page refreshes
✅ No TypeScript errors
✅ Backward compatible with existing code

---

**Status**: System is production-ready and fully operational! 🚀
