import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Camera,
    MessageSquare,
    UserPlus,
    Heart,
    Check,
    X,
    MapPin,
    Briefcase,
    GraduationCap,
    Link2,
    CheckCircle,
    Edit,
    Share2,
    Plus,
    ExternalLink,
    Copy
} from "lucide-react";
import Image from "next/image";
import { EditProfileModal } from "./EditProfileModal";
import { EditInstituteModal } from "./EditInstituteModal";
import { EditImageModal } from "./EditImageModal";
import ProfileShareModal from "./ProfileShareModal";
import InstitutionShareModal from "./InstitutionShareModal";
import { useUserStore, useConnectionsStore, useInstitutionStore } from "@/store";
import { getUserType, getAuthToken } from "@/lib/api/utils";
import { getProfilePictureUrl, isProfilePictureUrl } from "@/lib/utils";
import {
    getUserSocialMediaLinks,
    getInstituteSocialMediaLinks,
    SocialMediaLink
} from "@/lib/api";
import {
    followUser,
    unfollowUser,
    getFollowerCount,
    getConnectionCount,
    User,
    Institution,
} from "@/lib/api";
import { getLinks, createLinks } from "@/lib/api/services/userProfile";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface ProfileHeaderProps {
    user: User | null;
    institution: Institution | null;
    currentUserId: string;
    onUserUpdate?: (updatedUser: User) => void;
    onInstituteUpdate?: (updatedInstitution: Institution) => void;
}

export const ProfileHeader = ({
    user,
    institution,
    currentUserId,
    onUserUpdate,
    onInstituteUpdate,
}: ProfileHeaderProps) => {
    const { currentUser, fetchCurrentUser } = useUserStore();
    const { currentInstitution } = useInstitutionStore();
    const userType = getUserType();
    const {
        getConnectionStatus,
        connectToUser,
        disconnectFromUser,
        acceptConnectionRequest,
        rejectConnectionRequest,
        ensureConnectionsLoaded,
        getFollowStatus,
        followUserAction,
        unfollowUserAction,
        ensureFollowedUsersLoaded
    } = useConnectionsStore();
    const router = useRouter();

    const isFollowing = user?.id ? getFollowStatus(user.id) === 'following' : false;
    const [followersCount, setFollowersCount] = useState(user?.followers || 0);
    const [connectionsCount, setConnectionsCount] = useState(user?.connections || 0);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isEditInstituteModalOpen, setIsEditInstituteModalOpen] = useState(false);
    const [isEditImageModalOpen, setIsEditImageModalOpen] = useState(false);
    const [imageModalType, setImageModalType] = useState<'profileImage' | 'coverImage'>('profileImage');
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [currentUserProfile, setCurrentUserProfile] = useState(user);
    const [currentInstituteProfile, setCurrentInstituteProfile] = useState(institution);
    const [isLoading, setIsLoading] = useState({
        follow: false,
        connect: false,
        accept: false,
        reject: false,
    });

    // Existing Links management state
    const [links, setLinks] = useState<string[]>([]);
    const [newLink, setNewLink] = useState("");
    const [isSavingLink, setIsSavingLink] = useState(false);
    const [isLoadingLinks, setIsLoadingLinks] = useState(false);

    // New Social Media Links state
    const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>([]);
    const [isLoadingSocialLinks, setIsLoadingSocialLinks] = useState(false);

    const isOwnProfile = currentUser?.id === user?.id;
    const isOwnInstitute = userType === 'INSTITUTE';

    const connectionStatus = currentUser?.id && user?.id
        ? getConnectionStatus(currentUser.id, user.id)
        : 'none';

    const isConnected = connectionStatus === 'connected';
    const hasPendingRequest = connectionStatus === 'pending_sent';
    const hasIncomingRequest = connectionStatus === 'pending_received';

    const loadConnectionsData = useCallback(async (userId: string) => {
        try {
            await ensureConnectionsLoaded(userId);
            await ensureFollowedUsersLoaded();
        } catch (error) {
            console.error('Error loading connections data:', error);
        }
    }, [ensureConnectionsLoaded, ensureFollowedUsersLoaded]);

    const handleConnectionsClick = () => {
        if (isOwnProfile || isOwnInstitute) {
            router.push('/my-networks?tab=connections');
        }
    };

    const handleFollowersClick = () => {
        if (isOwnProfile || isOwnInstitute) {
            router.push('/my-networks?tab=followers');
        }
    };

    useEffect(() => {
        if (user) {
            setFollowersCount(user.followers || 0);
            setConnectionsCount(user.connections || 0);
        }
    }, [user]);

    // Fetch current user on mount
    useEffect(() => {
        const token = getAuthToken();
        if (token && !currentUser) {
            fetchCurrentUser();
        }
    }, [currentUser, fetchCurrentUser]);


    useEffect(() => {
        if (currentUser?.id) {
            loadConnectionsData(currentUser.id);
        }
    }, [currentUser?.id, loadConnectionsData]);

    // Fetch user links
    useEffect(() => {
        const fetchLinks = async () => {
            if (isOwnProfile && currentUser?.id) {
                setIsLoadingLinks(true);
                try {
                    const data = await getLinks();
                    if (Array.isArray(data)) {
                        setLinks(data);
                    } else if (data && 'links' in data && Array.isArray(data.links)) {
                        setLinks(data.links);
                    } else {
                        setLinks([]);
                    }
                } catch (error) {
                    console.error("Failed to fetch links:", error);
                } finally {
                    setIsLoadingLinks(false);
                }
            }
        };
        fetchLinks();
    }, [isOwnProfile, currentUser?.id]);

    // Fetch Social Media Links
    const fetchSocialLinks = useCallback(async () => {
        const targetId = institution ? institution.id : user?.id;
        if (!targetId) return;

        setIsLoadingSocialLinks(true);
        try {
            if (institution) {
                const data = await getInstituteSocialMediaLinks(targetId);
                setSocialLinks(data);
            } else {
                const data = await getUserSocialMediaLinks(targetId);
                setSocialLinks(data);
            }
        } catch (error) {
            console.error("Failed to fetch social media links:", error);
        } finally {
            setIsLoadingSocialLinks(false);
        }
    }, [institution, user?.id]);

    useEffect(() => {
        fetchSocialLinks();
    }, [fetchSocialLinks]);

    const handleFollow = async () => {
        if (!currentUser?.id) {
            router.push('/auth');
            return;
        }

        if (!user?.id || isLoading.follow || isOwnProfile) return;

        setIsLoading((prev) => ({ ...prev, follow: true }));
        try {
            const poster_type: "user" | "institute" = institution ? "institute" : "user";

            if (isFollowing) {
                await unfollowUserAction(user.id, poster_type);
                setFollowersCount((prev) => prev - 1);
            } else {
                await followUserAction(user.id, poster_type);
                setFollowersCount((prev) => prev + 1);
            }
        } catch (error) {
            console.error("Error toggling follow:", error);
        } finally {
            setIsLoading((prev) => ({ ...prev, follow: false }));
        }
    };

    const handleConnect = async () => {
        if (!currentUser?.id) {
            router.push('/auth');
            return;
        }

        if (!user?.id || isLoading.connect || isOwnProfile) return;

        setIsLoading((prev) => ({ ...prev, connect: true }));
        try {
            const poster_type: "user" | "institute" = institution ? "institute" : "user";

            if (isConnected || hasPendingRequest) {
                await disconnectFromUser(currentUser.id, user.id, poster_type);
                if (isConnected) {
                    setConnectionsCount((prev) => prev - 1);
                }
            } else {
                await connectToUser(currentUser.id, user.id, poster_type);
            }
        } catch (error) {
            console.error("Error toggling connection:", error);
        } finally {
            setIsLoading((prev) => ({ ...prev, connect: false }));
        }
    };

    const handleAcceptConnection = async () => {
        if (!user?.id || !currentUser?.id || isLoading.accept || isOwnProfile) return;

        setIsLoading((prev) => ({ ...prev, accept: true }));
        try {
            await acceptConnectionRequest(currentUser.id, user.id);
            setConnectionsCount((prev) => prev + 1);
        } catch (error) {
            console.error("Error accepting connection:", error);
        } finally {
            setIsLoading((prev) => ({ ...prev, accept: false }));
        }
    };

    const handleRejectConnection = async () => {
        if (!user?.id || !currentUser?.id || isLoading.reject || isOwnProfile) return;

        setIsLoading((prev) => ({ ...prev, reject: true }));
        try {
            const poster_type: "user" | "institute" = institution ? "institute" : "user";
            await rejectConnectionRequest(currentUser.id, user.id, poster_type);
        } catch (error) {
            console.error("Error rejecting connection:", error);
        } finally {
            setIsLoading((prev) => ({ ...prev, reject: false }));
        }
    };

    // Links management handlers
    const validateUrl = (url: string): boolean => {
        try {
            // Add protocol if missing
            const urlToTest = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
            new URL(urlToTest);
            return true;
        } catch {
            return false;
        }
    };

    const handleAddLink = async () => {
        const trimmedLink = newLink.trim();

        if (!trimmedLink) {
            toast.error("Link cannot be empty");
            return;
        }

        if (!validateUrl(trimmedLink)) {
            toast.error("Please enter a valid URL");
            return;
        }

        // Check for duplicates
        const linkExists = links.some(l => l.toLowerCase() === trimmedLink.toLowerCase());
        if (linkExists) {
            toast.error("Link already exists");
            setNewLink("");
            return;
        }

        setIsSavingLink(true);
        try {
            const updatedLinks = [...links, trimmedLink];
            await createLinks({ links: updatedLinks });
            setLinks(updatedLinks);
            setNewLink("");
            toast.success("Link added");
        } catch (e) {
            console.error("Failed to add link:", e);
            toast.error("Failed to add link");
        } finally {
            setIsSavingLink(false);
        }
    };

    const handleDeleteLink = async (linkToDelete: string) => {
        if (!confirm(`Remove "${linkToDelete}"?`)) return;

        setIsSavingLink(true);
        try {
            const updatedLinks = links.filter(l => l !== linkToDelete);
            await createLinks({ links: updatedLinks });
            setLinks(updatedLinks);
            toast.success("Link removed");
        } catch (e) {
            console.error("Failed to remove link:", e);
            toast.error("Failed to remove link");
        } finally {
            setIsSavingLink(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddLink();
        }
    };

    const handleMessage = () => {
        if (!currentUser?.id) {
            router.push('/auth');
            return;
        }

        if (!user?.id) return;

        // Navigate to messages page and select this user as chat recipient
        router.push(`/messages?user=${user.id}`);
    };

    const handleUserUpdate = (updatedUser: User) => {
        setCurrentUserProfile(prev => {
            if (!prev) return updatedUser;
            const merged = { ...prev, ...updatedUser };
            // Defensive: preserve images if updatedUser has them as null/undefined
            if (!updatedUser.profile_picture && prev.profile_picture) merged.profile_picture = prev.profile_picture;
            if (!updatedUser.banner_picture && prev.banner_picture) merged.banner_picture = prev.banner_picture;
            return merged;
        });
        setFollowersCount(updatedUser.followers || 0);
        setConnectionsCount(updatedUser.connections || 0);
        if (onUserUpdate) {
            onUserUpdate(updatedUser);
        }
    };

    const handleInstituteUpdate = (updatedInstitution: Institution) => {
        setCurrentInstituteProfile(prev => {
            if (!prev) return updatedInstitution;
            const merged = { ...prev, ...updatedInstitution };
            // Defensive: preserve images if updatedInstitution has them as null/undefined
            if (!updatedInstitution.profile_picture && prev.profile_picture) merged.profile_picture = prev.profile_picture;
            if (!updatedInstitution.banner_picture && prev.banner_picture) merged.banner_picture = prev.banner_picture;
            return merged;
        });
        setFollowersCount(updatedInstitution.followers || 0);
        if (onInstituteUpdate) {
            onInstituteUpdate(updatedInstitution);
        }
    };

    const handleProfilePictureUpdate = (newUrl: string | null) => {
        if (institution) {
            handleInstituteProfilePictureUpdate(newUrl || "");
        } else {
            const updatedUser = {
                ...currentUserProfile,
                profile_picture: newUrl
            } as User;

            setCurrentUserProfile(updatedUser);
            if (onUserUpdate) onUserUpdate(updatedUser);
            fetchCurrentUser();
        }
    };

    const handleCoverPictureUpdate = (newUrl: string | null) => {
        if (institution) {
            const updatedInstitution = {
                ...currentInstituteProfile,
                banner_picture: newUrl
            } as Institution;
            setCurrentInstituteProfile(updatedInstitution);
            if (onInstituteUpdate) onInstituteUpdate(updatedInstitution);
        } else {
            const updatedUser = {
                ...currentUserProfile,
                banner_picture: newUrl
            } as User;
            setCurrentUserProfile(updatedUser);
            if (onUserUpdate) onUserUpdate(updatedUser);
        }
    };

    const handleInstituteProfilePictureUpdate = (newUrl: string | null) => {
        const updatedInstitution = {
            ...currentInstituteProfile,
            profile_picture: newUrl
        } as Institution;

        setCurrentInstituteProfile(updatedInstitution);
        if (onInstituteUpdate) onInstituteUpdate(updatedInstitution);
    };

    const displayUser = currentUserProfile || user;
    const displayInstitution = currentInstituteProfile || institution;

    // Utility: ensure image URLs always have https:// and are safe for next/image
    const buildImageUrl = (raw?: string | null): string | null => {
        if (!raw) return null;
        if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
        if (raw.startsWith('/')) return raw; // Relative path — valid for next/image
        // Missing protocol — assume https (CloudFront case)
        return `https://${raw}`;
    };

    // Get the proper profile picture URL
    const getDisplayProfilePicture = (): string | null => {
        const entityToDisplay = institution ? displayInstitution : displayUser;
        return buildImageUrl(entityToDisplay?.profile_picture);
    };

    const getDisplayBannerPicture = (): string => {
        const entityToDisplay = institution ? displayInstitution : displayUser;
        return buildImageUrl(entityToDisplay?.banner_picture) || "/banner.png";
    };

    const renderLocation = () => {
        if (institution) {
            const parts = [displayInstitution?.city, displayInstitution?.country].filter(Boolean);
            return parts.length > 0 ? parts.join(", ") : null;
        }
        return displayUser?.location;
    };

    const getProfileUrl = () => {
        if (typeof window === "undefined") return "";
        const id = institution ? displayInstitution?.id : displayUser?.id;
        if (!id) return "";
        return `${window.location.origin}/profile/${id}`;
    };

    const handleCopyLink = () => {
        const url = getProfileUrl();
        if (url) {
            navigator.clipboard.writeText(url);
            toast.success("Profile link copied!");
        }
    };

    return (
        <div className="bg-white rounded-xl overflow-hidden">
            <div className="relative h-32 sm:h-36 md:h-66">
                <Image
                    src={getDisplayBannerPicture()}
                    alt="Cover photo"
                    className="w-full h-full object-cover"
                    width={1200}
                    height={400}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                {(isOwnProfile || isOwnInstitute) && (
                    <button
                        onClick={() => {
                            setImageModalType('coverImage');
                            setIsEditImageModalOpen(true);
                        }}
                        className="absolute top-4 right-4 bg-black/50 hover:bg-black/60 text-white backdrop-blur-sm px-3 py-2 text-sm rounded-full flex items-center transition-colors z-10"
                    >
                        <Camera className="h-4 w-4 mr-2" />
                        Edit cover
                    </button>
                )}

                <div className="absolute -bottom-16 left-6">
                    <div className="relative">
                        <UserAvatar
                            name={(institution ? displayInstitution?.name : displayUser?.firstName) || "User"}
                            src={getDisplayProfilePicture() || undefined}
                            className="h-32 w-32 border-4 border-white shadow-lg text-4xl"
                        />
                        {(isOwnProfile || isOwnInstitute) && (
                            <button
                                onClick={() => {
                                    setImageModalType('profileImage');
                                    setIsEditImageModalOpen(true);
                                }}
                                className="absolute bottom-2 right-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full p-2 shadow-sm transition-colors cursor-pointer z-10"
                            >
                                <Camera className="h-4 w-4 text-gray-600" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="pt-16 pb-4 px-6 relative">
                <div className="absolute top-4 right-6 flex gap-2">
                    {(isOwnProfile || isOwnInstitute) ? (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full"
                                onClick={() => setIsShareModalOpen(true)}
                            >
                                <Share2 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full"
                                onClick={() => {
                                    if (institution && isOwnInstitute) {
                                        setIsEditInstituteModalOpen(true);
                                    } else {
                                        setIsEditModalOpen(true);
                                    }
                                }}
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                {institution && isOwnInstitute ? "Edit Institution" : "Edit Profile"}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full"
                                onClick={() => setIsShareModalOpen(true)}
                            >
                                <Share2 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full"
                                onClick={handleMessage}
                            >
                                <MessageSquare className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                </div>
                <div className="mb-2">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 font-sans mt-4">
                        {(institution ? displayInstitution?.name : displayUser?.firstName) || "Loading..."}
                        {(institution ? displayInstitution?.verified : displayUser?.verified) && (
                            <CheckCircle className="h-5 w-5 text-blue-500" />
                        )}
                    </h1>
                    {/* <p className="text-gray-500 text-sm">@{displayUser?.email?.split('@')[0] || 'username'}</p> */}
                </div>
                {(institution ? (displayInstitution?.headline) : (displayUser?.headline)) && (
                    <div className="mb-3">
                        <p className="text-gray-900 leading-relaxed">
                            {institution ? displayInstitution?.headline : displayUser?.headline}
                        </p>
                    </div>
                )}
                {(institution ? (displayInstitution?.about) : (displayUser?.about)) && (
                    <div className="mb-3">
                        <p className="text-gray-900 leading-relaxed">
                            {institution ? displayInstitution?.about : displayUser?.about}
                        </p>
                    </div>
                )}

                <div className="space-y-2 text-gray-500 text-sm mb-3">
                    {renderLocation() && (
                        <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{renderLocation()}</span>
                        </div>
                    )}

                    <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <span>
                            {institution
                                ? (displayInstitution?.type || "Institution")
                                : (displayUser?.role || "Healthcare Professional")
                            }
                        </span>
                        {!institution && displayUser?.specialization && (
                            <>
                                <span className="mx-1">•</span>
                                <GraduationCap className="h-4 w-4" />
                                <span>{displayUser.specialization}</span>
                            </>
                        )}

                        {/* Displaying affiliated university for institute/hospital if available as 'expertise' analog or simple extra info? */}
                        {institution && displayInstitution?.affiliatedUniversity && (
                            <>
                                <span className="mx-1">•</span>
                                {/* <University className="h-4 w-4" /> */}
                                <span>{displayInstitution.affiliatedUniversity}</span>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        <Link2 className="h-4 w-4" />
                        <a href={getProfileUrl() || "#"} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate max-w-[200px] sm:max-w-xs">
                            {getProfileUrl() ? getProfileUrl().replace(/^https?:\/\//, '') : 'Loading link...'}
                        </a>
                        <button
                            onClick={handleCopyLink}
                            className="ml-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Copy profile link"
                        >
                            <Copy className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    {/* New Social Media Links Icons */}
                    {socialLinks.length > 0 && (
                        <div className="flex flex-wrap items-center gap-3 mt-4">
                            {socialLinks.map((link) => {
                                let IconPath = "/icons/link.svg"; // Fallback icon path or just use Link2
                                switch (link.platform) {
                                    case 'LINKEDIN': IconPath = "/icons/linkedin.svg"; break;
                                    case 'FACEBOOK': IconPath = "/icons/facebook.svg"; break;
                                    case 'INSTAGRAM': IconPath = "/icons/instagram.svg"; break;
                                    case 'TWITTER': IconPath = "/icons/twitter.svg"; break;
                                }
                                return (
                                    <a
                                        key={link.id}
                                        href={link.link.startsWith('http') ? link.link : `https://${link.link}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 hover:text-blue-500 transition-colors"
                                        title={link.platform}
                                    >
                                        <Badge variant="outline" className="flex gap-2 items-center px-3 py-1 cursor-pointer hover:bg-gray-50">
                                            <span>{link.platform.charAt(0) + link.platform.slice(1).toLowerCase()}</span>
                                            <ExternalLink className="h-3 w-3" />
                                        </Badge>
                                    </a>
                                );
                            })}
                        </div>
                    )}

                    {/* Links Management Section - Only for own profile */}

                </div>
            </div>

            {/* Image Edit Modal */}
            <EditImageModal
                isOpen={isEditImageModalOpen}
                onClose={() => setIsEditImageModalOpen(false)}
                onUpdate={imageModalType === 'profileImage' ? handleProfilePictureUpdate : handleCoverPictureUpdate}
                type={imageModalType}
                isInstitute={!!institution}
                currentImage={imageModalType === 'profileImage' ? getDisplayProfilePicture() : (institution ? displayInstitution?.banner_picture : displayUser?.banner_picture)}
                title={imageModalType === 'profileImage' ? "Profile Picture" : "Cover Photo"}
            />

            {/* Edit Profile Modal */}
            {isOwnProfile && displayUser && (
                <EditProfileModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    user={displayUser as any} // Type cast to handle different User types
                    onUpdate={handleUserUpdate}
                    onLinksChange={fetchSocialLinks}
                />
            )}

            {/* Edit Institute Modal */}
            {isOwnInstitute && currentInstituteProfile && (
                <EditInstituteModal
                    isOpen={isEditInstituteModalOpen}
                    onClose={() => setIsEditInstituteModalOpen(false)}
                    institution={currentInstituteProfile}
                    onUpdate={handleInstituteUpdate}
                    onLinksChange={fetchSocialLinks}
                />
            )}

            {/* Share Modal - conditionally render for user or institution */}
            {institution ? (
                <InstitutionShareModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    institution={institution}
                />
            ) : displayUser && (
                <ProfileShareModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    user={displayUser}
                />
            )}
        </div>
    );
};
