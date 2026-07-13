import React, { useState } from 'react';
import { UserAvatar } from '@/components/UserAvatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Conversation } from '@/types/message';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
    const [searchQuery, setSearchQuery] = useState('');

    const filteredConversations = conversations.filter(conversation => {
        const { participant } = conversation;
        const displayName = participant.firstName
            ? `${participant.firstName} ${participant.lastName || ''}`
            : participant.name || 'Unknown';
        return displayName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="flex flex-col h-full border-r border-gray-200">
            <div className="p-4 border-b border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Messages</h2>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-gray-50 border-gray-200 rounded-full h-10"
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        {searchQuery ? 'No matching conversations.' : 'No conversations yet.'}
                    </div>
                ) : (
                    filteredConversations.map((conversation) => {
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
                                            (() => {
                                                const content = lastMessage.content;
                                                if (content && content.startsWith('**Feedback Type:**\n')) {
                                                    const parts = content.split('\n\n**Message:**\n');
                                                    if (parts.length === 2) {
                                                        return parts[1];
                                                    }
                                                }
                                                return content || (lastMessage.mediaUrl ? 'Sent a file' : '');
                                            })()
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
