/**
 * Feature Flags Configuration
 * 
 * This file centralizes all feature gating logic for the MarketMate application.
 * Deactivating features here will hide them from all UI entry points and gate their routes.
 */

export const FEATURE_FLAGS = {
  // AI-powered features
  enableAIInsights: false,
  enableAIAnalytics: false,
  
  // Market intelligence tools
  enableDemandRadar: false,
  enableOpportunityMap: false,
  
  // Advanced statistics and charts
  enableAdvancedAnalytics: false,
  enableComplexDashboards: false,
  
  // Business automation tools
  enableAutomations: false,
  
  // Subscription-based groups/experimental
  enableAdvancedB2B: false,
  enableEliteBusinessTools: false,
};

/**
 * Helper to check if a feature is enabled.
 * Can be expanded later to support environment-based or user-specific gating.
 */
export const isFeatureEnabled = (feature: keyof typeof FEATURE_FLAGS): boolean => {
  return FEATURE_FLAGS[feature];
};
