import { getWalletByUser } from '@/data/mock';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Wallet } from 'lucide-react';

export const WalletBadge = () => {
  const { user } = useAuth();
  const wallet = getWalletByUser(user?.id || '');

  if (!wallet) return null;

  return (
    <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
      <Wallet className="h-3.5 w-3.5" />
      <span className="font-semibold">{wallet.requestCredits}</span>
      <span className="text-muted-foreground">credits</span>
    </Badge>
  );
};
