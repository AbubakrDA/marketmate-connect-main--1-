import { User, Business, Listing, Lead, AdCampaign, Subscription, Recommendation, Notification, UserInterest, BuyerRequest, Offer, Conversation, Message, DealHunter, SaleCampaign, UserWallet, PaymentTransaction, Review } from '@/types';

export const users: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@marketmate.eg', password: 'admin123', role: 'admin', phone: '+201000000000', rating: 4.9, reviewCount: 12, createdAt: '2024-01-01' },
  { id: 'u2', name: 'Ahmed Hassan', email: 'ahmed@example.com', password: 'user123', role: 'user', phone: '+201111111111', rating: 4.5, reviewCount: 8, createdAt: '2024-02-15' },
  { id: 'u3', name: 'Dr. Sarah Mostafa', email: 'sarah@clinic.eg', password: 'business123', role: 'business', phone: '+201222222222', rating: 4.8, reviewCount: 24, createdAt: '2024-01-10' },
  { id: 'u4', name: 'Omar El-Sayed', email: 'omar@realestate.eg', password: 'business123', role: 'business', phone: '+201333333333', rating: 4.6, reviewCount: 15, createdAt: '2024-01-20' },
  { id: 'u5', name: 'Fatima Nour', email: 'fatima@fashion.eg', password: 'business123', role: 'business', phone: '+201444444444', rating: 4.2, reviewCount: 6, createdAt: '2024-02-01' },
  { id: 'u6', name: 'Mariam Ali', email: 'mariam@example.com', password: 'user123', role: 'user', phone: '+201555555555', rating: 4.3, reviewCount: 5, createdAt: '2024-02-20' },
  { id: 'u7', name: 'Khaled Ibrahim', email: 'khaled@example.com', password: 'user123', role: 'user', phone: '+201666666666', rating: 4.7, reviewCount: 10, createdAt: '2024-03-01' },
  { id: 'u8', name: 'Nadia Samir', email: 'nadia@example.com', password: 'user123', role: 'user', phone: '+201777777777', rating: 4.1, reviewCount: 3, createdAt: '2024-03-05' },
  { id: 'u9', name: 'Hassan Mohamed', email: 'hassan.m@example.com', password: 'user123', role: 'user', phone: '+201888888888', rating: 4.4, reviewCount: 7, createdAt: '2024-03-08' },
];

export const businesses: Business[] = [
  {
    id: 'b1', ownerUserId: 'u3', name: 'Cairo Medical Center', category: 'Clinics', subCategory: 'General Practice',
    description: 'Leading medical center in Maadi providing comprehensive healthcare services including general practice, dental care, and specialized consultations. Our team of experienced doctors ensures the highest quality of care.',
    phone: '+201222222222', email: 'info@cairomedical.eg', area: 'Maadi', city: 'Cairo',
    address: '15 Road 9, Maadi, Cairo', latitude: 29.9602, longitude: 31.2569,
    logoUrl: 'https://ui-avatars.com/api/?name=Cairo+Medical&background=1e40af&color=fff&size=128&bold=true',
    verified: true, rating: 4.8, reviewCount: 47, createdAt: '2024-01-10',
  },
  {
    id: 'b2', ownerUserId: 'u4', name: 'Nile View Properties', category: 'Real Estate', subCategory: 'Apartments',
    description: 'Premium real estate agency specializing in luxury apartments and villas across Cairo\'s most prestigious neighborhoods. We help you find your dream home with personalized service.',
    phone: '+201333333333', email: 'info@nileview.eg', area: 'Zamalek', city: 'Cairo',
    address: '8 Mohamed Mazhar St, Zamalek, Cairo', latitude: 30.0588, longitude: 31.2196,
    logoUrl: 'https://ui-avatars.com/api/?name=Nile+View&background=059669&color=fff&size=128&bold=true',
    verified: true, rating: 4.6, reviewCount: 32, createdAt: '2024-01-20',
  },
  {
    id: 'b3', ownerUserId: 'u5', name: 'Elegance Fashion House', category: 'Fashion', subCategory: 'Women',
    description: 'Curated fashion boutique offering the latest trends in Egyptian and international fashion. From casual wear to evening gowns, we dress you for every occasion.',
    phone: '+201444444444', email: 'info@elegancefashion.eg', area: 'New Cairo', city: 'Cairo',
    address: 'Cairo Festival City Mall, New Cairo', latitude: 30.0283, longitude: 31.4084,
    logoUrl: 'https://ui-avatars.com/api/?name=Elegance+Fashion&background=dc2626&color=fff&size=128&bold=true',
    verified: false, rating: 4.3, reviewCount: 11, createdAt: '2024-02-01',
  },
];

export const listings: Listing[] = [
  // Clinics
  { id: 'l1', businessId: 'b1', title: 'General Health Checkup', description: 'Comprehensive health screening including blood tests, ECG, and consultation with our experienced physicians. Ideal for annual health monitoring.', category: 'Clinics', subCategory: 'General Practice', area: 'Maadi', city: 'Cairo', priceEgp: 500, oldPriceEgp: 750, dealLabel: '33% Off', imageUrl: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&h=300&fit=crop', status: 'active', createdAt: '2024-03-01' },
  { id: 'l2', businessId: 'b1', title: 'Dental Cleaning & Whitening', description: 'Professional dental cleaning followed by a whitening session for a brighter smile. Uses latest LED whitening technology.', category: 'Clinics', subCategory: 'Dental', area: 'Maadi', city: 'Cairo', priceEgp: 800, imageUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop', status: 'active', createdAt: '2024-03-05' },
  { id: 'l3', businessId: 'b1', title: 'Eye Examination', description: 'Complete eye exam including vision test, retinal scan, and prescription consultation.', category: 'Clinics', subCategory: 'Ophthalmology', area: 'Maadi', city: 'Cairo', priceEgp: 350, oldPriceEgp: 500, dealLabel: '30% Off', imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop', status: 'active', createdAt: '2024-03-10' },
  { id: 'l4', businessId: 'b1', title: 'Pediatric Consultation', description: 'Expert pediatric care for children of all ages. Includes growth assessment and vaccination review.', category: 'Clinics', subCategory: 'Pediatrics', area: 'Maadi', city: 'Cairo', priceEgp: 400, imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop', status: 'active', createdAt: '2024-03-15' },
  // Real Estate
  { id: 'l5', businessId: 'b2', title: '3-Bedroom Apartment in Zamalek', description: 'Stunning Nile view apartment with 3 bedrooms, 2 bathrooms, modern kitchen, and spacious living area. Prime location in the heart of Zamalek.', category: 'Real Estate', subCategory: 'Apartments', area: 'Zamalek', city: 'Cairo', priceEgp: 25000, oldPriceEgp: 30000, dealLabel: '17% Off', imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop', status: 'active', createdAt: '2024-02-20' },
  { id: 'l6', businessId: 'b2', title: 'Luxury Villa in New Cairo', description: 'Spacious 5-bedroom villa with private garden, pool, and garage. Located in a gated compound with 24/7 security.', category: 'Real Estate', subCategory: 'Villas', area: 'New Cairo', city: 'Cairo', priceEgp: 85000, imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop', status: 'active', createdAt: '2024-02-25' },
  { id: 'l7', businessId: 'b2', title: 'Studio Apartment in Maadi', description: 'Cozy furnished studio in Maadi Degla. Perfect for singles or couples. Near metro station and shopping areas.', category: 'Real Estate', subCategory: 'Studios', area: 'Maadi', city: 'Cairo', priceEgp: 8000, imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop', status: 'active', createdAt: '2024-03-01' },
  { id: 'l8', businessId: 'b2', title: 'Office Space Downtown', description: 'Modern office space in Downtown Cairo. 120 sqm, fully equipped with meeting room, reception area, and kitchenette.', category: 'Real Estate', subCategory: 'Offices', area: 'Downtown', city: 'Cairo', priceEgp: 15000, oldPriceEgp: 18000, dealLabel: '17% Off', imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', status: 'active', createdAt: '2024-03-05' },
  // Fashion
  { id: 'l9', businessId: 'b3', title: 'Summer Collection Dress', description: 'Elegant summer dress from our latest collection. Available in multiple colors. Made with premium Egyptian cotton.', category: 'Fashion', subCategory: 'Women', area: 'New Cairo', city: 'Cairo', priceEgp: 1200, oldPriceEgp: 1800, dealLabel: '33% Off', imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop', status: 'active', createdAt: '2024-03-10' },
  { id: 'l10', businessId: 'b3', title: 'Premium Men\'s Suit', description: 'Tailored men\'s suit in classic navy. Italian fabric with Egyptian craftsmanship. Includes jacket, trousers, and vest.', category: 'Fashion', subCategory: 'Men', area: 'New Cairo', city: 'Cairo', priceEgp: 4500, imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=300&fit=crop', status: 'active', createdAt: '2024-03-12' },
  { id: 'l11', businessId: 'b3', title: 'Handcrafted Abaya', description: 'Beautiful handcrafted abaya with intricate embroidery. Perfect for special occasions. One-of-a-kind design.', category: 'Fashion', subCategory: 'Traditional', area: 'New Cairo', city: 'Cairo', priceEgp: 2500, oldPriceEgp: 3200, dealLabel: '22% Off', imageUrl: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=300&fit=crop', status: 'active', createdAt: '2024-03-14' },
  { id: 'l12', businessId: 'b3', title: 'Kids Clothing Set', description: 'Adorable 3-piece clothing set for kids aged 3-8. Includes shirt, pants, and jacket. Comfortable and durable fabric.', category: 'Fashion', subCategory: 'Kids', area: 'New Cairo', city: 'Cairo', priceEgp: 650, imageUrl: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=300&fit=crop', status: 'active', createdAt: '2024-03-16' },
];

export const leads: Lead[] = [
  { id: 'ld1', listingId: 'l1', businessId: 'b1', userId: 'u2', name: 'Ahmed Hassan', email: 'ahmed@example.com', phone: '+201111111111', message: 'I would like to book a general checkup for next week. Is Saturday available?', status: 'new', createdAt: '2024-03-18' },
  { id: 'ld2', listingId: 'l5', businessId: 'b2', userId: 'u2', name: 'Ahmed Hassan', email: 'ahmed@example.com', phone: '+201111111111', message: 'Interested in viewing the Zamalek apartment. Can we schedule a visit?', status: 'contacted', createdAt: '2024-03-17' },
  { id: 'ld3', listingId: 'l9', businessId: 'b3', name: 'Mariam Ali', email: 'mariam@example.com', phone: '+201555555555', message: 'Do you have this dress in size Medium and in blue?', status: 'new', createdAt: '2024-03-19' },
  { id: 'ld4', listingId: 'l6', businessId: 'b2', name: 'Khaled Ibrahim', email: 'khaled@example.com', phone: '+201666666666', message: 'Looking for a villa for my family. Can we discuss pricing and payment plans?', status: 'won', createdAt: '2024-03-10' },
  { id: 'ld5', listingId: 'l2', businessId: 'b1', name: 'Nadia Samir', email: 'nadia@example.com', phone: '+201777777777', message: 'How long does the whitening session take?', status: 'contacted', createdAt: '2024-03-16' },
  { id: 'ld6', listingId: 'l10', businessId: 'b3', name: 'Hassan Mohamed', email: 'hassan.m@example.com', phone: '+201888888888', message: 'Need a suit for a wedding. Can I get it tailored within a week?', status: 'lost', createdAt: '2024-03-08' },
];

export const adCampaigns: AdCampaign[] = [
  { id: 'ad1', businessId: 'b1', title: 'Health Checkup Spring Promo', budgetEgp: 5000, status: 'active', impressions: 12450, clicks: 340, createdAt: '2024-03-01' },
  { id: 'ad2', businessId: 'b2', title: 'Zamalek Apartments Campaign', budgetEgp: 10000, status: 'active', impressions: 28300, clicks: 890, createdAt: '2024-02-15' },
  { id: 'ad3', businessId: 'b3', title: 'Summer Fashion Sale', budgetEgp: 3000, status: 'paused', impressions: 8700, clicks: 210, createdAt: '2024-03-10' },
];

export const subscriptions: Subscription[] = [
  { id: 's1', businessId: 'b1', planName: 'pro', monthlyPriceEgp: 200, status: 'active', startDate: '2024-01-10', endDate: '2025-01-10' },
  { id: 's2', businessId: 'b2', planName: 'pro', monthlyPriceEgp: 200, status: 'active', startDate: '2024-01-20', endDate: '2025-01-20' },
  { id: 's3', businessId: 'b3', planName: 'free', monthlyPriceEgp: 0, status: 'active', startDate: '2024-02-01', endDate: '2025-02-01' },
];

export const recommendations: Recommendation[] = [
  { id: 'r1', businessId: 'b1', type: 'pricing', title: 'Competitive Pricing Opportunity', description: 'Your dental cleaning service is priced 15% above the area average. Consider a promotional discount to increase leads by an estimated 25%.', score: 85, createdAt: '2024-03-15' },
  { id: 'r2', businessId: 'b1', type: 'area', title: 'Expand to Heliopolis', description: 'High demand for medical services detected in Heliopolis with limited supply. Opening a branch could capture 200+ leads/month.', score: 92, createdAt: '2024-03-14' },
  { id: 'r3', businessId: 'b2', type: 'improvement', title: 'Add Virtual Tours', description: 'Listings with virtual tours get 3x more leads. Consider adding 360° photos to your property listings.', score: 78, createdAt: '2024-03-13' },
  { id: 'r4', businessId: 'b3', type: 'promotion', title: 'Ramadan Collection Campaign', description: 'Ramadan season is approaching. Launching a traditional wear campaign could boost sales by 40% based on last year\'s market data.', score: 88, createdAt: '2024-03-12' },
  { id: 'r5', userId: 'u2', type: 'listing', title: 'Recommended: Eye Examination', description: 'Based on your interest in medical services in Maadi, this discounted eye exam might interest you.', score: 75, createdAt: '2024-03-18' },
  { id: 'r6', userId: 'u2', type: 'listing', title: 'New Apartment in Zamalek', description: 'A new 3-bedroom apartment matching your saved interest in Zamalek real estate is now available.', score: 90, createdAt: '2024-03-19' },
];

export const notifications: Notification[] = [
  { id: 'n1', userId: 'u2', title: 'New Deal Available', body: 'Cairo Medical Center has a 33% off deal on general checkups!', type: 'deal', read: false, createdAt: '2024-03-19' },
  { id: 'n2', userId: 'u2', title: 'Lead Update', body: 'Your inquiry about the Zamalek apartment has been viewed by the agent.', type: 'lead', read: false, createdAt: '2024-03-18' },
  { id: 'n3', userId: 'u2', title: 'New Listing Match', body: 'A new listing matching your interests is available in Maadi.', type: 'recommendation', read: true, createdAt: '2024-03-17' },
  { id: 'n4', userId: 'u3', title: 'New Lead Received', body: 'Ahmed Hassan is interested in your General Health Checkup service.', type: 'lead', read: false, createdAt: '2024-03-18' },
  { id: 'n5', userId: 'u4', title: 'Campaign Performance', body: 'Your Zamalek Apartments Campaign has reached 28,000 impressions!', type: 'ads', read: true, createdAt: '2024-03-17' },
];

export const userInterests: UserInterest[] = [
  { id: 'ui1', userId: 'u2', category: 'Clinics', subCategory: 'General Practice', area: 'Maadi', minPrice: 200, maxPrice: 1000 },
  { id: 'ui2', userId: 'u2', category: 'Real Estate', subCategory: 'Apartments', area: 'Zamalek', minPrice: 10000, maxPrice: 40000 },
];

// ===== NEW MOCK DATA =====

export const buyerRequests: BuyerRequest[] = [
  { id: 'br1', userId: 'u2', title: 'Need an apartment in New Cairo', description: 'Looking for a 2-3 bedroom apartment in New Cairo, preferably in a compound with pool access. Must be furnished.', category: 'Real Estate', subCategory: 'Apartments', city: 'Cairo', area: 'New Cairo', minPrice: 15000, maxPrice: 35000, dateNeeded: '2024-04-15', status: 'open', createdAt: '2024-03-18' },
  { id: 'br2', userId: 'u2', title: 'Dentist in Nasr City', description: 'Need a reliable dentist for teeth cleaning and possible braces consultation. Prefer experienced orthodontist.', category: 'Clinics', subCategory: 'Dental', city: 'Cairo', area: 'Nasr City', minPrice: 300, maxPrice: 800, dateNeeded: '2024-03-25', status: 'matched', createdAt: '2024-03-15' },
  { id: 'br3', userId: 'u2', title: 'Winter clothes sale', description: 'Looking for winter jackets and coats for the whole family. Prefer Egyptian-made brands. Budget-friendly options.', category: 'Fashion', subCategory: 'Women', city: 'Cairo', area: 'Maadi', minPrice: 200, maxPrice: 1500, status: 'open', createdAt: '2024-03-17' },
  { id: 'br4', userId: 'u6', title: 'Office space near Downtown', description: 'Startup looking for affordable office space, 80-120 sqm, near metro station. Flexible lease preferred.', category: 'Real Estate', subCategory: 'Offices', city: 'Cairo', area: 'Downtown', minPrice: 8000, maxPrice: 15000, dateNeeded: '2024-05-01', status: 'open', createdAt: '2024-03-19' },
  { id: 'br5', userId: 'u7', title: 'Pediatrician in Heliopolis', description: 'Need a trusted pediatrician for my 3 year old. Regular checkups and vaccinations.', category: 'Clinics', subCategory: 'Pediatrics', city: 'Cairo', area: 'Heliopolis', minPrice: 200, maxPrice: 600, status: 'closed', createdAt: '2024-03-10' },
  { id: 'br6', userId: 'u8', title: 'Dermatologist in Maadi', description: 'Looking for a good dermatologist for acne treatment. Prefer a female doctor.', category: 'Clinics', subCategory: 'Dermatology', city: 'Cairo', area: 'Maadi', minPrice: 300, maxPrice: 700, status: 'open', createdAt: '2024-03-20' },
  { id: 'br7', userId: 'u9', title: 'Affordable studio in 6th October', description: 'Student looking for a small furnished studio near universities in 6th October City. Budget is tight.', category: 'Real Estate', subCategory: 'Studios', city: 'Giza', area: '6th October', minPrice: 3000, maxPrice: 6000, status: 'open', createdAt: '2024-03-21' },
  { id: 'br8', userId: 'u6', title: 'Kids party outfits', description: 'Need cute outfits for a birthday party. Twin girls aged 5. Looking for matching dresses.', category: 'Fashion', subCategory: 'Kids', city: 'Cairo', area: 'Heliopolis', minPrice: 300, maxPrice: 800, status: 'open', createdAt: '2024-03-22' },
];

export const offers: Offer[] = [
  { id: 'of1', requestId: 'br1', businessId: 'b2', offerTitle: 'Luxury Compound Apartment Available', offerMessage: 'We have a beautiful 3-bedroom furnished apartment in Palm Hills compound, New Cairo. Includes pool access, gym, and 24/7 security. Available immediately.', offerPrice: 28000, listingReference: 'l6', status: 'pending', createdAt: '2024-03-19' },
  { id: 'of2', requestId: 'br2', businessId: 'b1', offerTitle: 'Expert Dental Care at Cairo Medical', offerMessage: 'Our dental department offers professional teeth cleaning at competitive prices. We also have an orthodontist available for braces consultation. First visit includes free X-ray.', offerPrice: 500, listingReference: 'l2', status: 'accepted', createdAt: '2024-03-16' },
  { id: 'of3', requestId: 'br3', businessId: 'b3', offerTitle: 'Winter Collection — 30% Off', offerMessage: 'Check out our winter collection with up to 30% off on jackets and coats. Egyptian cotton lined jackets starting from 450 EGP. Family packages available.', offerPrice: 450, status: 'pending', createdAt: '2024-03-18' },
  { id: 'of4', requestId: 'br4', businessId: 'b2', offerTitle: 'Downtown Office — Metro Access', offerMessage: 'We have a 100 sqm fully equipped office 2 minutes walk from Sadat metro station. Includes meeting room and kitchenette. Flexible 6-month lease available.', offerPrice: 12000, listingReference: 'l8', status: 'pending', createdAt: '2024-03-20' },
];

export const conversations: Conversation[] = [
  { id: 'conv1', requestId: 'br2', offerId: 'of2', participants: ['u2', 'u3'], createdAt: '2024-03-16' },
];

export const messages: Message[] = [
  { id: 'msg1', conversationId: 'conv1', senderId: 'u2', text: 'Hi Dr. Sarah, I accepted your offer for dental cleaning. When is the earliest available appointment?', createdAt: '2024-03-16T10:00:00' },
  { id: 'msg2', conversationId: 'conv1', senderId: 'u3', text: 'Hello Ahmed! Thank you for choosing us. We have availability this Saturday at 10 AM or Monday at 2 PM. Which works better for you?', createdAt: '2024-03-16T10:15:00' },
  { id: 'msg3', conversationId: 'conv1', senderId: 'u2', text: 'Saturday at 10 AM works perfectly. Do I need to bring anything?', createdAt: '2024-03-16T10:30:00' },
  { id: 'msg4', conversationId: 'conv1', senderId: 'u3', text: 'Great! Just bring a valid ID. We\'ll take care of everything else. See you Saturday! 😊', createdAt: '2024-03-16T10:45:00' },
];

export const dealHunters: DealHunter[] = [
  { id: 'dh1', userId: 'u2', label: 'Affordable Dentist', category: 'Clinics', subCategory: 'Dental', area: 'Nasr City', minPrice: 300, maxPrice: 800, createdAt: '2024-03-10' },
  { id: 'dh2', userId: 'u2', label: 'New Cairo Apartments', category: 'Real Estate', subCategory: 'Apartments', area: 'New Cairo', minPrice: 10000, maxPrice: 30000, createdAt: '2024-03-12' },
];

export const saleCampaigns: SaleCampaign[] = [
  { id: 'sc1', businessId: 'b1', title: 'Winter Health Checkup Special', description: 'Stay healthy this winter! Get a comprehensive health checkup at a special discounted price. Includes blood tests, ECG, and doctor consultation.', category: 'Clinics', season: 'Winter Sale', originalPrice: 750, salePrice: 450, discountPercent: 40, imageUrl: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&h=300&fit=crop', startDate: '2024-12-01', endDate: '2025-02-28', createdAt: '2024-11-15' },
  { id: 'sc2', businessId: 'b3', title: 'Ramadan Fashion Collection', description: 'Exclusive Ramadan collection featuring handcrafted abayas, traditional wear, and modest fashion pieces. Limited time offers!', category: 'Fashion', season: 'Ramadan Offers', originalPrice: 3200, salePrice: 2200, discountPercent: 31, imageUrl: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=300&fit=crop', startDate: '2025-02-28', endDate: '2025-03-30', createdAt: '2025-02-01' },
  { id: 'sc3', businessId: 'b3', title: 'Back to School Kids Collection', description: 'Get your kids ready for school with our affordable and durable clothing sets. Buy 2 get 1 free!', category: 'Fashion', season: 'Back to School', originalPrice: 650, salePrice: 433, discountPercent: 33, imageUrl: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=300&fit=crop', startDate: '2025-08-15', endDate: '2025-09-30', createdAt: '2025-08-01' },
];

export const userWallets: UserWallet[] = [
  { id: 'w1', userId: 'u2', requestCredits: 5, freeRequestsUsed: 3 },
  { id: 'w2', userId: 'u6', requestCredits: 0, freeRequestsUsed: 1 },
  { id: 'w3', userId: 'u7', requestCredits: 0, freeRequestsUsed: 1 },
  { id: 'w4', userId: 'u8', requestCredits: 0, freeRequestsUsed: 1 },
  { id: 'w5', userId: 'u9', requestCredits: 0, freeRequestsUsed: 1 },
];

export const paymentTransactions: PaymentTransaction[] = [
  { id: 'pt1', userId: 'u2', amount: 50, type: 'credit_purchase', description: 'Purchased 5 request credits', createdAt: '2024-03-15' },
];

// ===== SALE INTERESTS =====
export interface SaleInterest {
  id: string;
  campaignId: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  createdAt: string;
}

export const saleInterests: SaleInterest[] = [];

export const addSaleInterest = (interest: SaleInterest) => {
  saleInterests.push(interest);
};

export const getSaleInterestsByUser = (userId: string) => saleInterests.filter(i => i.userId === userId);
export const getSaleInterestsByCampaign = (campaignId: string) => saleInterests.filter(i => i.campaignId === campaignId);
export const isUserInterestedInCampaign = (userId: string, campaignId: string) => saleInterests.some(i => i.userId === userId && i.campaignId === campaignId);

// ===== EXISTING HELPERS =====
export const getBusinessById = (id: string) => businesses.find(b => b.id === id);
export const getListingById = (id: string) => listings.find(l => l.id === id);
export const getUserById = (id: string) => users.find(u => u.id === id);
export const getBusinessByOwner = (userId: string) => businesses.find(b => b.ownerUserId === userId);
export const getListingsByBusiness = (businessId: string) => listings.filter(l => l.businessId === businessId);
export const getLeadsByBusiness = (businessId: string) => leads.filter(l => l.businessId === businessId);
export const getLeadsByUser = (userId: string) => leads.filter(l => l.userId === userId);
export const getAdsByBusiness = (businessId: string) => adCampaigns.filter(a => a.businessId === businessId);
export const getSubscriptionByBusiness = (businessId: string) => subscriptions.find(s => s.businessId === businessId);
export const getRecommendationsByBusiness = (businessId: string) => recommendations.filter(r => r.businessId === businessId);
export const getRecommendationsByUser = (userId: string) => recommendations.filter(r => r.userId === userId);
export const getNotificationsByUser = (userId: string) => notifications.filter(n => n.userId === userId);
export const getInterestsByUser = (userId: string) => userInterests.filter(i => i.userId === userId);

// ===== NEW HELPERS =====
export const getBuyerRequestsByUser = (userId: string) => buyerRequests.filter(r => r.userId === userId);
export const getBuyerRequestById = (id: string) => buyerRequests.find(r => r.id === id);
export const getBuyerRequestsByCategory = (category: string) => buyerRequests.filter(r => r.category === category && r.status === 'open');
export const getOpenBuyerRequests = () => buyerRequests.filter(r => r.status === 'open');
export const getOffersByRequest = (requestId: string) => offers.filter(o => o.requestId === requestId);
export const getOffersByBusiness = (businessId: string) => offers.filter(o => o.businessId === businessId);
export const getOfferById = (id: string) => offers.find(o => o.id === id);
export const getConversationsByUser = (userId: string) => conversations.filter(c => c.participants.includes(userId));
export const getMessagesByConversation = (conversationId: string) => messages.filter(m => m.conversationId === conversationId);
export const getDealHuntersByUser = (userId: string) => dealHunters.filter(d => d.userId === userId);
export const getActiveSaleCampaigns = () => saleCampaigns;
export const getSaleCampaignsByBusiness = (businessId: string) => saleCampaigns.filter(s => s.businessId === businessId);
export const getWalletByUser = (userId: string) => userWallets.find(w => w.userId === userId);
export const getTransactionsByUser = (userId: string) => paymentTransactions.filter(t => t.userId === userId);

// ===== SUBSCRIPTION ENFORCEMENT =====
const FREE_REQUEST_LIMIT = 3;

export const canUserPostRequest = (userId: string): { allowed: boolean; reason?: string } => {
  let wallet = userWallets.find(w => w.userId === userId);
  if (!wallet) {
    wallet = { id: `w${Date.now()}`, userId, requestCredits: 0, freeRequestsUsed: 0 };
    userWallets.push(wallet);
  }
  if (wallet.freeRequestsUsed < FREE_REQUEST_LIMIT) return { allowed: true };
  if (wallet.requestCredits > 0) return { allowed: true };
  return { allowed: false, reason: `You've used all ${FREE_REQUEST_LIMIT} free requests. Please purchase credits to continue.` };
};

export const consumeRequestCredit = (userId: string) => {
  const wallet = userWallets.find(w => w.userId === userId);
  if (!wallet) return;
  if (wallet.freeRequestsUsed < FREE_REQUEST_LIMIT) {
    wallet.freeRequestsUsed++;
  } else if (wallet.requestCredits > 0) {
    wallet.requestCredits--;
  }
};

export const canBusinessSendOffer = (businessId: string): { allowed: boolean; reason?: string } => {
  const sub = subscriptions.find(s => s.businessId === businessId);
  if (!sub || sub.planName === 'free') {
    return { allowed: false, reason: 'Pro subscription required to send offers. Upgrade to Pro (200 EGP/month) to start sending offers.' };
  }
  if (sub.status !== 'active') {
    return { allowed: false, reason: 'Your subscription has expired. Please renew to send offers.' };
  }
  return { allowed: true };
};

// ===== OFFER ACCEPTANCE → CONVERSATION =====
export const acceptOffer = (offerId: string, userId: string) => {
  const offer = offers.find(o => o.id === offerId);
  if (!offer) return null;
  offer.status = 'accepted';
  // Find business owner
  const biz = businesses.find(b => b.id === offer.businessId);
  if (!biz) return null;
  // Create conversation
  const convo: Conversation = {
    id: `conv${Date.now()}`,
    requestId: offer.requestId,
    offerId: offer.id,
    participants: [userId, biz.ownerUserId],
    createdAt: new Date().toISOString(),
  };
  conversations.push(convo);
  // Send initial message
  messages.push({
    id: `msg${Date.now()}`,
    conversationId: convo.id,
    senderId: userId,
    text: `Hi! I accepted your offer "${offer.offerTitle}". Let's discuss the details.`,
    createdAt: new Date().toISOString(),
  });
  return convo;
};

export const rejectOffer = (offerId: string) => {
  const offer = offers.find(o => o.id === offerId);
  if (offer) offer.status = 'rejected';
};

// ===== UNREAD MESSAGES =====
export const readReceipts: Record<string, string> = {}; // convoId → lastReadMessageId per user

export const getUnreadCount = (userId: string): number => {
  const userConvos = conversations.filter(c => c.participants.includes(userId));
  let count = 0;
  for (const convo of userConvos) {
    const convoMsgs = messages.filter(m => m.conversationId === convo.id && m.senderId !== userId);
    const lastReadKey = `${userId}_${convo.id}`;
    const lastRead = readReceipts[lastReadKey];
    if (lastRead) {
      count += convoMsgs.filter(m => m.createdAt > lastRead).length;
    } else {
      count += convoMsgs.length;
    }
  }
  return count;
};

export const markConversationRead = (userId: string, conversationId: string) => {
  const convoMsgs = messages.filter(m => m.conversationId === conversationId);
  if (convoMsgs.length > 0) {
    readReceipts[`${userId}_${conversationId}`] = convoMsgs[convoMsgs.length - 1].createdAt;
  }
};

// ===== ADD OFFER TO MOCK =====
export const addOffer = (offer: Offer) => { offers.push(offer); };

// ===== REVIEWS =====
export const reviews: Review[] = [
  { id: 'rev1', businessId: 'b1', userId: 'u2', userName: 'Ahmed Hassan', rating: 5, comment: 'Excellent medical service! Dr. Sarah was very professional and thorough with the checkup. Highly recommended.', createdAt: '2024-03-15' },
  { id: 'rev2', businessId: 'b1', userId: 'u5', userName: 'Fatima Nour', rating: 4, comment: 'Good clinic, clean and well-organized. Wait time was a bit long but the care was great.', createdAt: '2024-03-10' },
  { id: 'rev3', businessId: 'b2', userId: 'u2', userName: 'Ahmed Hassan', rating: 5, comment: 'Found my dream apartment through Nile View! Omar was incredibly helpful and responsive throughout the process.', createdAt: '2024-03-12' },
  { id: 'rev4', businessId: 'b2', userId: 'u5', userName: 'Fatima Nour', rating: 4, comment: 'Great selection of properties. Pricing was transparent and fair.', createdAt: '2024-02-28' },
  { id: 'rev5', businessId: 'b3', userId: 'u2', userName: 'Ahmed Hassan', rating: 4, comment: 'Beautiful fashion pieces, especially the traditional collection. Quality fabrics and unique designs.', createdAt: '2024-03-08' },
];

export const getReviewsByBusiness = (businessId: string) => reviews.filter(r => r.businessId === businessId);
export const addReview = (review: Review) => { reviews.push(review); };

// ===== FAVORITES (User → Business/Listing) =====
export interface Favorite {
  id: string;
  userId: string;
  targetId: string; // businessId or listingId
  targetType: 'business' | 'listing';
  createdAt: string;
}

export const favorites: Favorite[] = [
  { id: 'fav1', userId: 'u2', targetId: 'b1', targetType: 'business', createdAt: '2024-03-10' },
  { id: 'fav2', userId: 'u2', targetId: 'l5', targetType: 'listing', createdAt: '2024-03-12' },
  { id: 'fav3', userId: 'u2', targetId: 'l9', targetType: 'listing', createdAt: '2024-03-14' },
  { id: 'fav4', userId: 'u2', targetId: 'b2', targetType: 'business', createdAt: '2024-03-16' },
];

export const addFavorite = (fav: Favorite) => { favorites.push(fav); };
export const removeFavorite = (userId: string, targetId: string) => {
  const idx = favorites.findIndex(f => f.userId === userId && f.targetId === targetId);
  if (idx !== -1) favorites.splice(idx, 1);
};
export const isFavorited = (userId: string, targetId: string) => favorites.some(f => f.userId === userId && f.targetId === targetId);
export const getFavoritesByUser = (userId: string) => favorites.filter(f => f.userId === userId);
export const getFavoriteBusinessUsers = (businessId: string) => favorites.filter(f => f.targetId === businessId && f.targetType === 'business');

// ===== BUSINESS FAVORITES (Business → User/Buyer) =====
export interface BusinessFavorite {
  id: string;
  businessId: string;
  userId: string;
  note?: string;
  tags?: string[];
  createdAt: string;
}

export const businessFavorites: BusinessFavorite[] = [
  { id: 'bf1', businessId: 'b1', userId: 'u2', note: 'Regular patient, interested in annual checkups', tags: ['loyal', 'high-value'], createdAt: '2024-03-12' },
  { id: 'bf2', businessId: 'b2', userId: 'u2', note: 'Looking for investment properties', tags: ['investor'], createdAt: '2024-03-15' },
];

export const addBusinessFavorite = (fav: BusinessFavorite) => { businessFavorites.push(fav); };
export const removeBusinessFavorite = (businessId: string, userId: string) => {
  const idx = businessFavorites.findIndex(f => f.businessId === businessId && f.userId === userId);
  if (idx !== -1) businessFavorites.splice(idx, 1);
};
export const isBusinessFavorited = (businessId: string, userId: string) => businessFavorites.some(f => f.businessId === businessId && f.userId === userId);
export const getBusinessFavoritesByBusiness = (businessId: string) => businessFavorites.filter(f => f.businessId === businessId);
export const getBusinessesThatFavoritedUser = (userId: string) => businessFavorites.filter(f => f.userId === userId);

// ===== SPECIAL OFFERS (Business → Favorite Users) =====
export interface SpecialOffer {
  id: string;
  businessId: string;
  targetUserIds: string[];
  title: string;
  message: string;
  discountPercent: number;
  listingId?: string;
  expiresAt: string;
  createdAt: string;
}

export const specialOffers: SpecialOffer[] = [
  { id: 'so1', businessId: 'b1', targetUserIds: ['u2'], title: 'VIP Discount: 20% Off Dental Cleaning', message: 'As a valued patient, enjoy an exclusive 20% discount on your next dental cleaning!', discountPercent: 20, listingId: 'l2', expiresAt: '2024-04-30', createdAt: '2024-03-20' },
];

export const addSpecialOffer = (offer: SpecialOffer) => { specialOffers.push(offer); };
export const getSpecialOffersByUser = (userId: string) => specialOffers.filter(o => o.targetUserIds.includes(userId));
export const getSpecialOffersByBusiness = (businessId: string) => specialOffers.filter(o => o.businessId === businessId);

// ===== DEMAND RADAR =====
export interface MarketDemandStat {
  id: string;
  category: string;
  subCategory?: string;
  city: string;
  area: string;
  requestCount: number;
  averagePrice: number;
  week?: number;
  month: number;
  year: number;
}

export const marketDemandStats: MarketDemandStat[] = [
  { id: 'md1', category: 'Clinics', subCategory: 'Dental', city: 'Cairo', area: 'Nasr City', requestCount: 24, averagePrice: 550, month: 3, year: 2024 },
  { id: 'md2', category: 'Clinics', subCategory: 'Dermatology', city: 'Cairo', area: 'Maadi', requestCount: 18, averagePrice: 500, month: 3, year: 2024 },
  { id: 'md3', category: 'Real Estate', subCategory: 'Apartments', city: 'Cairo', area: 'New Cairo', requestCount: 42, averagePrice: 25000, month: 3, year: 2024 },
  { id: 'md4', category: 'Real Estate', subCategory: 'Studios', city: 'Giza', area: '6th October', requestCount: 15, averagePrice: 4500, month: 3, year: 2024 },
  { id: 'md5', category: 'Real Estate', subCategory: 'Offices', city: 'Cairo', area: 'Downtown', requestCount: 20, averagePrice: 12000, month: 3, year: 2024 },
  { id: 'md6', category: 'Fashion', subCategory: 'Women', city: 'Cairo', area: 'Maadi', requestCount: 12, averagePrice: 850, month: 3, year: 2024 },
  { id: 'md7', category: 'Fashion', subCategory: 'Kids', city: 'Cairo', area: 'Heliopolis', requestCount: 9, averagePrice: 550, month: 3, year: 2024 },
  { id: 'md8', category: 'Clinics', subCategory: 'Pediatrics', city: 'Cairo', area: 'Heliopolis', requestCount: 14, averagePrice: 400, month: 3, year: 2024 },
  { id: 'md9', category: 'Clinics', subCategory: 'General Practice', city: 'Cairo', area: 'Maadi', requestCount: 30, averagePrice: 600, month: 2, year: 2024 },
  { id: 'md10', category: 'Real Estate', subCategory: 'Apartments', city: 'Cairo', area: 'New Cairo', requestCount: 35, averagePrice: 22000, month: 2, year: 2024 },
  { id: 'md11', category: 'Clinics', subCategory: 'Dental', city: 'Cairo', area: 'Nasr City', requestCount: 18, averagePrice: 520, month: 2, year: 2024 },
  { id: 'md12', category: 'Fashion', subCategory: 'Women', city: 'Cairo', area: 'Maadi', requestCount: 8, averagePrice: 900, month: 2, year: 2024 },
];

export const getDemandStats = () => marketDemandStats;
export const getDemandByCategory = (category: string) => marketDemandStats.filter(d => d.category === category);
export const getDemandByArea = (area: string) => marketDemandStats.filter(d => d.area === area);
export const getDemandForBusiness = (businessId: string) => {
  const biz = businesses.find(b => b.id === businessId);
  if (!biz) return [];
  return marketDemandStats.filter(d => d.category === biz.category);
};

export const getDemandInsights = (businessId: string): string[] => {
  const biz = businesses.find(b => b.id === businessId);
  if (!biz) return [];
  const insights: string[] = [];
  const catStats = marketDemandStats.filter(d => d.category === biz.category && d.month === 3 && d.year === 2024);
  const sorted = [...catStats].sort((a, b) => b.requestCount - a.requestCount);
  if (sorted.length > 0) {
    insights.push(`🔥 High demand for ${sorted[0].subCategory || sorted[0].category} in ${sorted[0].area} — ${sorted[0].requestCount} requests this month`);
  }
  if (sorted.length > 1) {
    insights.push(`📈 ${sorted[1].subCategory || sorted[1].category} requests in ${sorted[1].area} averaging ${sorted[1].averagePrice} EGP`);
  }
  const openReqs = buyerRequests.filter(r => r.category === biz.category && r.status === 'open');
  if (openReqs.length > 0) {
    insights.push(`🎯 ${openReqs.length} open buyer requests in your category right now`);
  }
  return insights;
};

// ===== BUSINESS DIRECTORY & INVITATIONS =====
export type InvitationStatus = 'sent' | 'opened' | 'joined';

export interface DirectoryBusiness {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  city: string;
  area: string;
  phone: string;
  email: string;
  source: string;
  isRegistered: boolean;
  createdAt: string;
}

export interface BusinessInvitation {
  id: string;
  directoryBusinessId: string;
  requestId?: string;
  message: string;
  status: InvitationStatus;
  sentAt: string;
  openedAt?: string;
  joinedAt?: string;
}

export const directoryBusinesses: DirectoryBusiness[] = [
  { id: 'db1', name: 'Smile Dental Clinic', category: 'Clinics', subCategory: 'Dental', city: 'Cairo', area: 'Nasr City', phone: '+201500000001', email: 'smile@dental.eg', source: 'Google Maps', isRegistered: false, createdAt: '2024-01-01' },
  { id: 'db2', name: 'Dr. Khaled Orthopedics', category: 'Clinics', subCategory: 'General Practice', city: 'Cairo', area: 'Heliopolis', phone: '+201500000002', email: 'khaled.ortho@clinic.eg', source: 'Yellow Pages', isRegistered: false, createdAt: '2024-01-05' },
  { id: 'db3', name: 'Horizon Real Estate', category: 'Real Estate', subCategory: 'Apartments', city: 'Cairo', area: 'New Cairo', phone: '+201500000003', email: 'info@horizon-re.eg', source: 'OLX Directory', isRegistered: false, createdAt: '2024-01-10' },
  { id: 'db4', name: 'Urban Nest Properties', category: 'Real Estate', subCategory: 'Studios', city: 'Giza', area: '6th October', phone: '+201500000004', email: 'hello@urbannest.eg', source: 'Google Maps', isRegistered: false, createdAt: '2024-02-01' },
  { id: 'db5', name: 'Chic Avenue Fashion', category: 'Fashion', subCategory: 'Women', city: 'Cairo', area: 'Maadi', phone: '+201500000005', email: 'chic@avenue.eg', source: 'Instagram', isRegistered: false, createdAt: '2024-02-10' },
  { id: 'db6', name: 'Little Stars Kids Wear', category: 'Fashion', subCategory: 'Kids', city: 'Cairo', area: 'Heliopolis', phone: '+201500000006', email: 'stars@kidswear.eg', source: 'Facebook', isRegistered: false, createdAt: '2024-02-15' },
  { id: 'db7', name: 'Cairo Skin Care Center', category: 'Clinics', subCategory: 'Dermatology', city: 'Cairo', area: 'Maadi', phone: '+201500000007', email: 'info@cairoskin.eg', source: 'Google Maps', isRegistered: false, createdAt: '2024-02-20' },
  { id: 'db8', name: 'Maadi Dental Studio', category: 'Clinics', subCategory: 'Dental', city: 'Cairo', area: 'Maadi', phone: '+201500000008', email: 'dental@maadi.eg', source: 'Yellow Pages', isRegistered: true, createdAt: '2024-01-15' },
];

export const businessInvitations: BusinessInvitation[] = [
  { id: 'inv1', directoryBusinessId: 'db1', requestId: 'br2', message: 'A user is looking for a dentist in Nasr City. Join MarketMate to respond!', status: 'sent', sentAt: '2024-03-15' },
  { id: 'inv2', directoryBusinessId: 'db3', requestId: 'br1', message: 'A buyer needs an apartment in New Cairo. Register on MarketMate to send an offer!', status: 'opened', sentAt: '2024-03-18', openedAt: '2024-03-19' },
  { id: 'inv3', directoryBusinessId: 'db7', requestId: 'br6', message: 'A user needs a dermatologist in Maadi. Join MarketMate to connect!', status: 'joined', sentAt: '2024-03-20', openedAt: '2024-03-20', joinedAt: '2024-03-21' },
];

export const getDirectoryBusinesses = () => directoryBusinesses;
export const addDirectoryBusiness = (biz: DirectoryBusiness) => { directoryBusinesses.push(biz); };
export const getInvitations = () => businessInvitations;
export const getInvitationStats = () => ({
  total: businessInvitations.length,
  sent: businessInvitations.filter(i => i.status === 'sent').length,
  opened: businessInvitations.filter(i => i.status === 'opened').length,
  joined: businessInvitations.filter(i => i.status === 'joined').length,
});

export const sendInvitationsForRequest = (requestId: string) => {
  const request = buyerRequests.find(r => r.id === requestId);
  if (!request) return [];
  // Find matching registered businesses → send notifications
  const matchingBiz = businesses.filter(b => b.category === request.category);
  for (const biz of matchingBiz) {
    const owner = users.find(u => u.id === biz.ownerUserId);
    if (owner) {
      notifications.push({
        id: `n${Date.now()}${Math.random().toString(36).slice(2, 5)}`,
        userId: owner.id,
        title: 'New Buyer Request Matches Your Category!',
        body: `"${request.title}" — ${request.description.slice(0, 60)}...`,
        type: 'buyer_request',
        read: false,
        createdAt: new Date().toISOString(),
      });
    }
  }
  // Find matching unregistered directory businesses → send invitations
  const matchingDir = directoryBusinesses.filter(d =>
    !d.isRegistered && d.category === request.category &&
    (d.city === request.city || d.area === request.area)
  );
  const newInvitations: BusinessInvitation[] = [];
  for (const dir of matchingDir) {
    const existing = businessInvitations.find(i => i.directoryBusinessId === dir.id && i.requestId === requestId);
    if (!existing) {
      const inv: BusinessInvitation = {
        id: `inv${Date.now()}${Math.random().toString(36).slice(2, 5)}`,
        directoryBusinessId: dir.id,
        requestId,
        message: `A user is looking for "${request.title}" in ${request.area}, ${request.city}. Join MarketMate to respond!`,
        status: 'sent',
        sentAt: new Date().toISOString(),
      };
      businessInvitations.push(inv);
      newInvitations.push(inv);
    }
  }
  return newInvitations;
};

// ===== AI ANALYTICS MOCK =====
export interface AIInsight {
  id: string;
  type: 'business_performance' | 'market_trend' | 'pricing' | 'demand' | 'competitor';
  title: string;
  summary: string;
  details: string;
  impact: 'high' | 'medium' | 'low';
  category?: string;
  metric?: string;
  metricValue?: string;
  createdAt: string;
}

export const aiInsights: AIInsight[] = [
  { id: 'ai1', type: 'market_trend', title: 'Rising Demand for Dental Services in Nasr City', summary: 'Search volume for dental services in Nasr City increased 45% this month.', details: 'Analysis of buyer requests and search patterns shows a significant uptick in dental service demand in Nasr City. Currently only 2 dental clinics serve this area vs. 8 in Maadi. Opening a branch or running targeted ads could capture 150+ leads/month.', impact: 'high', category: 'Clinics', metric: 'Demand Growth', metricValue: '+45%', createdAt: '2024-03-20' },
  { id: 'ai2', type: 'pricing', title: 'Your Listings Are 18% Above Market Average', summary: 'Compared to similar businesses in your area, your average listing price is higher.', details: 'AI analysis of 47 competing listings shows your average price is 18% above the Maadi area average for medical services. While your rating (4.8★) justifies a premium, a 10% discount on select services could increase lead conversion by ~30%.', impact: 'medium', category: 'Clinics', metric: 'Price Gap', metricValue: '+18%', createdAt: '2024-03-19' },
  { id: 'ai3', type: 'business_performance', title: 'Lead Conversion Rate Declining', summary: 'Your lead-to-customer conversion dropped from 42% to 28% this quarter.', details: 'The AI detected that while your lead volume increased by 20%, the conversion rate dropped significantly. Key factors: response time increased from 2h to 8h average, and 35% of leads report no follow-up within 48h. Recommendation: Set up automated responses and prioritize hot leads.', impact: 'high', metric: 'Conversion Rate', metricValue: '-14%', createdAt: '2024-03-18' },
  { id: 'ai4', type: 'demand', title: 'Furnished Apartments in High Demand', summary: '78% of real estate requests specifically ask for furnished apartments.', details: 'Market analysis reveals strong preference for furnished units, especially among expats and young professionals. Only 40% of current listings are furnished. Businesses offering furnished options see 2.3x more inquiries on average.', impact: 'high', category: 'Real Estate', metric: 'Furnished Demand', metricValue: '78%', createdAt: '2024-03-17' },
  { id: 'ai5', type: 'competitor', title: 'New Competitor Alert: Fashion District', summary: 'A new fashion boutique opened in New Cairo with aggressive pricing.', details: 'AI detected a new competitor "Cairo Chic" launched with prices 25% below market average and heavy social media advertising. Their initial listings focus on women\'s wear and traditional clothing — directly competing with your top categories. Consider a loyalty program or exclusive discounts for repeat customers.', impact: 'medium', category: 'Fashion', metric: 'Price Undercut', metricValue: '-25%', createdAt: '2024-03-16' },
  { id: 'ai6', type: 'market_trend', title: 'Ramadan Shopping Season Starting Early', summary: 'Pre-Ramadan searches increased 60% earlier than last year.', details: 'Consumer behavior data shows Ramadan-related shopping queries started 3 weeks earlier than 2023. Categories trending: Traditional wear (+60%), Food & catering (+45%), Home decor (+35%). Businesses launching campaigns now will capture early-bird shoppers.', impact: 'high', metric: 'Early Trend', metricValue: '+3 weeks', createdAt: '2024-03-15' },
  { id: 'ai7', type: 'business_performance', title: 'Top Performing Listing: Health Checkup', summary: 'Your "General Health Checkup" listing generates 3x more leads than average.', details: 'AI analysis shows this listing\'s success factors: competitive pricing (33% off), clear description, and high-quality image. Replicate these elements across other listings. The deal label "33% Off" specifically drove a 40% click-through rate increase.', impact: 'medium', metric: 'Lead Multiplier', metricValue: '3x', createdAt: '2024-03-14' },
  { id: 'ai8', type: 'demand', title: 'Office Space Demand Shifting to 6th October', summary: 'Startup office space requests in 6th October grew 55% month-over-month.', details: 'The tech startup ecosystem is expanding beyond Downtown and New Cairo. 6th October City is emerging as a cost-effective alternative with 35% lower rent. Listings in this area receive 2x more inquiries per listing compared to saturated Downtown market.', impact: 'medium', category: 'Real Estate', metric: 'Growth Rate', metricValue: '+55%', createdAt: '2024-03-13' },
];

export const getAIInsightsByCategory = (category?: string) => category ? aiInsights.filter(i => !i.category || i.category === category) : aiInsights;
export const getAIInsightsByType = (type: string) => aiInsights.filter(i => i.type === type);

// ===== AUTOMATION WORKFLOWS =====
export type AutomationTrigger = 'buyer_request_received' | 'offer_accepted' | 'new_message';
export type AutomationAction = 'webhook' | 'email' | 'google_sheet' | 'internal_log';

export interface AutomationWorkflow {
  id: string;
  businessId: string;
  name: string;
  triggerType: AutomationTrigger;
  actionType: AutomationAction;
  configJson: Record<string, string>;
  active: boolean;
  createdAt: string;
}

export interface AutomationLog {
  id: string;
  workflowId: string;
  triggerEvent: string;
  actionResult: 'success' | 'failed';
  details: string;
  createdAt: string;
}

export const automationWorkflows: AutomationWorkflow[] = [
  { id: 'aw1', businessId: 'b1', name: 'Notify on new requests', triggerType: 'buyer_request_received', actionType: 'webhook', configJson: { url: 'https://hooks.example.com/marketmate/new-request' }, active: true, createdAt: '2024-03-01' },
  { id: 'aw2', businessId: 'b1', name: 'Log accepted offers', triggerType: 'offer_accepted', actionType: 'internal_log', configJson: {}, active: true, createdAt: '2024-03-05' },
  { id: 'aw3', businessId: 'b2', name: 'Sheet: accepted offers', triggerType: 'offer_accepted', actionType: 'google_sheet', configJson: { sheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms', tab: 'Offers' }, active: true, createdAt: '2024-03-10' },
  { id: 'aw4', businessId: 'b2', name: 'Email on new message', triggerType: 'new_message', actionType: 'email', configJson: { to: 'omar@realestate.eg' }, active: false, createdAt: '2024-03-12' },
];

export const automationLogs: AutomationLog[] = [
  { id: 'al1', workflowId: 'aw1', triggerEvent: 'Buyer request br6 received', actionResult: 'success', details: 'Webhook delivered to https://hooks.example.com/marketmate/new-request — 200 OK', createdAt: '2024-03-20T14:30:00' },
  { id: 'al2', workflowId: 'aw2', triggerEvent: 'Offer of2 accepted', actionResult: 'success', details: 'Logged: Offer "Expert Dental Care" accepted by Ahmed Hassan', createdAt: '2024-03-16T11:00:00' },
  { id: 'al3', workflowId: 'aw3', triggerEvent: 'Offer of2 accepted', actionResult: 'success', details: 'Row appended to Google Sheet "Offers" tab', createdAt: '2024-03-16T11:01:00' },
  { id: 'al4', workflowId: 'aw1', triggerEvent: 'Buyer request br7 received', actionResult: 'failed', details: 'Webhook delivery failed — connection timeout', createdAt: '2024-03-21T09:15:00' },
];

export const getWorkflowsByBusiness = (businessId: string) => automationWorkflows.filter(w => w.businessId === businessId);
export const getAutomationLogs = (workflowId?: string) => workflowId ? automationLogs.filter(l => l.workflowId === workflowId) : automationLogs;

export const addWorkflow = (wf: AutomationWorkflow) => { automationWorkflows.push(wf); };
export const updateWorkflow = (id: string, updates: Partial<AutomationWorkflow>) => {
  const wf = automationWorkflows.find(w => w.id === id);
  if (wf) Object.assign(wf, updates);
};
export const deleteWorkflow = (id: string) => {
  const idx = automationWorkflows.findIndex(w => w.id === id);
  if (idx !== -1) automationWorkflows.splice(idx, 1);
};

export const runAutomation = (triggerType: AutomationTrigger, businessId: string, eventDescription: string) => {
  const matching = automationWorkflows.filter(w => w.businessId === businessId && w.triggerType === triggerType && w.active);
  for (const wf of matching) {
    const log: AutomationLog = {
      id: `al${Date.now()}${Math.random().toString(36).slice(2, 5)}`,
      workflowId: wf.id,
      triggerEvent: eventDescription,
      actionResult: Math.random() > 0.1 ? 'success' : 'failed',
      details: `${wf.actionType}: ${wf.name} — ${eventDescription}`,
      createdAt: new Date().toISOString(),
    };
    automationLogs.push(log);
  }
};

// ===== GROUP DEALS =====
export type GroupDealStatus = 'draft' | 'active' | 'completed' | 'expired';
export type GroupDealParticipantStatus = 'joined' | 'confirmed' | 'cancelled';

export interface GroupDeal {
  id: string;
  businessId: string;
  title: string;
  description: string;
  category: string;
  city: string;
  area: string;
  originalPrice: number;
  dealPrice: number;
  requiredParticipants: number;
  currentParticipants: number;
  startDate: string;
  endDate: string;
  status: GroupDealStatus;
  createdAt: string;
}

export interface GroupDealParticipant {
  id: string;
  dealId: string;
  userId: string;
  joinedAt: string;
  status: GroupDealParticipantStatus;
}

export const groupDeals: GroupDeal[] = [
  { id: 'gd1', businessId: 'b1', title: 'Group Health Checkup Package', description: 'Get a comprehensive health checkup at a fraction of the cost when enough people join! Includes blood tests, ECG, and consultation.', category: 'Clinics', city: 'Cairo', area: 'Maadi', originalPrice: 750, dealPrice: 450, requiredParticipants: 15, currentParticipants: 11, startDate: '2024-03-15', endDate: '2024-04-15', status: 'active', createdAt: '2024-03-15' },
  { id: 'gd2', businessId: 'b3', title: 'Winter Jacket Group Buy', description: 'Premium Egyptian cotton winter jackets at group discount. Available in multiple sizes and colors.', category: 'Fashion', city: 'Cairo', area: 'New Cairo', originalPrice: 1200, dealPrice: 750, requiredParticipants: 20, currentParticipants: 14, startDate: '2024-03-10', endDate: '2024-04-10', status: 'active', createdAt: '2024-03-10' },
  { id: 'gd3', businessId: 'b2', title: 'Shared Office Space Deal', description: 'Co-working space in Downtown Cairo. Join the group to unlock a massive discount on monthly rent.', category: 'Real Estate', city: 'Cairo', area: 'Downtown', originalPrice: 5000, dealPrice: 3000, requiredParticipants: 10, currentParticipants: 10, startDate: '2024-02-01', endDate: '2024-03-01', status: 'completed', createdAt: '2024-02-01' },
  { id: 'gd4', businessId: 'b1', title: 'Family Dental Cleaning Package', description: 'Professional dental cleaning for the whole family. Bring friends to unlock the group price!', category: 'Clinics', city: 'Cairo', area: 'Maadi', originalPrice: 800, dealPrice: 500, requiredParticipants: 12, currentParticipants: 5, startDate: '2024-03-20', endDate: '2024-04-20', status: 'active', createdAt: '2024-03-20' },
];

export const groupDealParticipants: GroupDealParticipant[] = [
  { id: 'gdp1', dealId: 'gd1', userId: 'u2', joinedAt: '2024-03-16', status: 'joined' },
  { id: 'gdp2', dealId: 'gd1', userId: 'u6', joinedAt: '2024-03-17', status: 'joined' },
  { id: 'gdp3', dealId: 'gd1', userId: 'u7', joinedAt: '2024-03-18', status: 'joined' },
  { id: 'gdp4', dealId: 'gd2', userId: 'u2', joinedAt: '2024-03-11', status: 'joined' },
  { id: 'gdp5', dealId: 'gd2', userId: 'u8', joinedAt: '2024-03-12', status: 'joined' },
  { id: 'gdp6', dealId: 'gd3', userId: 'u2', joinedAt: '2024-02-02', status: 'confirmed' },
  { id: 'gdp7', dealId: 'gd3', userId: 'u7', joinedAt: '2024-02-03', status: 'confirmed' },
];

export const getGroupDeals = () => groupDeals;
export const getActiveGroupDeals = () => groupDeals.filter(d => d.status === 'active');
export const getGroupDealById = (id: string) => groupDeals.find(d => d.id === id);
export const getGroupDealsByBusiness = (businessId: string) => groupDeals.filter(d => d.businessId === businessId);
export const getGroupDealParticipants = (dealId: string) => groupDealParticipants.filter(p => p.dealId === dealId);
export const hasUserJoinedDeal = (dealId: string, userId: string) => groupDealParticipants.some(p => p.dealId === dealId && p.userId === userId && p.status !== 'cancelled');

export const joinGroupDeal = (dealId: string, userId: string): { success: boolean; message: string; completed?: boolean } => {
  const deal = groupDeals.find(d => d.id === dealId);
  if (!deal) return { success: false, message: 'Deal not found' };
  if (deal.status !== 'active') return { success: false, message: 'Deal is not active' };
  if (hasUserJoinedDeal(dealId, userId)) return { success: false, message: 'You already joined this deal' };

  groupDealParticipants.push({
    id: `gdp${Date.now()}`,
    dealId,
    userId,
    joinedAt: new Date().toISOString(),
    status: 'joined',
  });
  deal.currentParticipants++;

  // Check completion
  if (deal.currentParticipants >= deal.requiredParticipants) {
    deal.status = 'completed';
    // Confirm all participants
    groupDealParticipants.filter(p => p.dealId === dealId && p.status === 'joined').forEach(p => p.status = 'confirmed');
    // Notify all participants
    const participants = groupDealParticipants.filter(p => p.dealId === dealId);
    for (const p of participants) {
      notifications.push({
        id: `n${Date.now()}${Math.random().toString(36).slice(2, 5)}`,
        userId: p.userId,
        title: '🎉 Group Deal Unlocked!',
        body: `"${deal.title}" has been unlocked! The group price of ${deal.dealPrice} EGP is now active.`,
        type: 'group_deal',
        read: false,
        createdAt: new Date().toISOString(),
      });
    }
    return { success: true, message: 'Deal unlocked! 🎉', completed: true };
  }

  // Notify if close to unlocking
  const remaining = deal.requiredParticipants - deal.currentParticipants;
  if (remaining <= 3) {
    const participants = groupDealParticipants.filter(p => p.dealId === dealId && p.userId !== userId);
    for (const p of participants) {
      notifications.push({
        id: `n${Date.now()}${Math.random().toString(36).slice(2, 5)}`,
        userId: p.userId,
        title: '🔥 Almost There!',
        body: `Only ${remaining} more needed to unlock "${deal.title}"!`,
        type: 'group_deal',
        read: false,
        createdAt: new Date().toISOString(),
      });
    }
  }

  return { success: true, message: `Joined! ${deal.requiredParticipants - deal.currentParticipants} more needed.` };
};

export const addGroupDeal = (deal: GroupDeal) => { groupDeals.push(deal); };

// ===== LOCATION EVENTS (Smart Map) =====
export type LocationEntityType = 'business' | 'listing' | 'buyer_request' | 'deal';

export interface LocationEvent {
  id: string;
  entityType: LocationEntityType;
  entityId: string;
  category: string;
  latitude: number;
  longitude: number;
  city: string;
  area: string;
  createdAt: string;
}

// Build location events from existing data
export const getLocationEvents = (): LocationEvent[] => {
  const events: LocationEvent[] = [];

  // Businesses
  for (const b of businesses) {
    events.push({ id: `le-b-${b.id}`, entityType: 'business', entityId: b.id, category: b.category, latitude: b.latitude, longitude: b.longitude, city: b.city, area: b.area, createdAt: b.createdAt });
  }

  // Listings — use parent business location
  for (const l of listings.filter(l => l.status === 'active')) {
    const biz = businesses.find(b => b.id === l.businessId);
    if (biz) {
      events.push({ id: `le-l-${l.id}`, entityType: 'listing', entityId: l.id, category: l.category, latitude: biz.latitude + (Math.random() - 0.5) * 0.02, longitude: biz.longitude + (Math.random() - 0.5) * 0.02, city: l.city, area: l.area, createdAt: l.createdAt });
    }
  }

  // Buyer requests — approximate coordinates by area
  const areaCoords: Record<string, [number, number]> = {
    'Maadi': [29.96, 31.26], 'Zamalek': [30.06, 31.22], 'Nasr City': [30.05, 31.34],
    'New Cairo': [30.03, 31.41], '6th October': [29.97, 30.94], 'Heliopolis': [30.09, 31.33],
    'Downtown': [30.05, 31.24], 'Dokki': [30.04, 31.21], 'Mohandessin': [30.05, 31.20],
  };
  for (const r of buyerRequests.filter(r => r.status === 'open')) {
    const coords = areaCoords[r.area] || [30.04, 31.24];
    events.push({ id: `le-r-${r.id}`, entityType: 'buyer_request', entityId: r.id, category: r.category, latitude: coords[0] + (Math.random() - 0.5) * 0.03, longitude: coords[1] + (Math.random() - 0.5) * 0.03, city: r.city, area: r.area, createdAt: r.createdAt });
  }

  // Group deals
  for (const d of groupDeals.filter(d => d.status === 'active')) {
    const biz = businesses.find(b => b.id === d.businessId);
    const coords = biz ? [biz.latitude, biz.longitude] : (areaCoords[d.area] || [30.04, 31.24]);
    events.push({ id: `le-d-${d.id}`, entityType: 'deal', entityId: d.id, category: d.category, latitude: coords[0] + (Math.random() - 0.5) * 0.015, longitude: coords[1] + (Math.random() - 0.5) * 0.015, city: d.city, area: d.area, createdAt: d.createdAt });
  }

  return events;
};

export const getNearbyEntities = (lat: number, lng: number, radiusKm: number = 10, category?: string) => {
  const events = getLocationEvents();
  const filtered = events.filter(e => {
    const dist = Math.sqrt(Math.pow((e.latitude - lat) * 111, 2) + Math.pow((e.longitude - lng) * 95, 2));
    return dist <= radiusKm && (!category || e.category === category);
  });
  return {
    businesses: filtered.filter(e => e.entityType === 'business'),
    listings: filtered.filter(e => e.entityType === 'listing'),
    buyer_requests: filtered.filter(e => e.entityType === 'buyer_request'),
    deals: filtered.filter(e => e.entityType === 'deal'),
  };
};

// ===== B2B MARKETPLACE =====
export type B2BRequestStatus = 'open' | 'matched' | 'closed';
export type B2BOfferStatus = 'pending' | 'accepted' | 'rejected';
export type B2BListingStatus = 'active' | 'inactive';

export interface B2BRequest {
  id: string;
  requesterBusinessId: string;
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  quantity: number;
  budgetMin?: number;
  budgetMax?: number;
  city: string;
  area: string;
  status: B2BRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface B2BOffer {
  id: string;
  requestId: string;
  supplierBusinessId: string;
  message: string;
  pricePerUnit: number;
  minimumOrderQuantity: number;
  totalPrice: number;
  status: B2BOfferStatus;
  createdAt: string;
}

export interface B2BListing {
  id: string;
  supplierBusinessId: string;
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  minimumOrderQuantity: number;
  unitPrice: number;
  city: string;
  imageUrl?: string;
  status: B2BListingStatus;
  createdAt: string;
}

export const b2bRequests: B2BRequest[] = [
  { id: 'b2br1', requesterBusinessId: 'b3', title: 'Winter jackets supplier needed — 200 units', description: 'Looking for a textile factory or wholesaler that can supply 200 winter jackets in various sizes. Must be Egyptian cotton blend, competitive pricing required.', category: 'Fashion', subCategory: 'Women', quantity: 200, budgetMin: 80, budgetMax: 150, city: 'Cairo', area: 'New Cairo', status: 'open', createdAt: '2024-03-18', updatedAt: '2024-03-18' },
  { id: 'b2br2', requesterBusinessId: 'b1', title: 'Laser hair removal machine', description: 'Looking for a medical equipment supplier for a professional-grade laser hair removal machine. Must include warranty and training.', category: 'Clinics', quantity: 1, budgetMin: 50000, budgetMax: 120000, city: 'Cairo', area: 'Maadi', status: 'open', createdAt: '2024-03-20', updatedAt: '2024-03-20' },
  { id: 'b2br3', requesterBusinessId: 'b2', title: 'Office furniture — bulk order', description: 'Need 50 office desks and 50 ergonomic chairs for a new co-working space in Downtown Cairo. Delivery and assembly required.', category: 'Real Estate', quantity: 100, budgetMin: 1500, budgetMax: 3000, city: 'Cairo', area: 'Downtown', status: 'open', createdAt: '2024-03-22', updatedAt: '2024-03-22' },
  { id: 'b2br4', requesterBusinessId: 'b3', title: 'Packaging materials — monthly supply', description: 'Need a reliable packaging supplier for monthly orders of branded boxes, tissue paper, and stickers for our fashion boutique.', category: 'Fashion', quantity: 500, budgetMin: 5, budgetMax: 15, city: 'Cairo', area: 'New Cairo', status: 'matched', createdAt: '2024-03-15', updatedAt: '2024-03-19' },
];

export const b2bOffers: B2BOffer[] = [
  { id: 'b2bo1', requestId: 'b2br1', supplierBusinessId: 'b2', message: 'We partner with a textile factory in 10th of Ramadan. Can supply 200 units at competitive prices with 2-week delivery.', pricePerUnit: 120, minimumOrderQuantity: 100, totalPrice: 24000, status: 'pending', createdAt: '2024-03-19' },
  { id: 'b2bo2', requestId: 'b2br4', supplierBusinessId: 'b1', message: 'We can supply branded packaging materials monthly. High quality offset printing with fast turnaround.', pricePerUnit: 10, minimumOrderQuantity: 200, totalPrice: 5000, status: 'accepted', createdAt: '2024-03-16' },
  { id: 'b2bo3', requestId: 'b2br2', supplierBusinessId: 'b2', message: 'We distribute medical equipment from top brands. Can offer Alma Soprano ICE with full training and 3-year warranty.', pricePerUnit: 95000, minimumOrderQuantity: 1, totalPrice: 95000, status: 'pending', createdAt: '2024-03-21' },
];

export const b2bListings: B2BListing[] = [
  { id: 'b2bl1', supplierBusinessId: 'b2', title: 'Bulk Office Furniture — Desks & Chairs', description: 'Premium office desks and ergonomic chairs available in bulk. Minimum order 20 units. Delivery across Greater Cairo included.', category: 'Real Estate', minimumOrderQuantity: 20, unitPrice: 2200, city: 'Cairo', imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', status: 'active', createdAt: '2024-03-10' },
  { id: 'b2bl2', supplierBusinessId: 'b1', title: 'Medical Supplies — Disposable Gloves & Masks', description: 'Hospital-grade disposable gloves and surgical masks. Wholesale pricing for clinics and hospitals.', category: 'Clinics', minimumOrderQuantity: 500, unitPrice: 3, city: 'Cairo', imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop', status: 'active', createdAt: '2024-03-05' },
  { id: 'b2bl3', supplierBusinessId: 'b3', title: 'Wholesale Fashion Fabrics — Egyptian Cotton', description: 'Premium Egyptian cotton fabric rolls for fashion designers and manufacturers. Multiple colors and weights available.', category: 'Fashion', minimumOrderQuantity: 50, unitPrice: 85, city: 'Cairo', imageUrl: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=300&fit=crop', status: 'active', createdAt: '2024-03-12' },
  { id: 'b2bl4', supplierBusinessId: 'b2', title: 'Restaurant Packaging — Eco-Friendly Containers', description: 'Biodegradable food containers and packaging. Perfect for restaurants and catering businesses. MOQ 1000 units.', category: 'Fashion', subCategory: 'Accessories', minimumOrderQuantity: 1000, unitPrice: 2, city: 'Cairo', imageUrl: 'https://images.unsplash.com/photo-1610024062303-e355e94c7a8c?w=400&h=300&fit=crop', status: 'active', createdAt: '2024-03-08' },
];

// B2B Helpers
export const getB2BRequests = () => b2bRequests;
export const getOpenB2BRequests = () => b2bRequests.filter(r => r.status === 'open');
export const getB2BRequestById = (id: string) => b2bRequests.find(r => r.id === id);
export const getB2BRequestsByBusiness = (businessId: string) => b2bRequests.filter(r => r.requesterBusinessId === businessId);
export const getB2BOffersByRequest = (requestId: string) => b2bOffers.filter(o => o.requestId === requestId);
export const getB2BOffersBySupplier = (businessId: string) => b2bOffers.filter(o => o.supplierBusinessId === businessId);
export const getB2BListings = () => b2bListings.filter(l => l.status === 'active');
export const getB2BListingById = (id: string) => b2bListings.find(l => l.id === id);
export const getB2BListingsByBusiness = (businessId: string) => b2bListings.filter(l => l.supplierBusinessId === businessId);

export const addB2BRequest = (req: B2BRequest) => {
  b2bRequests.push(req);
  // Notify all businesses in matching category
  const matchingBiz = businesses.filter(b => b.category === req.category);
  for (const biz of matchingBiz) {
    if (biz.id !== req.requesterBusinessId) {
      notifications.push({
        id: `n${Date.now()}${Math.random().toString(36).slice(2, 5)}`,
        userId: biz.ownerUserId,
        title: '📦 New B2B Supply Request',
        body: `"${req.title}" — ${req.quantity} units needed`,
        type: 'b2b_request',
        read: false,
        createdAt: new Date().toISOString(),
      });
    }
  }
};

export const addB2BOffer = (offer: B2BOffer) => {
  b2bOffers.push(offer);
  const req = b2bRequests.find(r => r.id === offer.requestId);
  if (req) {
    const requesterBiz = businesses.find(b => b.id === req.requesterBusinessId);
    if (requesterBiz) {
      notifications.push({
        id: `n${Date.now()}${Math.random().toString(36).slice(2, 5)}`,
        userId: requesterBiz.ownerUserId,
        title: '💼 New Supplier Offer',
        body: `You received a supplier offer for "${req.title}" at ${offer.pricePerUnit} EGP/unit`,
        type: 'b2b_offer',
        read: false,
        createdAt: new Date().toISOString(),
      });
    }
  }
};

export const acceptB2BOffer = (offerId: string) => {
  const offer = b2bOffers.find(o => o.id === offerId);
  if (!offer) return null;
  offer.status = 'accepted';
  const req = b2bRequests.find(r => r.id === offer.requestId);
  if (req) {
    req.status = 'matched';
    req.updatedAt = new Date().toISOString();
  }
  // Reject other offers
  b2bOffers.filter(o => o.requestId === offer.requestId && o.id !== offerId).forEach(o => o.status = 'rejected');
  // Notify supplier
  const supplierBiz = businesses.find(b => b.id === offer.supplierBusinessId);
  if (supplierBiz) {
    notifications.push({
      id: `n${Date.now()}${Math.random().toString(36).slice(2, 5)}`,
      userId: supplierBiz.ownerUserId,
      title: '✅ B2B Offer Accepted!',
      body: `Your supplier offer has been accepted! Total: ${offer.totalPrice} EGP`,
      type: 'b2b_offer_accepted',
      read: false,
      createdAt: new Date().toISOString(),
    });
  }
  // Create conversation between the two businesses
  const requesterBiz = req ? businesses.find(b => b.id === req.requesterBusinessId) : null;
  if (requesterBiz && supplierBiz) {
    const convo: Conversation = {
      id: `conv${Date.now()}`,
      participants: [requesterBiz.ownerUserId, supplierBiz.ownerUserId],
      createdAt: new Date().toISOString(),
    };
    conversations.push(convo);
    messages.push({
      id: `msg${Date.now()}`,
      conversationId: convo.id,
      senderId: requesterBiz.ownerUserId,
      text: `Hi! I accepted your B2B offer. Let's discuss delivery details for the order.`,
      createdAt: new Date().toISOString(),
    });
  }
  return offer;
};

export const addB2BListing = (listing: B2BListing) => { b2bListings.push(listing); };

export const canBusinessPostB2B = (businessId: string): { allowed: boolean; reason?: string } => {
  const sub = subscriptions.find(s => s.businessId === businessId);
  if (!sub || sub.planName === 'free') {
    return { allowed: false, reason: 'Pro subscription required for B2B marketplace features. Upgrade to Pro (200 EGP/month).' };
  }
  if (sub.status !== 'active') {
    return { allowed: false, reason: 'Your subscription has expired. Please renew to access B2B features.' };
  }
  return { allowed: true };
};
