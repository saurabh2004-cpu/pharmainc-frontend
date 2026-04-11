"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getConversations, getMessages, sendMessage, markAsRead, sendVoiceMessage } from '@/lib/api/services/messages';
import { connectSocket, getSocket } from '@/lib/socket';
import { getAuthToken } from '@/lib/api/utils';
import { Conversation, Message } from '@/types/message';
import ConversationList from './_components/ConversationList';
import ChatWindow from './_components/ChatWindow';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useChatStore } from '@/store/chatStore';

const MessagesContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string, role: string } | null>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const { fetchUnreadCount } = useChatStore();

  // Socket Handler: New Message
  const handleNewMessage = useCallback((message: Message) => {
    console.log('Real-time message received:', message);

    setConversations(prev => {
      const exists = prev.find(c => c.id === message.conversationId);
      if (exists) {
        return prev.map(c =>
          c.id === message.conversationId
            ? { ...c, lastMessage: message, unreadCount: c.lastMessage?.id === message.id ? c.unreadCount : c.unreadCount + 1, updatedAt: message.createdAt }
            : c
        ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      } else {
        getConversations().then(data => setConversations(data));
        return prev;
      }
    });

    if (selectedConversationId === message.conversationId) {
      setMessages(prev => {
        if (prev.some(m => m.id === message.id)) return prev;
        return [...prev, message];
      });
      markAsRead(message.conversationId).then(() => {
        fetchUnreadCount();
      });
      setConversations(prev => prev.map(c =>
        c.id === message.conversationId ? { ...c, unreadCount: 0 } : c
      ));
    }
  }, [selectedConversationId, fetchUnreadCount]);

  // Socket Handler: New Conversation
  const handleNewConversation = useCallback((conversation: Conversation) => {
    setConversations(prev => [conversation, ...prev]);
  }, []);

  // Socket Handler: Messages Read
  const handleMessagesRead = useCallback(({ conversationId }: { conversationId: string }) => {
    setMessages(prev => prev.map(m =>
      (m.conversationId === conversationId && !m.isRead) ? { ...m, isRead: true } : m
    ));
  }, []);

  // Initial Load & Auth
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/auth');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setCurrentUser({ id: payload.id, role: payload.role });

      // Connect Socket
      const socket = connectSocket(token);

      // Remove existing listeners first to prevent duplicates on re-renders
      socket.off('new_message', handleNewMessage);
      socket.off('new_conversation', handleNewConversation);
      socket.off('messages_read', handleMessagesRead);

      // Socket Events
      socket.on('new_message', handleNewMessage);
      socket.on('new_conversation', handleNewConversation);
      socket.on('messages_read', handleMessagesRead);

      // Cleanup
      return () => {
        socket.off('new_message', handleNewMessage);
        socket.off('new_conversation', handleNewConversation);
        socket.off('messages_read', handleMessagesRead);
      };

    } catch (e) {
      console.error('Invalid token', e);
      router.push('/login');
    }
  }, [router, handleNewMessage, handleNewConversation, handleMessagesRead]);

  // Fetch Conversations
  useEffect(() => {
    if (!currentUser) return;

    const fetchConvos = async () => {
      try {
        const data = await getConversations();
        setConversations(data);

        const urlUserId = searchParams.get('user');

        if (urlUserId) {
          const targetConvo = data.find(c => c.participant.id === urlUserId);
          if (targetConvo) {
            setSelectedConversationId(targetConvo.id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch conversations", error);
        toast.error("Failed to load conversations");
      } finally {
        setLoadingConversations(false);
      }
    };

    fetchConvos();
  }, [currentUser, searchParams]);

  // Fetch Messages when conversation selected
  useEffect(() => {
    if (!selectedConversationId) return;

    const fetchInitialMessages = async () => {
      setLoadingMessages(true);
      setPage(1);
      setHasMore(true);

      try {
        const msgs = await getMessages(selectedConversationId, 1);
        setMessages(msgs);
        setHasMore(msgs.length === 20);

        await markAsRead(selectedConversationId);

        setConversations(prev => prev.map(c =>
          c.id === selectedConversationId ? { ...c, unreadCount: 0 } : c
        ));

        // Ensure global unread count stays in sync
        fetchUnreadCount();
      } catch (error) {
        console.error("Failed to fetch messages", error);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchInitialMessages();

    const socket = getSocket();
    if (!socket) return;

    const joinRoom = () => {
      if (socket.connected) {
        socket.emit('join_conversation', selectedConversationId);
        console.log('Joined room:', selectedConversationId);
      }
    };

    // Join now if connected
    joinRoom();

    // Also join on connection/reconnection
    socket.on('connect', joinRoom);

    return () => {
      socket.off('connect', joinRoom);
      if (socket.connected) {
        socket.emit('leave_conversation', selectedConversationId);
      }
    };
  }, [selectedConversationId, fetchUnreadCount]);


  // Load More Messages
  const handleLoadMore = useCallback(async () => {
    if (!selectedConversationId || !hasMore || loadingMore) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const olderMsgs = await getMessages(selectedConversationId, nextPage);

      if (olderMsgs.length < 20) {
        setHasMore(false);
      }

      setMessages(prev => {
        // Filter out any messages we already have to prevent duplicates
        const existingIds = new Set(prev.map(m => m.id));
        const newUniqueMsgs = olderMsgs.filter(m => !existingIds.has(m.id));
        return [...newUniqueMsgs, ...prev];
      });
      setPage(nextPage);
    } catch (error) {
      console.error("Failed to load older messages", error);
      toast.error("Failed to load older messages");
    } finally {
      setLoadingMore(false);
    }
  }, [selectedConversationId, page, hasMore, loadingMore]);

  const handleSendMessage = async (content?: string, media?: File) => {
    if (!selectedConversationId) return;

    try {
      const newMessage = await sendMessage({
        conversationId: selectedConversationId,
        content,
        media,
        mediaType: media ? (media.type.startsWith('image') ? 'IMAGE' : media.type.startsWith('video') ? 'VIDEO' : 'PDF') : undefined
      });

      setMessages(prev => {
        if (prev.some(m => m.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });

      setConversations(prev => prev.map(c =>
        c.id === selectedConversationId
          ? { ...c, lastMessage: newMessage, updatedAt: newMessage.createdAt }
          : c
      ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));

    } catch (error) {
      console.error("Send message failed", error);
      toast.error("Failed to send message");
    }
  };

  const handleSendVoiceMessage = async (audioBlob: Blob) => {
    if (!selectedConversationId) return;

    try {
      const newMessage = await sendVoiceMessage(selectedConversationId, audioBlob);
      setMessages(prev => {
        if (prev.some(m => m.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });
      setConversations(prev => prev.map(c =>
        c.id === selectedConversationId
          ? { ...c, lastMessage: newMessage, updatedAt: newMessage.createdAt }
          : c
      ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
    } catch (error) {
      console.error("Voice send failed", error);
      toast.error("Failed to send voice message");
    }
  };

  if (loadingConversations) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  return (
    <div className="container mx-auto px-2 h-[calc(100vh-35px)] mt-4 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="flex w-full h-full md:grid md:grid-cols-3">
        {/* Left Column: Conversation List */}
        <div className={`md:col-span-1 h-full overflow-hidden w-full md:block ${selectedConversation ? 'hidden' : 'block'}`}>
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversationId || undefined}
            onSelectConversation={setSelectedConversationId}
          />
        </div>
        
        {/* Right Column: Chat Window */}
        <div className={`md:col-span-2 h-full overflow-hidden md:border-l md:border-gray-200 w-full md:flex md:flex-col ${selectedConversation ? 'flex flex-col' : 'hidden md:block'}`}>
          {selectedConversation ? (
            <ChatWindow
              key={selectedConversation.id}
              conversation={selectedConversation}
              messages={messages}
              currentUserRole={currentUser?.role || ''}
              currentUserId={currentUser?.id || ''}
              onSendMessage={handleSendMessage}
              onSendVoiceMessage={handleSendVoiceMessage}
              isLoadingMessages={loadingMessages}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              isLoadingMore={loadingMore}
              onBack={() => setSelectedConversationId(null)}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-slate-50 text-gray-400">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function MessagesPage() {
  return (
    <React.Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <MessagesContent />
    </React.Suspense>
  );
}