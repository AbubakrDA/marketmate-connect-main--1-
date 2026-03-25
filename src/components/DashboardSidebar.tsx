import { useState, useEffect } from 'react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/i18n';
import { useLocation } from 'react-router-dom';
import { getUnreadCount } from '@/data/mock';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard, User, List, PlusCircle, Inbox, Lightbulb, BarChart3, Package,
  Megaphone, CreditCard, Bell, Heart, Users, Building2, FileText, TrendingUp,
  MessageSquare, Send, Search, ShoppingBag, Tag, Brain, Star, Radar, BookOpen, Mail, Zap, DollarSign, Factory,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const DashboardSidebar = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const update = () => setUnread(getUnreadCount(user?.id || ''));
    update();
    const interval = setInterval(update, 3000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const chatUrl = user?.role === 'business' ? '/business/chat' : '/user/chat';

  const userItems = [
    { title: t('dashboard'), url: '/user', icon: LayoutDashboard },
    { title: t('my_requests'), url: '/user/requests', icon: FileText },
    { title: t('my_offers'), url: '/user/offers', icon: Send },
    { title: t('messages'), url: '/user/chat', icon: MessageSquare, badge: unread },
    { title: t('my_leads'), url: '/user/leads', icon: Inbox },
    { title: t('deal_hunters'), url: '/user/deal-hunters', icon: Search },
    { title: t('favorites'), url: '/user/favorites', icon: Heart },
    { title: t('market_insights'), url: '/user/ai-insights', icon: Brain },
    { title: t('saved_interests'), url: '/user/interests', icon: Star },
    { title: t('notifications'), url: '/user/notifications', icon: Bell },
  ];

  const businessItems = [
    { title: t('dashboard'), url: '/business', icon: LayoutDashboard },
    { title: t('profile'), url: '/business/profile', icon: User },
    { title: t('buyer_requests'), url: '/business/requests', icon: ShoppingBag },
    { title: t('my_offers'), url: '/business/offers', icon: Send },
    { title: t('messages'), url: '/business/chat', icon: MessageSquare, badge: unread },
    { title: t('listings'), url: '/business/listings', icon: List },
    { title: t('create_listing'), url: '/business/listings/create', icon: PlusCircle },
    { title: t('leads'), url: '/business/leads', icon: Inbox },
    { title: t('sale_campaigns'), url: '/business/sales', icon: Tag },
    { title: t('demand_radar'), url: '/business/demand-radar', icon: Radar },
    { title: t('group_deals'), url: '/business/group-deals', icon: Users },
    { title: t('opportunity_map'), url: '/business/opportunity-map', icon: BookOpen },
    { title: t('ai_analytics'), url: '/business/ai-analytics', icon: Brain },
    { title: t('favorite_customers'), url: '/business/favorite-customers', icon: Star },
    { title: t('recommendations'), url: '/business/recommendations', icon: Lightbulb },
    { title: t('reports'), url: '/business/reports', icon: BarChart3 },
    { title: t('ads'), url: '/business/ads', icon: Megaphone },
    { title: t('subscription'), url: '/business/subscription', icon: CreditCard },
    { title: t('automations'), url: '/business/automations', icon: Zap },
    { title: t('b2b_marketplace'), url: '/business/b2b', icon: Factory },
    { title: t('b2b_my_requests'), url: '/business/b2b/my-requests', icon: ShoppingBag },
    { title: t('b2b_my_offers'), url: '/business/b2b/my-offers', icon: Send },
    { title: t('b2b_my_listings'), url: '/business/b2b/my-listings', icon: Package },
  ];

  const adminItems = [
    { title: t('dashboard'), url: '/admin', icon: LayoutDashboard },
    { title: t('users'), url: '/admin/users', icon: Users },
    { title: t('businesses'), url: '/admin/businesses', icon: Building2 },
    { title: t('listings'), url: '/admin/listings', icon: FileText },
    { title: t('leads'), url: '/admin/leads', icon: TrendingUp },
    { title: t('requests_offers'), url: '/admin/requests', icon: ShoppingBag },
    { title: t('business_directory'), url: '/admin/directory', icon: BookOpen },
    { title: t('invitation_campaigns'), url: '/admin/invitations', icon: Mail },
    { title: t('payments_subscriptions'), url: '/admin/payments', icon: DollarSign },
    { title: t('b2b_admin'), url: '/admin/b2b', icon: Factory },
  ];

  const items = user?.role === 'admin' ? adminItems : user?.role === 'business' ? businessItems : userItems;
  const label = user?.role === 'admin' ? t('admin_panel') : user?.role === 'business' ? t('business_dashboard') : t('my_account');

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{!collapsed && label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className="hover:bg-muted/50" activeClassName="bg-muted text-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && (
                        <span className="flex flex-1 items-center justify-between">
                          <span>{item.title}</span>
                          {'badge' in item && (item as any).badge > 0 && (
                            <Badge className="bg-coral text-coral-foreground text-[10px] px-1.5 py-0 min-w-[18px] h-[18px] flex items-center justify-center">
                              {(item as any).badge}
                            </Badge>
                          )}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
