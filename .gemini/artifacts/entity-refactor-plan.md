# Entity-Based Authentication Refactoring Plan

## Overview
This document outlines the complete refactoring of the authentication system to use a unified entity-based approach.

## Phase 1: Core Infrastructure ✅ COMPLETED

### 1.1 Type Definitions
- [x] Add `EntityType` enum (USER, INSTITUTE)
- [x] Add `EntityRole` type (union of RoleEnum and InstituteRoles)
- [x] Add `Entity` type (union of User and Institution)
- [x] Add `role?: string` to Institution interface

### 1.2 Entity Store
- [x] Create `src/store/entityStore.ts`
- [x] Implement unified state management
- [x] Add `initialize()`, `login()`, `logout()`, `fetchEntity()`
- [x] Handle both User and Institute entities

### 1.3 Helper Hook
- [x] Create `src/hooks/useEntity.ts`
- [x] Provide convenient access to entity state
- [x] Include role-based boolean helpers

### 1.4 Provider Component
- [x] Create `src/components/EntityProvider.tsx`
- [x] Add to root layout for initialization

## Phase 2: Authentication Pages ✅ COMPLETED

### 2.1 Doctor Auth Page
- [x] Replace `useUserStore` with `useEntityStore`
- [x] Update login flow to use `loginEntity(token, EntityType.USER)`
- [x] Remove `setAuthToken` and `fetchCurrentUser` calls

### 2.2 Student Auth Page
- [x] Replace `useUserStore` with `useEntityStore`
- [x] Update login flow to use `loginEntity(token, EntityType.USER)`
- [x] Remove `setAuthToken` and `fetchCurrentUser` calls

### 2.3 Institute Auth Page
- [x] Replace `useInstitutionStore` with `useEntityStore`
- [x] Update login flow to use `loginEntity(token, EntityType.INSTITUTE)`
- [x] Remove `setAuthToken` and `fetchCurrentInstitution` calls

## Phase 3: Application-Wide Refactoring 🔄 IN PROGRESS

### 3.1 Navigation Components
- [ ] Update Navbar to use `useEntity()` hook
- [ ] Replace role checks with entity-based logic
- [ ] Update menu items based on entity type

### 3.2 Dashboard Pages
- [ ] Refactor dashboard home to use `useEntity()`
- [ ] Update job posting components
- [ ] Update applications management

### 3.3 Profile Pages
- [ ] Update user profile page
- [ ] Update institute profile page
- [ ] Consolidate shared logic

### 3.4 Protected Routes
- [ ] Update middleware to work with entity store
- [ ] Add entity-type-based route guards
- [ ] Implement role-based access control

### 3.5 API Service Layer
- [ ] Update API interceptors
- [ ] Ensure proper token handling
- [ ] Add entity context to requests

## Phase 4: Component Audit 📋 PENDING

### 4.1 Find All Role Checks
Search patterns:
- `useUserStore`
- `useInstitutionStore`
- `getUserType()`
- `role === "DOCTOR"`
- `role === "HOSPITAL"`
- Direct role string comparisons

### 4.2 Replace with Entity Pattern
For each occurrence:
```typescript
// OLD
const { currentUser } = useUserStore();
if (currentUser?.role === "DOCTOR") { ... }

// NEW
const { isDoctor } = useEntity();
if (isDoctor) { ... }
```

## Phase 5: Testing & Validation ⏳ PENDING

### 5.1 Authentication Flow
- [ ] Test user login (Doctor, Nurse, Student)
- [ ] Test institute login (Hospital, Clinic, Lab, Pharmacy)
- [ ] Test logout functionality
- [ ] Test session persistence

### 5.2 Authorization
- [ ] Verify role-based UI rendering
- [ ] Test protected routes
- [ ] Validate API access control

### 5.3 Edge Cases
- [ ] Test token expiration
- [ ] Test concurrent sessions
- [ ] Test entity switching (if applicable)

## Phase 6: Cleanup 🧹 PENDING

### 6.1 Deprecate Old Stores
- [ ] Mark `useUserStore` as deprecated
- [ ] Mark `useInstitutionStore` as deprecated
- [ ] Add migration comments

### 6.2 Remove Dead Code
- [ ] Remove unused `setAuthToken` calls
- [ ] Clean up redundant type checks
- [ ] Remove legacy role constants

### 6.3 Documentation
- [ ] Update README with new patterns
- [ ] Add JSDoc comments to entity utilities
- [ ] Create migration guide for developers

## Key Patterns

### Authentication
```typescript
// Login
const { login } = useEntityStore();
await login(token, EntityType.USER); // or EntityType.INSTITUTE
```

### Access Control
```typescript
// Component-level
const { isUser, isInstitute, isDoctor, isHospital } = useEntity();

if (isUser) {
  // User-specific UI
}

if (isDoctor) {
  // Doctor-specific features
}
```

### Logout
```typescript
const { logout } = useEntity();
logout(); // Clears all entity state
```

## Migration Checklist

- [x] Core infrastructure created
- [x] Auth pages refactored
- [ ] Navigation updated
- [ ] Dashboard refactored
- [ ] Profile pages updated
- [ ] Middleware updated
- [ ] All role checks replaced
- [ ] Tests passing
- [ ] Documentation updated
- [ ] Old code removed

## Notes

- The entity store automatically handles token storage via cookies
- Entity type is inferred from the role returned by login APIs
- Both stores (user/institution) can coexist during migration
- The `useEntity()` hook is the primary interface for components
