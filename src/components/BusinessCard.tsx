import { Link } from 'react-router-dom';
import { Business } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, CheckCircle } from 'lucide-react';
import { StarRating } from '@/components/StarRating';

export const BusinessCard = ({ business }: { business: Business }) => {
  return (
    <Link to={`/businesses/${business.id}`}>
      <Card className="group transition-all hover:shadow-lg hover:-translate-y-1">
        <CardContent className="flex items-start gap-4 p-5">
          <img src={business.logoUrl} alt={business.name} className="h-16 w-16 rounded-lg object-cover" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground truncate">{business.name}</h3>
              {business.verified && <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />}
            </div>
            <StarRating rating={business.rating} reviewCount={business.reviewCount} size="sm" />
            <div className="mt-1 flex flex-wrap gap-2">
              <Badge variant="secondary">{business.category}</Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />{business.area}, {business.city}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{business.description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
