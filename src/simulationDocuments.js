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
- **Platform:** React Native 0.68 (2 versions behind current)
- **Payment SDK:** Stripe SDK v19.0 (current is v21.2)
- **State Management:** Redux with persistence
- **API Layer:** REST with custom middleware

### Performance Issues

#### API Call Overhead
- **Mobile Checkout:** 8 API calls per transaction
- **Desktop Checkout:** 4 API calls per transaction
- **Average Call Time:** 800ms on mobile networks
- **Total Overhead:** 6.4s additional load time

#### Current API Call Sequence
1. User validation (200ms)
2. Cart validation (300ms)
3. Shipping options fetch (500ms)
4. Tax calculation (400ms)
5. Payment method validation (600ms)
6. Address validation (800ms)
7. Final order validation (300ms)
8. Order submission (400ms)

### Critical Technical Debt

#### Payment SDK Issues
- **Crash Rate:** 30% of payment attempts on older devices
- **iOS Compatibility:** Issues with iOS 16+ security features
- **Android Performance:** 40% slower on Android 12+
- **Security Vulnerabilities:** 3 medium-risk issues identified

#### Address Validation Problems
- **Timeout Rate:** 15% of address validations timeout
- **International Support:** Poor handling of non-US formats
- **Autocomplete:** No integration with platform address APIs
- **Validation Errors:** Inconsistent error messaging

## Proposed Technical Solutions

### Phase 1: Critical Fixes (Weeks 1-2)
1. **Payment SDK Upgrade**
   - Upgrade to Stripe SDK v21.2
   - Estimated effort: 3-4 days
   - Risk: Medium (requires security review)
   - Impact: 70% reduction in payment crashes

2. **API Call Optimization**
   - Implement request batching
   - Reduce calls from 8 to 3
   - Estimated effort: 1 week
   - Impact: 3.2s faster checkout

### Phase 2: Performance Improvements (Weeks 3-6)
1. **Address Autocomplete**
   - Integrate Google Places API
   - Add platform-native address pickers
   - Estimated effort: 1.5 weeks
   - Impact: 60% faster address entry

2. **Digital Wallet Integration**
   - Apple Pay implementation: 3 days
   - Google Pay implementation: 4 days
   - Testing and certification: 1 week
   - Impact: 40% faster payment for supported users

### Phase 3: Advanced Features (Weeks 7-10)
1. **Smart Caching**
   - Implement intelligent prefetching
   - Cache user preferences and addresses
   - Estimated effort: 2 weeks

2. **Biometric Authentication**
   - Touch ID / Face ID integration
   - Fingerprint authentication for Android
   - Estimated effort: 1.5 weeks

## Implementation Risks

### High Risk
- **Payment SDK Migration:** Potential for payment failures during transition
- **API Changes:** Risk of breaking existing integrations
- **Security Review:** May delay timeline by 5-7 days

### Medium Risk
- **Cross-platform Compatibility:** Different behavior on iOS vs Android
- **Third-party Dependencies:** Google Places API rate limits
- **Performance Regression:** Risk of introducing new bottlenecks

### Mitigation Strategies
1. **Phased Rollout:** Deploy to 10% of users initially
2. **Feature Flags:** Ability to quickly disable new features
3. **Monitoring:** Enhanced error tracking and performance monitoring
4. **Rollback Plan:** Ability to revert within 30 minutes

## Resource Requirements

### Development Team
- **Mobile Engineers:** 2 full-time (Alex + 1 additional)
- **Backend Engineer:** 1 part-time for API optimization
- **QA Engineer:** 1 full-time for testing
- **DevOps Support:** 0.5 FTE for deployment

### Timeline Estimate
- **Phase 1:** 2 weeks
- **Phase 2:** 4 weeks  
- **Phase 3:** 3 weeks
- **Total:** 9 weeks (with 1 week buffer)

## Success Metrics
- **Crash Rate:** Reduce from 30% to <5%
- **Load Time:** Reduce from 6.4s to <3s
- **API Calls:** Reduce from 8 to 3
- **Payment Success:** Increase from 70% to >90%

*This analysis should be reviewed with the product team to align on priorities and timeline.*`
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
- **Guest Checkout:** Users prefer not creating accounts
- **Auto-detected Location:** When shipping address pre-fills
- **Clear Pricing:** Upfront shipping and tax display
- **Simple Payment:** When only card number is required

#### User Preferences
- **Digital Wallets:** 85% would use Apple Pay/Google Pay if available
- **Address Autocomplete:** 90% want smart address suggestions
- **Biometric Auth:** 75% would use Touch ID/Face ID for payments
- **Progress Indicators:** 95% want to know checkout progress

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

#### Best-in-Class Features Users Want
1. **Apple Pay/Google Pay Integration**
2. **Smart Address Autocomplete**
3. **Biometric Authentication**
4. **One-click Reorder**
5. **Guest Checkout Optimization**

## Design Recommendations

### Immediate Improvements (Week 1-2)
1. **Increase Touch Targets:** Minimum 44pt for all interactive elements
2. **Add Progress Indicator:** Show "Step X of Y" throughout flow
3. **Improve Error Messaging:** Inline validation with clear instructions
4. **Fix Keyboard Issues:** Proper input types and viewport handling

### Short-term Enhancements (Week 3-8)
1. **Digital Wallet Integration:** Apple Pay and Google Pay buttons
2. **Address Autocomplete:** Google Places API integration
3. **Visual Trust Signals:** Security badges and SSL indicators
4. **Smart Defaults:** Remember user preferences

### Long-term Vision (Q2-Q3)
1. **Biometric Authentication:** Touch ID/Face ID for payments
2. **One-click Checkout:** For returning customers
3. **AI-powered Suggestions:** Smart address and payment suggestions
4. **Progressive Web App:** Better mobile performance

## Success Metrics to Track
- **Task Completion Rate:** Currently 22%, target 50%+
- **Time to Complete:** Currently 4.2 minutes, target <2 minutes
- **Error Rate:** Currently 35%, target <10%
- **User Satisfaction:** Currently 2.1/5, target 4.0/5

## Next Steps
1. **Prototype Testing:** Create high-fidelity prototypes for key improvements
2. **A/B Testing Plan:** Design experiments for each major change
3. **Accessibility Audit:** Ensure compliance with WCAG 2.1 AA standards
4. **Cross-platform Testing:** Validate designs on various devices and OS versions

*This research should inform the product roadmap and technical implementation priorities.*`
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
  },

  'jen-marketing': {
    id: 'customer-support-tickets-export',
    title: 'Customer Support Tickets Export',
    content: `# Customer Support Tickets Analysis - Mobile Checkout Issues
**Prepared by:** Priya Sharma, Customer Success Manager  
**Date:** January 12, 2025  
**Analysis Period:** Q4 2024 (October - December)  
**Total Mobile Checkout Tickets:** 2,346

## Executive Summary

Mobile checkout issues represent 34% of all customer support tickets, with "Can't edit shipping address" being the top complaint (847 tickets). Payment-related issues account for 623 tickets, while requests for digital wallet options (Apple Pay/Google Pay) total 492 tickets.

## Top Issue Categories

### 1. Address Management Issues (847 tickets - 36%)

#### Primary Complaints:
- **Can't edit shipping address after proceeding:** 312 tickets
- **Address validation errors:** 198 tickets  
- **International address format problems:** 156 tickets
- **Apartment/unit number field issues:** 124 tickets
- **Address autocomplete not working:** 57 tickets

#### Representative Customer Quotes:

> *"I entered the wrong apartment number and now I can't go back to fix it. I have to start the whole checkout over again. This is so frustrating!"*  
> — Ticket #CH-2024-8847, iOS user

> *"Your system keeps saying my address is invalid but I've lived here for 5 years. It works fine on every other website."*  
> — Ticket #CH-2024-9234, Android user

> *"I'm trying to ship to Canada and your address form assumes I'm in the US. The postal code field won't accept Canadian format."*  
> — Ticket #CH-2024-9876, iOS user

### 2. Payment Processing Issues (623 tickets - 27%)

#### Primary Complaints:
- **Payment screen freezes/crashes:** 234 tickets
- **Credit card form not accepting valid cards:** 167 tickets
- **Payment processing timeouts:** 122 tickets
- **Security code field issues:** 78 tickets
- **Saved payment methods not working:** 22 tickets

#### Representative Customer Quotes:

> *"Every time I try to enter my credit card, the app crashes. I've tried 5 times and given up. Ordering on my laptop instead."*  
> — Ticket #CH-2024-7654, Android user

> *"The payment page just spins forever. I don't know if my order went through or not. Very concerning when money is involved."*  
> — Ticket #CH-2024-8123, iOS user

> *"Your form says my Visa card is invalid but I just used it at Target with no problems. Something is wrong with your validation."*  
> — Ticket #CH-2024-8456, Android user

### 3. Digital Wallet Requests (492 tickets - 21%)

#### Primary Requests:
- **Apple Pay support:** 287 tickets
- **Google Pay support:** 156 tickets
- **PayPal mobile optimization:** 34 tickets
- **Samsung Pay support:** 15 tickets

#### Representative Customer Quotes:

> *"Why don't you have Apple Pay? Every other store I shop at has it. It's 2025!"*  
> — Ticket #CH-2024-9012, iOS user

> *"I don't feel comfortable typing my credit card number on mobile. Can you add Google Pay so I can use my fingerprint?"*  
> — Ticket #CH-2024-8789, Android user

> *"Apple Pay would make checkout so much faster. I almost always abandon my cart because typing payment info on mobile is such a pain."*  
> — Ticket #CH-2024-9345, iOS user

### 4. Form Design and Usability (384 tickets - 16%)

#### Primary Complaints:
- **Address format confusing:** 156 tickets
- **Required fields not clearly marked:** 89 tickets
- **Form fields too small on mobile:** 67 tickets
- **Keyboard covering submit button:** 45 tickets
- **Auto-correct changing information:** 27 tickets

#### Representative Customer Quotes:

> *"The buttons are so tiny I keep hitting the wrong thing. My fingers aren't that big but your buttons are really small."*  
> — Ticket #CH-2024-7890, iOS user

> *"When I try to submit the form, the keyboard is covering the submit button. I can't figure out how to make it go away."*  
> — Ticket #CH-2024-8234, Android user

> *"Auto-correct keeps changing my street name to something else. Very annoying when trying to enter an address."*  
> — Ticket #CH-2024-8567, iOS user

## Detailed Ticket Analysis

### Ticket Volume by Month
- **October 2024:** 742 tickets
- **November 2024:** 834 tickets (Black Friday spike)
- **December 2024:** 770 tickets (Holiday shopping)

### Platform Breakdown
- **iOS:** 1,408 tickets (60%)
- **Android:** 938 tickets (40%)

### Resolution Time Analysis
- **Average Resolution Time:** 2.3 days
- **First Response Time:** 4.2 hours
- **Customer Satisfaction:** 2.8/5 (below target of 4.0)

### Escalation Patterns
- **Escalated to Engineering:** 234 tickets (10%)
- **Escalated to Product:** 156 tickets (7%)
- **Refund Requests:** 89 tickets (4%)

## Customer Impact Stories

### High-Value Customer Losses

#### Case Study 1: Enterprise Customer
> *"We were planning to place a $15,000 bulk order through mobile but your checkout process is impossible. We'll have to use a competitor instead."*  
> — Ticket #CH-2024-9999, B2B customer

#### Case Study 2: Repeat Customer Frustration
> *"I've been shopping with you for 3 years but I'm done. Your mobile checkout is broken and I'm tired of fighting with it. Amazon is just easier."*  
> — Ticket #CH-2024-8888, VIP customer

#### Case Study 3: International Customer
> *"I'm trying to order from the UK but your checkout doesn't work with international addresses. I've tried 10 times. Please fix this or I'll shop elsewhere."*  
> — Ticket #CH-2024-7777, International customer

### Positive Feedback (When It Works)
> *"When your checkout actually works, it's fine. But it fails so often that I usually just use my computer instead."*  
> — Ticket #CH-2024-6666, iOS user

## Support Team Insights

### Agent Feedback
Our support agents report that mobile checkout issues are:
- **Most time-consuming:** Average 15 minutes per ticket vs 8 minutes for other issues
- **Most frustrating for customers:** Higher anger/frustration scores
- **Hardest to resolve:** Often require engineering involvement
- **Most likely to result in lost sales:** 23% of tickets mention shopping elsewhere

### Common Workarounds Provided
1. **"Try using desktop instead"** (most common response)
2. **"Clear your browser cache and try again"**
3. **"Try a different browser"**
4. **"Use guest checkout instead of logging in"**
5. **"Contact us and we'll process your order manually"**

## Seasonal Patterns

### Black Friday/Cyber Monday (Nov 24-27)
- **Ticket Volume:** 312 tickets (4x normal daily volume)
- **Top Issue:** Payment processing failures (45% of tickets)
- **Revenue Impact:** Estimated $180K in lost sales

### Holiday Shopping (Dec 1-23)
- **Ticket Volume:** 156% of normal volume
- **Top Issue:** Address delivery issues for gifts
- **International Orders:** 3x normal complaint volume

## Competitive Mentions

### Customers Comparing to Competitors
- **Amazon:** Mentioned in 234 tickets as "easier to use"
- **Target:** Mentioned in 89 tickets for "better mobile experience"
- **Walmart:** Mentioned in 45 tickets for "faster checkout"

### Feature Requests Based on Competitor Experiences
- **Apple Pay:** "Amazon has this, why don't you?"
- **One-click ordering:** "Amazon's one-click is so much easier"
- **Address suggestions:** "Target's address autocomplete is great"

## Recommendations Based on Customer Feedback

### Immediate Fixes (Week 1-2)
1. **Fix payment processing crashes** (234 tickets)
2. **Allow editing of previous checkout steps** (312 tickets)
3. **Improve address validation for international users** (156 tickets)

### Short-term Improvements (Week 3-8)
1. **Add Apple Pay and Google Pay** (443 tickets requesting)
2. **Implement address autocomplete** (57 tickets + general usability)
3. **Increase touch target sizes** (67 tickets about small buttons)

### Long-term Enhancements (Q2-Q3)
1. **One-click checkout for returning customers**
2. **Better international address handling**
3. **Improved error messaging and validation**

## Success Metrics to Track
- **Ticket Volume Reduction:** Target 50% reduction in mobile checkout tickets
- **Resolution Time:** Reduce from 2.3 days to <1 day
- **Customer Satisfaction:** Improve from 2.8/5 to 4.0/5
- **Escalation Rate:** Reduce from 17% to <5%

## Customer Quotes for Product Team

### On Mobile vs Desktop
> *"I start checkout on mobile but always finish on desktop. Mobile is just too frustrating."*

### On Payment Security
> *"I don't trust entering my credit card on mobile. The page looks sketchy compared to desktop."*

### On Time Investment
> *"I've spent 20 minutes trying to checkout on mobile. That's longer than my actual shopping took."*

### On Abandonment
> *"I have 3 items in my cart right now but I'll wait until I get home to my computer to buy them."*

*This analysis represents the voice of our customers and should heavily influence the mobile optimization roadmap.*`
  }
};

export default simulationDocuments; 