import { useState } from 'react';
import { Message } from '@/types';
import { getUserById } from '@/data/mock';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  messages: Message[];
  onSend: (text: string) => void;
}

export const ChatWindow = ({ messages, onSend }: Props) => {
  const [text, setText] = useState('');
  const { user } = useAuth();

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map(msg => {
          const isMe = msg.senderId === user?.id;
          const sender = getUserById(msg.senderId);
          return (
            <div key={msg.id} className={cn('flex flex-col max-w-[75%]', isMe ? 'ml-auto items-end' : 'items-start')}>
              <span className="mb-0.5 text-xs text-muted-foreground">{sender?.name}</span>
              <div className={cn(
                'rounded-2xl px-4 py-2.5 text-sm',
                isMe ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-muted text-foreground rounded-bl-md'
              )}>
                {msg.text}
              </div>
              <span className="mt-0.5 text-[10px] text-muted-foreground">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 border-t p-3">
        <Input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button onClick={handleSend} size="icon" disabled={!text.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
