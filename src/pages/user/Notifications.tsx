import { useAuth } from '@/context/AuthContext';
import { getNotificationsByUser } from '@/data/mock';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, BellDot } from 'lucide-react';

const Notifications = () => {
  const { user } = useAuth();
  const notifs = getNotificationsByUser(user?.id || '');

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-4">Notifications</h1>
      {notifs.length === 0 ? <p className="text-muted-foreground">No notifications.</p> : (
        <div className="space-y-3">
          {notifs.map(n => (
            <Card key={n.id} className={n.read ? 'opacity-60' : ''}>
              <CardContent className="flex items-start gap-3 p-4">
                {n.read ? <Bell className="h-5 w-5 text-muted-foreground mt-0.5" /> : <BellDot className="h-5 w-5 text-coral mt-0.5" />}
                <div>
                  <p className="font-medium text-foreground">{n.title}</p>
                  <p className="text-sm text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{n.createdAt}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
export default Notifications;
