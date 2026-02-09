import { InstitutionEntity, User } from "../_components/types";

export const getProfilePicture = (entity: User | InstitutionEntity | null) => {
    if (!entity) return "/pp.png";
    return (entity as User).profilePicture || entity.profile_picture || "/pp.png";
  };

export const getDisplayHandle = (entity: User | InstitutionEntity | null) => {
    if (!entity) return "user";
    
    if ('speciality' in entity) {
      return entity.speciality?.toLowerCase().replace(/\s+/g, '') || entity.role?.toLowerCase() || "user";
    }
    
    if ('type' in entity) {
      return entity.type?.toLowerCase().replace(/\s+/g, '') || "institution";
    }
    
    return "user";
  };