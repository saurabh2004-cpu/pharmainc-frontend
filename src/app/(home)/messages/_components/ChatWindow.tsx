import React, { useEffect, useRef, useState } from 'react';
import { Send, Paperclip, Image as ImageIcon, Video, FileText, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserAvatar } from '@/components/UserAvatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Conversation, Message } from '@/types/message';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { VoiceRecorder } from './VoiceRecorder';
import { AudioMessage } from './AudioMessage';

interface ChatWindowProps {
    conversation: Conversation;
    messages: Message[];
    currentUserRole: string; // 'USER' | 'INSTITUTE'
    currentUserId: string;
    onSendMessage: (content?: string, media?: File) => void;
    onSendVoiceMessage?: (audioBlob: Blob) => void;
    isLoadingMessages: boolean;
    onLoadMore?: () => void;
    hasMore?: boolean;
    isLoadingMore?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
    conversation,
    messages,
    currentUserRole,
    currentUserId,
    onSendMessage,
    onSendVoiceMessage,
    isLoadingMessages,
    onLoadMore,
    hasMore,
    isLoadingMore
}) => {
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isVoiceRecording, setIsVoiceRecording] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const prevMessageCountRef = useRef(messages.length);
    const scrollHeightRef = useRef(0);
    const isLoadingMoreRef = useRef(false);

    // Auto-scroll to bottom or preserve scroll position
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!scrollRef.current) return;

            const isAddingOlderMessages =
                messages.length > prevMessageCountRef.current &&
                isLoadingMoreRef.current;

            if (isAddingOlderMessages) {
                // If we added older messages, stay at the same relative position
                const newScrollHeight = scrollRef.current.scrollHeight;
                const scrollDiff = newScrollHeight - scrollHeightRef.current;

                // Adjust scroll position instantly
                scrollRef.current.scrollTop = scrollRef.current.scrollTop + scrollDiff;
                isLoadingMoreRef.current = false;
            } else if (prevMessageCountRef.current === 0) {
                // Initial load: snap to bottom instantly
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            } else if (messages.length > prevMessageCountRef.current) {
                // New message received: smoothly scroll
                if (messagesEndRef.current) {
                    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
                } else {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }
            }

            prevMessageCountRef.current = messages.length;
            scrollHeightRef.current = scrollRef.current.scrollHeight;
        }, 50);

        return () => clearTimeout(timer);
    }, [messages]);

    const handleScroll = () => {
        if (!scrollRef.current) return;

        // Trigger load more when within 10px of the top to ensure the event fires reliably
        if (scrollRef.current.scrollTop <= 10 && hasMore && !isLoadingMore && !isLoadingMessages) {
            isLoadingMoreRef.current = true;
            scrollHeightRef.current = scrollRef.current.scrollHeight;
            if (onLoadMore) {
                onLoadMore();
            }
        }
    };

    const handleSend = async () => {
        if ((!newMessage.trim()) && !fileInputRef.current?.files?.length) return;

        setIsSending(true);
        try {
            await onSendMessage(newMessage);
            setNewMessage('');
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onSendMessage(undefined, file);
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const participant = conversation.participant;
    console.log("participant", participant);
    const displayName = participant.firstName
        ? `${participant.firstName} ${participant.lastName || ''}`
        : participant.name || 'Unknown';

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Header */}
            <div className="p-4 bg-white border-b border-gray-200 flex items-center gap-3 shadow-sm">
                <UserAvatar name={displayName} src={participant.profile_picture} className="h-10 w-10" />
                <div>
                    <h3 className="font-semibold">{displayName}</h3>
                    <p className="text-xs text-gray-500">{participant.role || ''}</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef} onScroll={handleScroll}>
                {isLoadingMessages ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading messages...
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">Start the conversation!</div>
                ) : (
                    <>
                        {isLoadingMore && (
                            <div className="flex justify-center py-4 text-blue-500">
                                <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                        )}
                        {messages.map((msg) => {
                            const isMe = msg.senderId === currentUserId;
                            // Checking senderId is the most robust way to determine ownership

                            return (
                                <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                                    <div className={cn(
                                        "max-w-[70%] rounded-lg p-3 shadow-sm",
                                        isMe ? "bg-blue-600 text-white rounded-br-none" : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                                    )}>
                                        {msg.mediaUrl && (
                                            <div className="mb-2">
                                                {msg.mediaType === 'IMAGE' ? (
                                                    <img src={msg.mediaUrl} alt="Shared image" className="rounded-md max-h-60 w-auto object-cover" />
                                                ) : msg.mediaType === 'VIDEO' ? (
                                                    <video src={msg.mediaUrl} controls className="rounded-md max-h-60 w-auto" />
                                                ) : msg.mediaType === 'VOICE' ? (
                                                    <AudioMessage url={msg.mediaUrl} isMe={isMe} />
                                                ) : (
                                                    <a href={msg.mediaUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-black/10 p-2 rounded hover:bg-black/20 text-sm">
                                                        <FileText className="h-4 w-4" /> Download PDF
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                        {msg.content && <p className="text-sm whitespace-pre-wrap">{msg.content}</p>}
                                        <div className={cn("text-[10px] mt-1 text-right opacity-70", isMe ? "text-blue-100" : "text-gray-400")}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            {isMe && (
                                                <span className="ml-1">{msg.isRead ? '✓✓' : '✓'}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center gap-2">
                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        accept="image/*,video/*,application/pdf"
                        onChange={handleFileSelect}
                    />
                    <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} className="text-gray-500 hover:text-blue-600">
                        <Paperclip className="h-5 w-5" />
                    </Button>
                    {isVoiceRecording ? (
                        <VoiceRecorder
                            onSend={(blob) => {
                                if (onSendVoiceMessage) onSendVoiceMessage(blob);
                                setIsVoiceRecording(false);
                            }}
                            onCancel={() => setIsVoiceRecording(false)}
                        />
                    ) : (
                        <>
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a message..."
                                className="flex-1"
                                disabled={isSending}
                                autoFocus
                            />
                            <Button variant="ghost" size="icon" onClick={() => setIsVoiceRecording(true)} className="text-gray-500 hover:text-blue-600">
                                <Mic className="h-5 w-5" />
                            </Button>
                            <Button onClick={handleSend} disabled={isSending || (!newMessage.trim() && !fileInputRef.current?.files?.length)} className="bg-blue-600 hover:bg-blue-700">
                                <Send className="h-5 w-5" />
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
