import { BuyerRequest } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  request: BuyerRequest;
  linkTo?: string;
}

const statusColors: Record<string, string> = {
  open: 'bg-success/10 text-success border-success/20',
  matched: 'bg-info/10 text-info border-info/20',
  closed: 'bg-muted text-muted-foreground border-border',
};

export const RequestCard = ({ request, linkTo }: Props) => {
  const content = (
    <Card className="group transition-all hover:shadow-md hover:-translate-y-0.5">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground line-clamp-1">{request.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{request.description}</p>
          </div>
          <Badge className={statusColors[request.status]}>{request.status}</Badge>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <Badge variant="secondary">{request.category}</Badge>
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{request.area}, {request.city}</span>
          {(request.minPrice || request.maxPrice) && (
            <span className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {request.minPrice?.toLocaleString()} – {request.maxPrice?.toLocaleString()} EGP
            </span>
          )}
          {request.dateNeeded && (
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Needed by {request.dateNeeded}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (linkTo) {
    return <Link to={linkTo}>{content}</Link>;
  }
  return content;
};
