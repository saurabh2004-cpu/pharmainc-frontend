"use client"

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
    name?: string;
    src?: string;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const AVATAR_COLORS = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-rose-500',
    'bg-amber-500',
    'bg-violet-500',
    'bg-cyan-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
];

export function UserAvatar({ name, src, className, onClick }: UserAvatarProps) {
    const displayName = name || 'User';

    // Get initials (max 2 characters)
    const getInitials = (str: string) => {
        const parts = str.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    // Deterministically get a color based on the name
    const getColor = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % AVATAR_COLORS.length;
        return AVATAR_COLORS[index];
    };

    const initials = getInitials(displayName);
    const bgColor = getColor(displayName);

    return (
        <Avatar className={cn(className, "border-0")} onClick={onClick}>
            {src && <AvatarImage src={src} alt={displayName} className="object-cover" />}
            <AvatarFallback className={cn(bgColor, "text-white font-semibold uppercase")}>
                {initials}
            </AvatarFallback>
        </Avatar>
    );
}
