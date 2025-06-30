// ShopSphere Company Configuration
// This file contains the comprehensive company description and context
// that is shared across all agents and document review processes

export const shopSphereCompany = {
  name: "ShopSphere",
  industry: "E-commerce Marketplace",
  size: "350 employees",
  valuation: "$2B",
  mission: "Making online shopping seamless and delightful for everyone",
  culture: "fast-paced, data-driven, customer-obsessed",
  
  // Comprehensive company description
  description: `## ShopSphere

### Company Overview

**ShopSphere** is a mid-sized e-commerce marketplace valued at $2B with 350 employees.

**Mission:** "Making online shopping seamless and delightful for everyone"

**Culture:** Fast-paced, data-driven, customer-obsessed

### Business Model & Revenue

- **Primary Revenue:** Commission fees (8-15% per transaction)
- **Secondary Revenue:** Seller subscriptions, advertising, enterprise solutions
- **Market Position:** 3rd largest independent marketplace (after Amazon/eBay)
- **Focus:** Mid-market and artisan sellers

### Key Metrics (2024)

- **GMV:** $3.2 billion
- **Revenue:** $445 million
- **Active Buyers:** 15.2 million
- **Active Sellers:** 125,000
- **Average Order Value:** $67
- **Repeat Purchase Rate:** 78% (within 90 days)
- **App Rating:** 4.8 stars

### Technology Stack

- **SphereMatch AI:** Proprietary recommendation engine (94% accuracy)
- **Core Capabilities:** Real-time fraud detection, advanced search, mobile-first PWA
- **Innovation Focus:** AR try-on, sustainability features

### Organization Structure

- **Engineering & Product:** 140 employees (40% of company)
- **Product Development:** Bi-weekly sprints, quarterly OKRs
- **Decision Making:** A/B testing required for all features
- **Customer Focus:** Monthly feedback sessions, NPS tracking

### Operational Context

- **Markets:** North America and 12 European countries
- **Competition:** Amazon, eBay, plus regional players`,
  
  // Key business metrics for quick reference
  metrics: {
    gmv: "$3.2 billion",
    revenue: "$445 million",
    activeBuyers: "15.2 million",
    activeSellers: "125,000",
    averageOrderValue: "$67",
    repeatPurchaseRate: "78%",
    appRating: "4.8 stars"
  },
  
  // Technology and innovation focus
  technology: {
    sphereMatchAI: "Proprietary recommendation engine (94% accuracy)",
    coreCapabilities: ["Real-time fraud detection", "Advanced search", "Mobile-first PWA"],
    innovationFocus: ["AR try-on", "Sustainability features"]
  },
  
  // Operational details
  operations: {
    markets: ["North America", "12 European countries"],
    competition: ["Amazon", "eBay", "Regional players"],
    developmentProcess: "Bi-weekly sprints, quarterly OKRs",
    decisionMaking: "A/B testing required for all features"
  }
};

// Helper function to get company context for prompts
export const getCompanyContext = () => {
  return shopSphereCompany.description;
};

// Helper function to get company context for document reviews
export const getCompanyContextForReviews = () => {
  return `You work at ShopSphere, a mid-sized e-commerce marketplace valued at $2B with 350 employees. Our mission is "Making online shopping seamless and delightful for everyone" and we operate in a fast-paced, data-driven, customer-obsessed culture.

Key Business Metrics (2024):
- GMV: $3.2 billion
- Revenue: $445 million  
- Active Buyers: 15.2 million
- Active Sellers: 125,000
- Average Order Value: $67
- Repeat Purchase Rate: 78% (within 90 days)
- App Rating: 4.8 stars

Technology & Innovation:
- SphereMatch AI: Proprietary recommendation engine (94% accuracy)
- Core Capabilities: Real-time fraud detection, advanced search, mobile-first PWA
- Innovation Focus: AR try-on, sustainability features

Organization & Operations:
- Engineering & Product: 140 employees (40% of company)
- Product Development: Bi-weekly sprints, quarterly OKRs
- Decision Making: A/B testing required for all features
- Markets: North America and 12 European countries
- Competition: Amazon, eBay, plus regional players`;
}; 