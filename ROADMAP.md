# 🪐 Constellation - Project Roadmap

This document combines the high-level vision, phased roadmap, and tactical task list for Constellation.

---

## 🎯 Vision
Build a clean, modular social platform for the ESA community:
- Facilitate effortless networking and connections between colleagues.
- Discover peers with shared interests, backgrounds, or projects.
- Provide a reliable alternative for trading, apartment listings, and shared accommodations.
- Document and promote social clubs and their histories.
- Maintain a vibrant alumni network to stay connected across cities.

---

## 🚀 High-Level Phases

### Phase 1: Foundations (Core Infrastructure)
- [x] Project initialization (Next.js / React / Strapi)
- [x] Responsive navigation & routing architecture
- [x] Basic Authentication & User Management
- [x] Deployment Pipeline & CI/CD setup
- [ ] Establish clear conventions for React Server Components (RSC) vs. Client Components ("use client")
- [ ] Backend API hardening & Rate Limiting

### Phase 2: User Profiles & Identity
- [x] Comprehensive User Profiles
- [x] Profile Picture Uploads
- [x] Dynamic Sidebar & Tabbed Navigation (Overview, Social, Pins, QR, Awards)
- [x] Online status indicators and "Last Seen" timestamps

### Phase 3: Pins & Achievements (Gamification)
- [x] Pin Library & Collection System
- [x] Pin Rarity Calculation Logic
- [x] Heatmap Integration for User Locations
- [x] Awards Tab UI with achieved/locked states
- [x] Prevent duplicate pin names in suggestions
- [x] Tracking and statistics for achievement progress (Awards)
- [x] Making sure all awards are achievable (tests)
- [ ] Interactive dashboards for Pin statistics and global collection metrics
- [ ] Anti-cheat: Validate country of origin at signup to prevent award manipulation

### Phase 4: Social Features & Clubs
- [ ] **Families**: Implement family/group structures
- [ ] **Clubs**: Joining, creating, and managing social clubs
- [ ] **Alumni Network**: Dedicated city-based views for former colleagues
- [ ] **Notification System**: In-app and email alerts for new features or interactions

### Phase 5: Market Place & Logistics
- [ ] **Market Place**: Community trading platform
- [ ] **Accommodations**: Listings for rentals and shared housing

---

## 🛠️ Tactical TODOs & UI Refinements

### User Experience (UX)
- [x] Integrated citation/quote system in Header
- [x] Responsive map fix
- [x] "Home" button optimization for iOS WebApps
- [x] Simplified pin suggestions (removed mission descriptions)
- [x] Conditional "New Feature" modal (skip for patch fixes/initial login)
- [x] Consistency: Standardize vertical padding across all profile tabs
- [ ] **Visibility**: Fix delete button not appearing on mobile
- [ ] **Onboarding**: Add "Join the Team" and "How it Works" info pages
- [ ] **Homepage**: Implement dynamic and attractive content/animations

### Compliance & Security
- [x] Ownership-based permissions (Owners/Admins only for updates/deletes)
- [x] Cascading deletes: Cleanup dependencies when a user account is removed
- [x] Domain-restricted registration (@esa.int only)
- [x] Admin approval workflow for pin suggestions
- [ ] **GDPR**: Terms of Use (ToU) compliance and data export tools
- [ ] **Account Management**: Password reset and self-service account deletion
- [ ] **Audit**: Review and finalize all User/Role permissions in Strapi

### Technical Debt & Maintenance
- [x] Centralized API helper for Docker/Local environments
- [x] Review utility and redundancy of all `userService` methods
- [ ] Comprehensive API testing (Integration/E2E)
- [ ] Implementation of Google Analytics (Privacy-friendly)
- [ ] Database backup and disaster recovery plan

---

## 🐛 Bug Fixes & Improvements
- [x] Heatmap duplication on address update
- [x] Dashboard Pin count correctly scoped to current user
- [ ] **Identity**: Fix profile display issues when users share identical names
- [ ] **Analytics**: Implement proportional (pro-rata) site/country representation

---