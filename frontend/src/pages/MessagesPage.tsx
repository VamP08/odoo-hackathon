import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MessageSquare, Send, ArrowLeft, User, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function MessagesPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    searchParams.get('user')
  );
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [userProfiles, setUserProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for now since messaging wasn't fully implemented in backend
  useEffect(() => {
    setMessages([]);
    setUserProfiles([]);
    setLoading(false);
  }, []);

  const sendMessage = (messageData: any) => {
    // TODO: Implement with API call
    console.log('Send message:', messageData);
  };

  const markMessageAsRead = (messageId: string) => {
    // TODO: Implement with API call
    console.log('Mark as read:', messageId);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please log in</h2>
          <Link to="/login" className="text-emerald-600 hover:text-emerald-700">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  // Get conversations grouped by user
  const conversations = messages.reduce((acc, message) => {
    const otherUserId = message.senderId === user.id ? message.receiverId : message.senderId;
    if (!acc[otherUserId]) {
      acc[otherUserId] = [];
    }
    acc[otherUserId].push(message);
    return acc;
  }, {} as Record<string, typeof messages>);

  // Sort conversations by latest message
  const sortedConversations = Object.entries(conversations).sort(([, a], [, b]) => {
    const latestA = Math.max(...a.map(m => new Date(m.timestamp).getTime()));
    const latestB = Math.max(...b.map(m => new Date(m.timestamp).getTime()));
    return latestB - latestA;
  });

  const filteredConversations = sortedConversations.filter(([userId]) => {
    const profile = userProfiles.find(p => p.id === userId);
    return profile?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const selectedConversation = selectedUserId ? conversations[selectedUserId] || [] : [];
  const selectedUserProfile = userProfiles.find(p => p.id === selectedUserId);

  // Mark messages as read when viewing conversation
  useEffect(() => {
    if (selectedUserId) {
      selectedConversation
        .filter(msg => msg.receiverId === user.id && !msg.read)
        .forEach(msg => markMessageAsRead(msg.id));
    }
  }, [selectedUserId, selectedConversation, user.id, markMessageAsRead]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUserId) return;

    sendMessage({
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      receiverId: selectedUserId,
      content: newMessage.trim(),
      read: false
    });

    setNewMessage('');
  };

  const getUnreadCount = (userId: string) => {
    return conversations[userId]?.filter(msg => 
      msg.receiverId === user.id && !msg.read
    ).length || 0;
  };

  const getLastMessage = (userId: string) => {
    const userMessages = conversations[userId] || [];
    return userMessages.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Communicate with other ReWear community members</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ height: '600px' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {filteredConversations.map(([userId]) => {
                      const profile = userProfiles.find(p => p.id === userId);
                      const lastMessage = getLastMessage(userId);
                      const unreadCount = getUnreadCount(userId);

                      if (!profile || !lastMessage) return null;

                      return (
                        <button
                          key={userId}
                          onClick={() => setSelectedUserId(userId)}
                          className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                            selectedUserId === userId ? 'bg-emerald-50 border-r-2 border-emerald-500' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            {profile.avatar ? (
                              <img src={profile.avatar} alt={profile.name} className="h-10 w-10 rounded-full" />
                            ) : (
                              <User className="h-10 w-10 text-gray-400" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {profile.name}
                                </p>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500">
                                    {formatTime(lastMessage.timestamp)}
                                  </span>
                                  {unreadCount > 0 && (
                                    <span className="bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                      {unreadCount}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 truncate">
                                {lastMessage.senderId === user.id ? 'You: ' : ''}
                                {lastMessage.content}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No conversations yet</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedUserId && selectedUserProfile ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setSelectedUserId(null)}
                        className="lg:hidden text-gray-400 hover:text-gray-600"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                      {selectedUserProfile.avatar ? (
                        <img src={selectedUserProfile.avatar} alt={selectedUserProfile.name} className="h-10 w-10 rounded-full" />
                      ) : (
                        <User className="h-10 w-10 text-gray-400" />
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900">{selectedUserProfile.name}</h3>
                        <p className="text-sm text-gray-600">
                          {selectedUserProfile.isVerified && '✓ Verified • '}
                          {selectedUserProfile.totalSwaps} swaps
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedConversation
                      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                      .map(message => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.senderId === user.id
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.senderId === user.id ? 'text-emerald-100' : 'text-gray-500'
                            }`}>
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}