import { useEntityStore } from '@/store/entityStore';
import { EntityType, RoleEnum, InstituteRoles } from '@/lib/api/types';
import { useMemo } from 'react';

export const useEntity = () => {
    const { entity, entityType, isLoading, error, logout, updateEntity } = useEntityStore();

    const isUser = entityType === EntityType.USER;
    const isInstitute = entityType === EntityType.INSTITUTE;

    const role = entity?.role;

    const isDoctor = role === RoleEnum.DOCTOR;
    const isNurse = role === RoleEnum.NURSE;
    const isStudent = role === RoleEnum.STUDENT;

    const isHospital = role === InstituteRoles.HOSPITAL;
    const isClinic = role === InstituteRoles.CLINIC;

    return {
        entity,
        entityType,
        isLoading,
        error,
        isUser,
        isInstitute,
        role,
        isDoctor,
        isNurse,
        isStudent,
        isHospital,
        isClinic,
        logout,
        updateEntity,
        isAuthenticated: !!entity,
    };
};
