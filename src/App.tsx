import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { I18nProvider } from "@/i18n";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicLayout } from "@/layouts/PublicLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { isFeatureEnabled, FEATURE_FLAGS } from "@/lib/feature-flags";

const FeatureGatedRoute = ({ 
  feature, 
  children, 
  redirectTo = "/" 
}: { 
  feature: keyof typeof FEATURE_FLAGS; 
  children: React.ReactNode;
  redirectTo?: string;
}) => {
  return isFeatureEnabled(feature) ? <>{children}</> : <Navigate to={redirectTo} replace />;
};


// Public pages
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import ListingDetails from "./pages/ListingDetails";
import BusinessesDirectory from "./pages/BusinessesDirectory";
import BusinessProfilePublic from "./pages/BusinessProfilePublic";
import MapPage from "./pages/MapPage";
import Login from "./pages/Login";
import RegisterUser from "./pages/RegisterUser";
import RegisterBusiness from "./pages/RegisterBusiness";
import SeasonalSales from "./pages/SeasonalSales";
import NotFound from "./pages/NotFound";
import GroupDeals from "./pages/GroupDeals";
import GroupDealDetail from "./pages/GroupDealDetail";
import SmartMap from "./pages/SmartMap";

// User pages
import UserDashboard from "./pages/user/UserDashboard";
import MyLeads from "./pages/user/MyLeads";
import SavedInterests from "./pages/user/SavedInterests";
import Notifications from "./pages/user/Notifications";
import MyRequests from "./pages/user/MyRequests";
import RequestDetail from "./pages/user/RequestDetail";
import MyOffers from "./pages/user/MyOffers";
import UserChat from "./pages/user/UserChat";
import DealHunters from "./pages/user/DealHunters";
import Favorites from "./pages/user/Favorites";
import UserAIInsights from "./pages/user/UserAIInsights";

// Business pages
import BusinessDashboard from "./pages/business/BusinessDashboard";
import BusinessProfile from "./pages/business/BusinessProfile";
import ListingsManager from "./pages/business/ListingsManager";
import CreateListing from "./pages/business/CreateListing";
import EditListing from "./pages/business/EditListing";
import LeadsInbox from "./pages/business/LeadsInbox";
import Recommendations from "./pages/business/Recommendations";
import Reports from "./pages/business/Reports";
import AdsManager from "./pages/business/AdsManager";
import SubscriptionPage from "./pages/business/Subscription";
import BrowseRequests from "./pages/business/BrowseRequests";
import BusinessOffers from "./pages/business/BusinessOffers";
import BusinessChat from "./pages/business/BusinessChat";
import SaleCampaigns from "./pages/business/SaleCampaigns";
import AIAnalytics from "./pages/business/AIAnalytics";
import DemandRadar from "./pages/business/DemandRadar";
import FavoriteCustomers from "./pages/business/FavoriteCustomers";
import Automations from "./pages/business/Automations";
import BusinessGroupDeals from "./pages/business/BusinessGroupDeals";
import BusinessOpportunityMap from "./pages/business/BusinessOpportunityMap";
import B2BMarketplace from "./pages/business/B2BMarketplace";
import B2BMyRequests from "./pages/business/B2BMyRequests";
import B2BRequestDetail from "./pages/business/B2BRequestDetail";
import B2BMyOffers from "./pages/business/B2BMyOffers";
import B2BMyListings from "./pages/business/B2BMyListings";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminBusinesses from "./pages/admin/AdminBusinesses";
import AdminListings from "./pages/admin/AdminListings";
import AdminLeads from "./pages/admin/AdminLeads";
import AdminRequests from "./pages/admin/AdminRequests";
import AdminDirectory from "./pages/admin/AdminDirectory";
import AdminInvitations from "./pages/admin/AdminInvitations";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminB2B from "./pages/admin/AdminB2B";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/listing/:id" element={<ListingDetails />} />
                <Route path="/businesses" element={<BusinessesDirectory />} />
                <Route path="/businesses/:id" element={<BusinessProfilePublic />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/smart-map" element={<FeatureGatedRoute feature="enableOpportunityMap"><SmartMap /></FeatureGatedRoute>} />
                <Route path="/group-deals" element={<GroupDeals />} />
                <Route path="/group-deals/:id" element={<GroupDealDetail />} />
                <Route path="/seasonal-sales" element={<SeasonalSales />} />
                <Route path="/demo/ai-analytics" element={<FeatureGatedRoute feature="enableAIAnalytics"><AIAnalytics /></FeatureGatedRoute>} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterUser />} />
                <Route path="/register/business" element={<RegisterBusiness />} />
              </Route>

              {/* User dashboard */}
              <Route element={<ProtectedRoute allowedRoles={['user']}><DashboardLayout /></ProtectedRoute>}>
                <Route path="/user" element={<UserDashboard />} />
                <Route path="/user/leads" element={<MyLeads />} />
                <Route path="/user/interests" element={<SavedInterests />} />
                <Route path="/user/notifications" element={<Notifications />} />
                <Route path="/user/requests" element={<MyRequests />} />
                <Route path="/user/requests/:id" element={<RequestDetail />} />
                <Route path="/user/offers" element={<MyOffers />} />
                <Route path="/user/chat" element={<UserChat />} />
                <Route path="/user/deal-hunters" element={<DealHunters />} />
                <Route path="/user/favorites" element={<Favorites />} />
                <Route path="/user/ai-insights" element={<FeatureGatedRoute feature="enableAIInsights" redirectTo="/user"><UserAIInsights /></FeatureGatedRoute>} />
              </Route>


              {/* Business dashboard */}
              <Route element={<ProtectedRoute allowedRoles={['business']}><DashboardLayout /></ProtectedRoute>}>
                <Route path="/business" element={<BusinessDashboard />} />
                <Route path="/business/profile" element={<BusinessProfile />} />
                <Route path="/business/listings" element={<ListingsManager />} />
                <Route path="/business/listings/create" element={<CreateListing />} />
                <Route path="/business/listings/edit/:id" element={<EditListing />} />
                <Route path="/business/leads" element={<LeadsInbox />} />
                <Route path="/business/recommendations" element={<Recommendations />} />
                <Route path="/business/reports" element={<FeatureGatedRoute feature="enableAdvancedAnalytics" redirectTo="/business"><Reports /></FeatureGatedRoute>} />
                <Route path="/business/ads" element={<AdsManager />} />
                <Route path="/business/subscription" element={<SubscriptionPage />} />
                <Route path="/business/requests" element={<BrowseRequests />} />
                <Route path="/business/offers" element={<BusinessOffers />} />
                <Route path="/business/chat" element={<BusinessChat />} />
                <Route path="/business/sales" element={<SaleCampaigns />} />
                <Route path="/business/ai-analytics" element={<FeatureGatedRoute feature="enableAIAnalytics" redirectTo="/business"><AIAnalytics /></FeatureGatedRoute>} />
                <Route path="/business/favorite-customers" element={<FavoriteCustomers />} />
                <Route path="/business/demand-radar" element={<FeatureGatedRoute feature="enableDemandRadar" redirectTo="/business"><DemandRadar /></FeatureGatedRoute>} />
                <Route path="/business/group-deals" element={<BusinessGroupDeals />} />
                <Route path="/business/opportunity-map" element={<FeatureGatedRoute feature="enableOpportunityMap" redirectTo="/business"><BusinessOpportunityMap /></FeatureGatedRoute>} />
                <Route path="/business/automations" element={<FeatureGatedRoute feature="enableAutomations" redirectTo="/business"><Automations /></FeatureGatedRoute>} />

                <Route path="/business/b2b" element={<B2BMarketplace />} />
                <Route path="/business/b2b/my-requests" element={<B2BMyRequests />} />
                <Route path="/business/b2b/request/:id" element={<B2BRequestDetail />} />
                <Route path="/business/b2b/my-offers" element={<B2BMyOffers />} />
                <Route path="/business/b2b/my-listings" element={<B2BMyListings />} />
              </Route>

              {/* Admin dashboard */}
              <Route element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout /></ProtectedRoute>}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/businesses" element={<AdminBusinesses />} />
                <Route path="/admin/listings" element={<AdminListings />} />
                <Route path="/admin/leads" element={<AdminLeads />} />
                <Route path="/admin/requests" element={<AdminRequests />} />
                <Route path="/admin/directory" element={<AdminDirectory />} />
                <Route path="/admin/invitations" element={<AdminInvitations />} />
                <Route path="/admin/payments" element={<AdminPayments />} />
                <Route path="/admin/b2b" element={<AdminB2B />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
