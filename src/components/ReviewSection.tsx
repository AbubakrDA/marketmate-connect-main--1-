import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StarRating } from '@/components/StarRating';
import { useAuth } from '@/context/AuthContext';
import { getReviewsByBusiness, addReview } from '@/data/mock';
import { Review } from '@/types';
import { Star, MessageSquarePlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ReviewSectionProps {
  businessId: string;
}

const StarInput = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="p-0.5 transition-transform hover:scale-110"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
        >
          <Star
            className={cn(
              'h-6 w-6 transition-colors',
              (hover || value) >= star
                ? 'text-amber-500 fill-amber-500'
                : 'text-muted-foreground/30'
            )}
          />
        </button>
      ))}
    </div>
  );
};

export const ReviewSection = ({ businessId }: ReviewSectionProps) => {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>(() => getReviewsByBusiness(businessId));
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [filterRating, setFilterRating] = useState<string>('all');

  const MAX_COMMENT_LENGTH = 500;

  const alreadyReviewed = isAuthenticated && reviews.some(r => r.userId === user?.id);

  const sortedAndFiltered = [...reviews]
    .filter(r => filterRating === 'all' || r.rating === Number(filterRating))
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': return b.createdAt.localeCompare(a.createdAt);
        case 'oldest': return a.createdAt.localeCompare(b.createdAt);
        case 'highest': return b.rating - a.rating;
        case 'lowest': return a.rating - b.rating;
        default: return 0;
      }
    });

  const handleSubmit = () => {
    if (!user) return;
    if (rating === 0) {
      toast({ title: 'Please select a rating', variant: 'destructive' });
      return;
    }
    const trimmed = comment.trim();
    if (!trimmed) {
      toast({ title: 'Please write a review', variant: 'destructive' });
      return;
    }
    if (trimmed.length > MAX_COMMENT_LENGTH) {
      toast({ title: `Review must be under ${MAX_COMMENT_LENGTH} characters`, variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    const newReview: Review = {
      id: `rev${Date.now()}`,
      businessId,
      userId: user.id,
      userName: user.name,
      rating,
      comment: trimmed,
      createdAt: new Date().toISOString().split('T')[0],
    };
    addReview(newReview);
    setReviews(prev => [newReview, ...prev]);
    setRating(0);
    setComment('');
    setShowForm(false);
    setSubmitting(false);
    toast({ title: 'Review submitted!', description: 'Thank you for your feedback.' });
  };

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-foreground">Reviews ({reviews.length})</h2>
        {isAuthenticated && !alreadyReviewed && (
          <Button
            variant={showForm ? 'outline' : 'default'}
            size="sm"
            onClick={() => setShowForm(!showForm)}
          >
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            {showForm ? 'Cancel' : 'Write a Review'}
          </Button>
        )}
      </div>

      {reviews.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="w-[150px] h-9 text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Rated</SelectItem>
              <SelectItem value="lowest">Lowest Rated</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterRating} onValueChange={setFilterRating}>
            <SelectTrigger className="w-[130px] h-9 text-sm">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <Card className="mt-4 border-primary/20">
          <CardHeader>
            <CardTitle className="text-base">Your Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Rating</label>
              <StarInput value={rating} onChange={setRating} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Comment</label>
              <Textarea
                placeholder="Share your experience with this business..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                maxLength={MAX_COMMENT_LENGTH}
                rows={3}
              />
              <p className="mt-1 text-xs text-muted-foreground text-right">
                {comment.length}/{MAX_COMMENT_LENGTH}
              </p>
            </div>
            <Button onClick={handleSubmit} disabled={submitting}>
              Submit Review
            </Button>
          </CardContent>
        </Card>
      )}

      {!isAuthenticated && (
        <p className="mt-4 text-sm text-muted-foreground">Log in to leave a review.</p>
      )}
      {alreadyReviewed && !showForm && (
        <p className="mt-2 text-sm text-muted-foreground">You've already reviewed this business.</p>
      )}

      {/* Reviews List */}
      <div className="mt-4 space-y-4">
        {reviews.length === 0 && (
          <p className="text-muted-foreground text-sm">No reviews yet. Be the first to review!</p>
        )}
        {reviews.length > 0 && sortedAndFiltered.length === 0 && (
          <p className="text-muted-foreground text-sm">No reviews match the selected filter.</p>
        )}
        {sortedAndFiltered.map(review => (
          <Card key={review.id}>
            <CardContent className="flex gap-3 p-4">
              <Avatar className="h-9 w-9 flex-shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {review.userName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm text-foreground">{review.userName}</span>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{review.createdAt}</span>
                </div>
                <StarRating rating={review.rating} showCount={false} size="sm" className="mt-0.5" />
                <p className="mt-1.5 text-sm text-muted-foreground">{review.comment}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
