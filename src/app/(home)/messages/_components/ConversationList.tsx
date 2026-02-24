import React from 'react';
import { UserAvatar } from '@/components/UserAvatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Conversation } from '@/types/message';

interface ConversationListProps {
    conversations: Conversation[];
    selectedConversationId?: string;
    onSelectConversation: (id: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
    conversations,
    selectedConversationId,
    onSelectConversation
}) => {
    return (
        <div className="flex flex-col h-full border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Messages</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        No conversations yet.
                    </div>
                ) : (
                    conversations.map((conversation) => {
                        const { id, participant, lastMessage, unreadCount, updatedAt } = conversation;
                        const isSelected = id === selectedConversationId;
                        const displayName = participant.firstName
                            ? `${participant.firstName} ${participant.lastName || ''}`
                            : participant.name || 'Unknown';

                        return (
                            <div
                                key={id}
                                onClick={() => onSelectConversation(id)}
                                className={cn(
                                    "flex items-start gap-3 p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
                                    isSelected && "bg-blue-50 border-l-4 border-l-blue-500"
                                )}
                            >
                                <UserAvatar name={displayName} src={participant.profile_picture} className="h-10 w-10" />
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-medium text-sm truncate">{displayName}</h3>
                                        {/* <span className="text-xs text-gray-400">
                                            {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
                                        </span> */}
                                        <span className="text-xs text-gray-400">
                                            {new Date(updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate mt-1">
                                        {lastMessage ? (
                                            lastMessage.content || (lastMessage.mediaUrl ? 'Sent a file' : '')
                                        ) : (
                                            'No messages yet'
                                        )}
                                    </p>
                                </div>
                                {unreadCount > 0 && (
                                    <Badge variant="destructive" className="rounded-full h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                                        {unreadCount}
                                    </Badge>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ConversationList;
