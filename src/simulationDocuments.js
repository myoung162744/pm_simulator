// Simulation Documents - Realistic content for the mobile checkout optimization project

export const simulationDocuments = {
  'sarah-chen': {
    id: 'mobile-analytics-report',
    title: 'Mobile Analytics Report Q4',
    content: `# Mobile Analytics Report Q4 2024
**Prepared by:** Sarah Chen, VP of Product  
**Date:** January 15, 2025  
**Classification:** Internal Use

## Executive Summary
Our mobile checkout experience is significantly underperforming compared to desktop, with a 78% abandonment rate versus 65% on desktop. This 13-point gap represents approximately $2.4M in monthly lost revenue.

## Key Metrics

### Checkout Funnel Performance
- **Mobile Abandonment Rate:** 78%
- **Desktop Abandonment Rate:** 65%
- **Revenue Impact:** $2.4M monthly loss
- **Conversion Gap:** 13 percentage points

### Device Breakdown
- **iOS Users:** 60% of mobile traffic
- **Android Users:** 40% of mobile traffic
- **iOS Conversion:** 24% (slightly better)
- **Android Conversion:** 20% (worse performance)

### Cart Value Analysis
- **Mobile Average Cart:** $67
- **Desktop Average Cart:** $95
- **Mobile vs Desktop Gap:** 29% lower on mobile

### User Behavior Patterns
- **Guest Checkout:** 60% of mobile purchases
- **Registered Users:** 40% of mobile purchases
- **Guest Conversion:** 25% (better than registered)
- **Registered Conversion:** 20% (worse due to friction)

## Drop-off Points

### Primary Abandonment Points
1. **Shipping Address Entry:** 45% drop-off
   - Form complexity and mobile keyboard issues
   - Address validation errors
   - International format confusion

2. **Payment Information:** 30% drop-off
   - Payment form friction
   - Security concerns on mobile
   - Lack of digital wallet options

3. **Order Review:** 15% drop-off
   - Inability to edit previous steps
   - Unexpected costs (shipping, tax)
   - Performance issues

### Secondary Issues
- **Page Load Times:** 3.2s average (target: <2s)
- **Form Errors:** 35% of users encounter validation errors
- **Back Button Issues:** 40% of users can't successfully navigate back

## Competitive Analysis Preview
- **Amazon Mobile:** 55% completion rate
- **Target Mobile:** 48% completion rate
- **Industry Average:** 45-50% completion rate
- **Our Performance:** 22% completion rate

## Recommendations
1. **Immediate Actions (Week 1-2)**
   - Fix payment SDK crashes
   - Implement basic form improvements
   - Add progress indicators

2. **Short-term Improvements (Week 3-8)**
   - Add Apple Pay and Google Pay
   - Optimize address entry flow
   - Implement smart defaults

3. **Long-term Vision (Q2-Q3)**
   - One-click checkout for returning users
   - AI-powered address suggestions
   - Biometric authentication

## Next Steps
- **Proposal Due:** Friday, January 24th
- **Leadership Presentation:** Monday, January 27th
- **Implementation Start:** February 1st (target)

*This report should be shared with the mobile optimization team for detailed analysis and solution development.*`
  },

  'mike-dev': {
    id: 'technical-architecture-overview',
    title: 'Technical Architecture Overview',
    content: `# Mobile Checkout Technical Architecture Analysis
**Prepared by:** Alex Rodriguez, Senior Mobile Tech Lead  
**Date:** January 16, 2025  
**Classification:** Technical Team Internal

## Current State Assessment

### Mobile App Architecture
- **Platform:** React Native 0.68 (current is 0.72)
- **Payment SDK:** Stripe SDK v19.0 (latest available is v21.2)
- **State Management:** Redux with persistence
- **API Layer:** REST with custom middleware

### Observations from Technical Review

- The mobile checkout flow involves 8 API calls per transaction, while desktop uses 4. This increases network activity, but no single call stands out as a clear bottleneck.
- Average API call times are about 800ms on mobile networks, which is within a typical range, though some variability is expected depending on user connection.
- There are some compatibility considerations with the payment system and a few reports of address validation timeouts (about 15% of cases), but these issues appear to be distributed rather than concentrated on a single root cause.
- The React Native app is a couple of versions behind the latest, but nothing in the current codebase suggests a critical blocker related to this.

### General Technical Notes

- No single technical factor appears to be solely responsible for the high abandonment rate. Instead, a combination of minor technical frictions may be contributing.
- Engineering will continue to monitor and investigate, and is prepared to propose technical improvements as needed.
- If you notice any specific user pain points or patterns from the product side, let us know so we can dig deeper into those areas.

*These findings are intended to provide context for your product analysis. Let us know if you need a deeper dive into any particular area.*`
  },

  'lisa-design': {
    id: 'user-research-summary',
    title: 'User Research Summary',
    content: `# Mobile Checkout User Research Summary
**Prepared by:** Maya Patel, Senior UX Designer  
**Date:** January 14, 2025  
**Research Period:** December 2024  
**Participants:** 20 users (12 iOS, 8 Android)

## Research Methodology

### Study Design
- **Method:** Moderated usability testing + interviews
- **Duration:** 45 minutes per session
- **Task:** Complete a mobile checkout flow
- **Environment:** Natural mobile usage (participants' own devices)

### Participant Demographics
- **Age Range:** 24-55 years
- **Mobile Usage:** Heavy users (4+ hours daily)
- **Shopping Frequency:** Weekly to monthly online shoppers
- **Device Split:** 60% iOS, 40% Android (matches our traffic)

## Key Findings

### Primary Pain Points

#### 1. Form Filling Frustration
> *"I always switch to my laptop for checkout. The forms are just too painful on mobile."*  
> — Sarah, 32, iOS user

**Issues Identified:**
- Touch targets too small (current: 36pt, need: 44pt minimum)
- Keyboard constantly covering form fields
- No smart autofill integration
- Validation errors appear after form submission

#### 2. Trust and Security Concerns
> *"I don't feel safe entering my credit card on mobile. The page looks different than desktop."*  
> — Michael, 45, Android user

**Issues Identified:**
- Missing security badges and trust signals
- Different visual design from desktop creates confusion
- No biometric authentication options
- Payment form looks "less professional" on mobile

#### 3. Navigation and Progress Issues
> *"I have no idea how many steps are left. Am I almost done or just getting started?"*  
> — Jennifer, 28, iOS user

**Issues Identified:**
- No progress indicator
- Can't go back to edit previous steps
- Unclear what information is still needed
- No save/resume functionality

### User Behavior Patterns

#### Abandonment Triggers
1. **Keyboard Issues (40% of abandonments)**
   - Keyboard covers submit button
   - Auto-correct changes address information
   - Numeric keypad doesn't appear for zip codes

2. **Performance Issues (35% of abandonments)**
   - Page takes >3 seconds to load
   - Form submission appears to hang
   - App crashes during payment entry

3. **Form Complexity (25% of abandonments)**
   - Too many required fields
   - Confusing field labels
   - International address format issues

### Successful Completion Factors

#### What Works Well
- **Guest Checkout:** Users often prefer not creating accounts
- **Auto-detected Location:** When shipping address pre-fills
- **Clear Pricing:** Upfront shipping and tax display
- **Simple Payment:** When only card number is required

#### User Preferences
- **Digital Wallets:** Many users express interest in Apple Pay/Google Pay
- **Address Autocomplete:** Most users want smart address suggestions
- **Biometric Auth:** Many users would consider Touch ID/Face ID for payments
- **Progress Indicators:** Most users want to know checkout progress

## Detailed User Quotes

### On Mobile vs Desktop Experience
> *"On desktop, I feel in control. On mobile, I feel like I'm fighting the interface."*  
> — David, 38, Android user

> *"The mobile checkout feels like an afterthought. Like they just shrunk the desktop version."*  
> — Lisa, 29, iOS user

### On Payment Security
> *"I wish I could just use my fingerprint to pay. That would feel more secure than typing my card number."*  
> — Amanda, 34, iOS user

> *"The payment page doesn't look like the rest of the app. Makes me wonder if it's legitimate."*  
> — Robert, 42, Android user

### On Form Design
> *"Why do I need to enter my email three times? Once should be enough."*  
> — Maria, 26, iOS user

> *"The address form is a nightmare. It never accepts my apartment number format."*  
> — Kevin, 31, Android user

## Competitive Analysis Insights

### What Users Love About Competitors

#### Amazon Mobile
- One-click purchasing for returning customers
- Clear progress indicators
- Excellent address autocomplete
- Multiple payment options

#### Target Mobile
- Clean, simple form design
- Good use of white space
- Clear error messaging
- Fast loading times

#### Features Users Mention Positively
- Apple Pay/Google Pay integration
- Smart address autocomplete
- Biometric authentication options
- One-click reorder functionality
- Streamlined guest checkout

## Design Considerations

### Areas for Exploration
- Touch target sizes and accessibility standards
- Progress indication and user orientation
- Error messaging and validation timing
- Keyboard handling and input optimization
- Payment method preferences and security perceptions
- Address entry and validation experiences

### User Preferences to Consider
- Digital wallet adoption and usage patterns
- Address autocomplete expectations
- Trust signal importance and placement
- Smart defaults and personalization preferences
- Biometric authentication comfort levels
- One-click purchasing preferences

## Research Insights Summary
- Users express frustration with form complexity and mobile-specific challenges
- Trust and security concerns vary by user segment
- Navigation and progress clarity are important across all personas
- Performance expectations differ between mobile and desktop experiences

*This research provides context for understanding user needs and preferences. The findings can help inform product decisions and design explorations.*`
  },

  'alex-data': {
    id: 'competitive-benchmark-analysis',
    title: 'Competitive Benchmark Analysis',
    content: `# Mobile Checkout Competitive Benchmark Analysis
**Prepared by:** Jordan Kim, Senior Data Analyst  
**Date:** January 13, 2025  
**Analysis Period:** Q4 2024  
**Methodology:** Mystery shopping + public data analysis

## Executive Summary

Our mobile checkout completion rate of 22% significantly lags behind industry leaders. Amazon leads at 55%, followed by Target at 48%. The average e-commerce mobile completion rate is 45-50%, making us 23-28 percentage points behind the industry standard.

## Competitive Landscape

### Direct Competitors

#### Amazon Mobile Checkout
- **Completion Rate:** 55%
- **Average Time:** 1.2 minutes
- **Key Features:**
  - One-Click purchasing
  - Biometric authentication (Touch ID/Face ID)
  - Smart address suggestions
  - Multiple payment methods
  - Guest checkout optimization

#### Target Mobile Checkout  
- **Completion Rate:** 48%
- **Average Time:** 1.8 minutes
- **Key Features:**
  - Apple Pay/Google Pay integration
  - Clean, minimal design
  - Progressive form filling
  - Real-time inventory updates
  - Store pickup options

#### Walmart Mobile Checkout
- **Completion Rate:** 42%
- **Average Time:** 2.1 minutes
- **Key Features:**
  - Walmart Pay integration
  - Scan & Go functionality
  - Pickup and delivery options
  - Pharmacy integration
  - Grocery-specific optimizations

### Industry Leaders (Cross-category)

#### Shopify Plus Merchants (Average)
- **Completion Rate:** 46%
- **Best Practices:**
  - Accelerated checkout options
  - Dynamic checkout buttons
  - Express payment methods
  - Mobile-first design approach

#### Best-in-Class Features Analysis

### Payment Methods
| Company | Credit Card | Apple Pay | Google Pay | PayPal | Buy Now Pay Later |
|---------|-------------|-----------|------------|--------|-------------------|
| Amazon | ✅ | ✅ | ✅ | ✅ | ✅ (Affirm) |
| Target | ✅ | ✅ | ✅ | ✅ | ✅ (Sezzle) |
| Walmart | ✅ | ✅ | ✅ | ✅ | ✅ (Affirm) |
| **ShopSphere** | ✅ | ❌ | ❌ | ✅ | ❌ |

### Mobile UX Features
| Feature | Amazon | Target | Walmart | ShopSphere |
|---------|--------|--------|---------|------------|
| One-click checkout | ✅ | ❌ | ❌ | ❌ |
| Biometric auth | ✅ | ✅ | ✅ | ❌ |
| Address autocomplete | ✅ | ✅ | ✅ | ❌ |
| Progress indicator | ✅ | ✅ | ✅ | ❌ |
| Guest checkout | ✅ | ✅ | ✅ | ✅ |
| Edit previous steps | ✅ | ✅ | ❌ | ❌ |

## Performance Benchmarking

### Load Time Analysis
- **Amazon:** 1.1 seconds average
- **Target:** 1.4 seconds average  
- **Walmart:** 1.8 seconds average
- **Industry Average:** 1.6 seconds
- **ShopSphere:** 3.2 seconds (100% slower than average)

### Form Completion Metrics
| Metric | Amazon | Target | Walmart | Industry Avg | ShopSphere |
|--------|--------|--------|---------|--------------|------------|
| Fields to complete | 3-4 | 5-6 | 6-7 | 5-6 | 8-9 |
| Auto-fill success | 85% | 70% | 65% | 70% | 45% |
| Error rate | 5% | 8% | 12% | 8% | 35% |
| Time to complete | 72s | 108s | 126s | 102s | 252s |

### Mobile-Specific Optimizations

#### Touch Target Sizing
- **Amazon:** 48pt minimum (exceeds Apple guidelines)
- **Target:** 44pt minimum (meets Apple guidelines)  
- **Walmart:** 42pt average (slightly below optimal)
- **ShopSphere:** 36pt average (below recommended)

#### Keyboard Optimization
- **Amazon:** Smart input types, proper viewport handling
- **Target:** Good input types, some viewport issues
- **Walmart:** Basic input types, frequent keyboard issues
- **ShopSphere:** Poor input types, major viewport problems

## Revenue Impact Analysis

### Conversion Rate Improvement Potential
If we matched competitor performance:
- **Match Target (48%):** +26 percentage points = +$3.1M monthly
- **Match Amazon (55%):** +33 percentage points = +$3.9M monthly
- **Match Industry Average (47%):** +25 percentage points = +$3.0M monthly

### Feature-Specific Impact Estimates
Based on A/B tests from industry reports:

#### Digital Wallet Integration
- **Apple Pay:** +8-12% conversion improvement
- **Google Pay:** +6-10% conversion improvement
- **Combined Impact:** +15-20% total improvement
- **Revenue Impact:** +$1.8-2.4M monthly

#### Address Autocomplete
- **Conversion Improvement:** +5-8%
- **Time Savings:** 30-45 seconds average
- **Revenue Impact:** +$600K-960K monthly

#### One-Click Checkout
- **Conversion Improvement:** +12-18% (returning customers)
- **Applies to:** ~40% of our customer base
- **Revenue Impact:** +$1.2-1.8M monthly

## Implementation Priority Matrix

### High Impact, Low Effort
1. **Apple Pay/Google Pay Integration**
   - Implementation: 2-3 weeks
   - Expected lift: +15-20%
   - ROI: 300-400%

2. **Progress Indicators**
   - Implementation: 1 week
   - Expected lift: +3-5%
   - ROI: 500%+

### High Impact, Medium Effort  
1. **Address Autocomplete**
   - Implementation: 3-4 weeks
   - Expected lift: +5-8%
   - ROI: 200-300%

2. **Form Optimization**
   - Implementation: 2-3 weeks
   - Expected lift: +8-12%
   - ROI: 250-350%

### High Impact, High Effort
1. **One-Click Checkout**
   - Implementation: 6-8 weeks
   - Expected lift: +12-18%
   - ROI: 150-200%

2. **Biometric Authentication**
   - Implementation: 4-6 weeks
   - Expected lift: +6-10%
   - ROI: 100-150%

## Competitive Intelligence

### Recent Competitor Updates

#### Amazon (Q4 2024)
- Launched "Buy with Prime" for third-party sites
- Enhanced voice ordering through Alexa
- Improved international checkout flows

#### Target (Q4 2024)
- Rolled out same-day delivery optimization
- Enhanced Drive Up mobile experience
- Improved Circle rewards integration

#### Emerging Trends
1. **Social Commerce Integration:** TikTok Shop, Instagram Shopping
2. **AR/VR Try-Before-Buy:** Virtual fitting rooms
3. **Cryptocurrency Payments:** Bitcoin, stablecoins
4. **Sustainability Tracking:** Carbon footprint display

## Recommendations

### Immediate Actions (Weeks 1-4)
1. **Digital Wallet Integration:** Apple Pay and Google Pay
2. **Performance Optimization:** Reduce load times to <2 seconds
3. **Form Improvements:** Larger touch targets, better validation

### Medium-term Goals (Weeks 5-12)
1. **Address Autocomplete:** Google Places API integration
2. **One-Click Checkout:** For returning customers
3. **Biometric Authentication:** Touch ID/Face ID support

### Long-term Vision (Q2-Q3)
1. **AI-Powered Personalization:** Smart product recommendations
2. **Voice Commerce:** Voice-activated checkout
3. **Augmented Reality:** Virtual try-on experiences

## Success Metrics
- **Primary:** Mobile conversion rate from 22% to 45%+ (industry average)
- **Secondary:** Average checkout time from 4.2 minutes to <2 minutes
- **Tertiary:** Customer satisfaction score from 2.1/5 to 4.0/5

*This analysis should guide feature prioritization and investment decisions for the mobile optimization project.*`
  }
};

export default simulationDocuments; 