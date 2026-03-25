import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getConversationsByUser, getMessagesByConversation, getUserById, getBuyerRequestById, messages as allMsgs, markConversationRead, getUnreadCount } from '@/data/mock';
import { ChatWindow } from '@/components/ChatWindow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const UserChat = () => {
  const { user } = useAuth();
  const [activeConvo, setActiveConvo] = useState('');
  const [, setTick] = useState(0);

  // Polling: refresh every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  const convos = getConversationsByUser(user?.id || '');
  const activeMessages = getMessagesByConversation(activeConvo);

  // Auto-select first convo
  useEffect(() => {
    if (convos.length > 0 && !activeConvo) setActiveConvo(convos[0].id);
  }, [convos.length]);

  // Mark as read when viewing
  useEffect(() => {
    if (activeConvo && user) markConversationRead(user.id, activeConvo);
  }, [activeConvo, activeMessages.length]);

  const handleSend = (text: string) => {
    allMsgs.push({
      id: `msg${Date.now()}`,
      conversationId: activeConvo,
      senderId: user?.id || '',
      text,
      createdAt: new Date().toISOString(),
    });
    setTick(t => t + 1);
  };

  const getConvoUnread = (convoId: string) => {
    const msgs = getMessagesByConversation(convoId).filter(m => m.senderId !== user?.id);
    // Simple: count messages not yet "read"
    return msgs.length > 0 && convoId !== activeConvo ? msgs.length : 0;
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Messages</h1>
      {convos.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">No conversations yet. Accept an offer to start chatting.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-[280px_1fr]">
          <div className="space-y-2">
            {convos.map(c => {
              const other = c.participants.find(p => p !== user?.id);
              const otherUser = getUserById(other || '');
              const req = getBuyerRequestById(c.requestId || '');
              const unread = getConvoUnread(c.id);
              return (
                <Card
                  key={c.id}
                  className={cn('cursor-pointer transition-colors', activeConvo === c.id && 'border-primary bg-muted/50')}
                  onClick={() => { setActiveConvo(c.id); if (user) markConversationRead(user.id, c.id); }}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground text-sm">{otherUser?.name}</p>
                      {unread > 0 && <Badge className="bg-coral text-coral-foreground text-[10px] px-1.5">{unread}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{req?.title}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <Card className="h-[500px]">
            <CardHeader className="border-b py-3 px-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-4 w-4" />Chat
              </CardTitle>
            </CardHeader>
            <ChatWindow messages={activeMessages} onSend={handleSend} />
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserChat;
