'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  sender: { id: string; name: string; avatar?: string };
  createdAt: string;
  readAt?: string;
}

interface Conversation {
  id: string;
  listing?: { id: string; title: string } | null;
  participants: { userId: string; user: User }[];
  messages: Message[];
  updatedAt: string;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [me, setMe] = useState<{ id: string; name: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch current user
  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!d?.user) { window.location.href = '/auth/login'; return; }
        setMe(d.user);
      })
      .catch(() => { window.location.href = '/auth/login'; });
  }, []);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const r = await fetch('/api/messages');
      if (r.ok) {
        const d = await r.json();
        setConversations(d.conversations ?? []);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  // Poll every 10s
  useEffect(() => {
    const interval = setInterval(fetchConversations, 10000);
    const onFocus = () => fetchConversations();
    window.addEventListener('focus', onFocus);
    return () => { clearInterval(interval); window.removeEventListener('focus', onFocus); };
  }, [fetchConversations]);

  // Fetch messages for active conversation
  const fetchMessages = useCallback(async (convId: string) => {
    setLoadingMsgs(true);
    try {
      const r = await fetch(`/api/messages/${convId}`);
      if (r.ok) {
        const d = await r.json();
        setMessages(d.messages ?? []);
      }
    } catch { /* ignore */ }
    setLoadingMsgs(false);
  }, []);

  useEffect(() => {
    if (activeId) fetchMessages(activeId);
  }, [activeId, fetchMessages]);

  // Poll active conversation messages
  useEffect(() => {
    if (!activeId) return;
    const interval = setInterval(() => fetchMessages(activeId), 5000);
    return () => clearInterval(interval);
  }, [activeId, fetchMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || !activeId || sending) return;
    setSending(true);
    try {
      const r = await fetch(`/api/messages/${activeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      });
      if (r.ok) {
        setText('');
        await fetchMessages(activeId);
        await fetchConversations();
      }
    } catch { /* ignore */ }
    setSending(false);
  };

  const selectConversation = (id: string) => {
    setActiveId(id);
    setMobileShowChat(true);
  };

  const getOther = (conv: Conversation) => {
    if (!me) return { name: 'Unknown', avatar: undefined };
    const other = conv.participants.find(p => p.userId !== me.id);
    return other?.user ?? { name: 'Unknown', avatar: undefined };
  };

  const getUnread = (conv: Conversation) => {
    if (!me) return false;
    const last = conv.messages[0];
    return last && last.senderId !== me.id && !last.readAt;
  };

  const formatTime = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 86400000 && date.getDate() === now.getDate()) {
      return date.toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' });
    }
    if (diff < 604800000) {
      return date.toLocaleDateString('en-IE', { weekday: 'short' });
    }
    return date.toLocaleDateString('en-IE', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-60px)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gaff-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeConv = conversations.find(c => c.id === activeId);

  return (
    <div className="h-[calc(100vh-60px)] flex bg-white">
      {/* Conversation list sidebar */}
      <div className={`w-full md:w-[360px] md:border-r border-gray-100 flex flex-col ${mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="px-5 py-4 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gaff-slate">Messages</h1>
        </div>

        {conversations.length === 0 ? (
          <div className="flex-1 flex items-center justify-center px-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                No messages yet. When you enquire about a property, your conversations will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {conversations.map(conv => {
              const other = getOther(conv);
              const last = conv.messages[0];
              const unread = getUnread(conv);
              const isActive = conv.id === activeId;

              return (
                <button
                  key={conv.id}
                  onClick={() => selectConversation(conv.id)}
                  className={`w-full text-left px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${isActive ? 'bg-gaff-teal/5' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gaff-teal to-gaff-teal-dark text-white font-semibold text-sm flex items-center justify-center shrink-0">
                      {other.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm truncate ${unread ? 'font-bold text-gaff-slate' : 'font-medium text-gaff-slate'}`}>
                          {other.name}
                        </span>
                        <span className="text-xs text-gray-400 shrink-0">
                          {last ? formatTime(last.createdAt) : ''}
                        </span>
                      </div>
                      {conv.listing && (
                        <p className="text-xs text-gaff-teal truncate">{conv.listing.title}</p>
                      )}
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className={`text-xs truncate ${unread ? 'font-semibold text-gaff-slate' : 'text-gray-400'}`}>
                          {last ? (last.senderId === me?.id ? `You: ${last.text}` : last.text) : 'No messages'}
                        </p>
                        {unread && (
                          <span className="w-2 h-2 bg-gaff-teal rounded-full shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Chat panel */}
      <div className={`flex-1 flex flex-col ${!mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
        {!activeConv ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-3"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              <p className="text-sm">Select a conversation to start messaging</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3">
              <button
                onClick={() => { setMobileShowChat(false); setActiveId(null); }}
                className="md:hidden p-1 rounded hover:bg-gray-50"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gaff-teal to-gaff-teal-dark text-white font-semibold text-xs flex items-center justify-center">
                {getOther(activeConv).name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gaff-slate truncate">{getOther(activeConv).name}</p>
                {activeConv.listing && (
                  <a href={`/listing/${activeConv.listing.id}`} className="text-xs text-gaff-teal hover:underline truncate block">
                    {activeConv.listing.title}
                  </a>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {loadingMsgs && messages.length === 0 ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-gaff-teal border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                messages.map(msg => {
                  const isMe = msg.senderId === me?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                        isMe
                          ? 'bg-gaff-teal text-white rounded-br-md'
                          : 'bg-gray-100 text-gaff-slate rounded-bl-md'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : ''}`}>
                          <span className={`text-[10px] ${isMe ? 'text-white/60' : 'text-gray-400'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMe && (
                            <span className={`text-[10px] ${msg.readAt ? 'text-white' : 'text-white/50'}`} title={msg.readAt ? `Read ${new Date(msg.readAt).toLocaleString('en-IE')}` : 'Sent'}>
                              {msg.readAt ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-5 py-3 border-t border-gray-100">
              <div className="flex items-end gap-2">
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Type a message..."
                  rows={1}
                  className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gaff-teal/30 focus:border-gaff-teal/50 max-h-32"
                />
                <button
                  onClick={handleSend}
                  disabled={!text.trim() || sending}
                  className="bg-gaff-teal text-white p-2.5 rounded-xl hover:bg-gaff-teal-dark transition-colors disabled:opacity-40 shrink-0"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
