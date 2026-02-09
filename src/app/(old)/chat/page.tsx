"use client";

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Send, Phone, Video, MoreVertical, Smile } from 'lucide-react';
import Navbar from '../_components/Navbar';
import Link from 'next/link';

const Chat = () => {
  const [newMessage, setNewMessage] = useState('');
  
  // Dummy conversation data
  const conversation = {
    id: 1,
    name: "Dr. Robert Kim",
    avatar: "https://i.pravatar.cc/300?img=1",
    title: "Neurologist, Stroke Specialist",
    hospital: "Mass General Hospital",
    online: true
  };

  const messages = [
    {
      id: 1,
      sender: "Dr. Robert Kim",
      content: "Hi Dr. Chen! I hope you're doing well. I wanted to reach out regarding a potential collaboration opportunity.",
      timestamp: "10:30 AM",
      isOwn: false
    },
    {
      id: 2,
      sender: "You",
      content: "Hello Dr. Kim! Great to hear from you. I'd be very interested to learn more about this opportunity.",
      timestamp: "10:32 AM",
      isOwn: true
    },
    {
      id: 3,
      sender: "Dr. Robert Kim",
      content: "Wonderful! We're working on a groundbreaking study about cardiac-neurological connections in stroke patients. Given your expertise in interventional cardiology, your insights would be invaluable.",
      timestamp: "10:35 AM",
      isOwn: false
    },
    {
      id: 4,
      sender: "You",
      content: "That sounds fascinating! The intersection of cardiology and neurology has always intrigued me. Could you share more details about the methodology you're planning to use?",
      timestamp: "10:38 AM",
      isOwn: true
    },
    {
      id: 5,
      sender: "Dr. Robert Kim",
      content: "Absolutely! We're planning a multi-center study involving 500 patients. We'll be using advanced cardiac imaging alongside neurological assessments. I can send you the detailed protocol if you're interested.",
      timestamp: "10:42 AM",
      isOwn: false
    },
    {
      id: 6,
      sender: "You",
      content: "Yes, please! I'd love to review the protocol. This could be an excellent opportunity for our departments to collaborate.",
      timestamp: "10:45 AM",
      isOwn: true
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to a backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-16 max-w-4xl mx-auto px-4 py-6">
        <Card className="h-[calc(100vh-120px)] flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b bg-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/messages">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conversation.avatar} alt={conversation.name} />
                    <AvatarFallback>
                      {conversation.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{conversation.name}</h2>
                  <p className="text-sm text-gray-600">{conversation.title}</p>
                  <p className="text-xs text-gray-500">{conversation.hospital}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="p-2">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-xs lg:max-w-md ${message.isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!message.isOwn && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={conversation.avatar} alt={conversation.name} />
                      <AvatarFallback>RK</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`rounded-2xl px-4 py-2 ${
                    message.isOwn 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-900 border'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Timestamp for last message */}
            <div className="text-center">
              <span className="text-xs text-gray-500">10:45 AM</span>
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  rows={1}
                  className="w-full resize-none border border-gray-300 rounded-full px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2"
                >
                  <Smile className="h-4 w-4 text-gray-400" />
                </Button>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
