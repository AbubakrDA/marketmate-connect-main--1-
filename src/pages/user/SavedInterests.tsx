import { useAuth } from '@/context/AuthContext';
import { getInterestsByUser } from '@/data/mock';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';

const SavedInterests = () => {
  const { user } = useAuth();
  const interests = getInterestsByUser(user?.id || '');

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-4">Saved Interests</h1>
      {interests.length === 0 ? <p className="text-muted-foreground">No saved interests yet.</p> : (
        <div className="grid gap-4 sm:grid-cols-2">
          {interests.map(i => (
            <Card key={i.id}>
              <CardContent className="flex items-start gap-3 p-5">
                <Heart className="h-5 w-5 text-coral mt-0.5" />
                <div>
                  <div className="flex gap-2"><Badge variant="secondary">{i.category}</Badge>{i.subCategory && <Badge variant="outline">{i.subCategory}</Badge>}</div>
                  {i.area && <p className="mt-2 text-sm text-muted-foreground">Area: {i.area}</p>}
                  {(i.minPrice || i.maxPrice) && <p className="text-sm text-muted-foreground">Budget: {i.minPrice?.toLocaleString() || '0'} - {i.maxPrice?.toLocaleString() || '∞'} EGP</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
export default SavedInterests;
