# Gaff.ie — Product Requirements Document

**Version:** 1.0  
**Date:** 25 March 2026  
**Status:** Active  
**Last Updated:** 25 March 2026  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [User Personas](#2-user-personas)
3. [Feature Requirements](#3-feature-requirements)
4. [Data Model](#4-data-model)
5. [API Endpoints](#5-api-endpoints)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Design System](#7-design-system)
8. [Development Phases](#8-development-phases)
9. [Metrics & KPIs](#9-metrics--kpis)
10. [Content Strategy](#10-content-strategy)

---

## 1. Executive Summary

### What is Gaff.ie?

Gaff.ie is a modern Irish property platform built to replace Daft.ie as the primary way Irish people find, list, and manage rental and sale properties. "Gaff" is Irish slang for "home" — short, memorable, culturally resonant.

### Mission

> Making housing in Ireland fair, transparent, and trustworthy — for everyone.

### Why Now?

- **Daft.ie has a 1.9/5 Trustpilot rating** (56 reviews). Its only competitor MyHome.ie also scores 1.9/5. Users are actively calling for competition.
- **Daft charges €135–999 per listing** while providing broken messaging, zero verification, and no customer support.
- **Daft's parent company (Distilled) also owns Property.ie, Rent.ie, Boards.ie, and DoneDeal** — the "competition" is illusory.
- **Rental scams cost Irish tenants millions annually** — no platform verifies landlord identity.
- **AI capabilities** now make verification, matching, and scam detection affordable for a startup.

### Target Market

- **Primary:** Dublin renters (tenants + landlords), expanding nationally.
- **TAM:** 2.5M monthly property searchers (Daft's current traffic).
- **Initial wedge:** Dublin rentals & room shares — highest pain, youngest/most tech-savvy users.

### Core Value Proposition

**Gaff is the only Irish property platform where every landlord is verified, every listing is real, and every message gets a reply.**

### Current State (25 March 2026)

The platform is live at `http://uc0gg4wkwwg0scc44ooowgws.62.171.142.50.sslip.io` with:
- 50 source files, 29 routes
- Basic auth (Tenant/Landlord/Agent roles), JWT cookies
- Listing CRUD, search with filters, listing detail pages
- Messaging API (conversations + messages)
- Trust score calculation library
- Scam detection library
- Homepage with hero, search, feature cards
- 12 sample listings, 0 real users

**Critical issue:** Homepage displays "2,000+ Verified Listings" and "500+ Verified Landlords" — entirely fabricated. See [Section 10: Content Strategy](#10-content-strategy) for resolution.

---

## 2. User Personas

### 2.1 Tenant — "Sarah, 27, Software Developer"

- Recently moved to Dublin from Cork for work
- Budget: €1,800/month for a 1-bed apartment
- Frustrated by sending 40+ enquiries on Daft with zero responses
- Worried about scams — colleague lost €2,400 deposit to a fake listing
- Needs: Verified listings, working messaging, application tracking, neighbourhood info
- Tech-savvy, mobile-first, values transparency

### 2.2 Landlord — "Padraig, 55, Property Owner"

- Owns 3 rental properties in Dublin
- Frustrated by Daft's €135/listing fees and broken messaging
- Overwhelmed by 200+ enquiries per listing — can't filter quality tenants
- Wants verified tenants with references and employment proof
- Not very technical — needs simple, clear UI
- Needs: Free/cheap listings, tenant screening, enquiry management, legal compliance tools

### 2.3 Estate Agent — "Aoife, 34, Letting Agent at O'Brien Properties"

- Manages 80 rental properties across Dublin
- Currently pays Daft per-listing — expensive at scale
- Uses 4 separate tools: Daft, email, spreadsheet CRM, Google Calendar
- Wants: All-in-one dashboard, bulk listing management, enquiry pipeline, viewing scheduler, analytics
- Will switch if tools save time, even if traffic is lower initially

### 2.4 Admin — "Platform Moderator"

- Reviews reported listings, manages verification queue
- Monitors scam detection flags
- Manages user accounts, handles disputes
- Needs: Moderation queue, analytics dashboard, user management, audit logs

---

### 2.5 User Stories by Role

These user stories are derived directly from documented Daft.ie pain points (Trustpilot reviews, market research, housing crisis data). Each story maps to a real problem Irish users face today.

#### 🏠 Tenant User Stories

**Finding a Home**
- As a tenant, I want to search properties by location, price, bedrooms, and BER rating so I can quickly find places that match my needs.
- As a tenant, I want to see only verified, active listings so I don't waste time on scams or stale ads that were let months ago.
- As a tenant, I want to save searches and get instant alerts when new matching properties appear so I'm among the first to enquire.
- As a tenant, I want to see neighbourhood data (schools, transport links, broadband speed, walkability) so I can make an informed decision without visiting first.
- As a tenant, I want to filter for HAP-accepted properties so I don't waste time enquiring about places that will reject me.
- As a tenant, I want to view high-quality photos and virtual tours so I can shortlist properties before scheduling viewings.
- As a tenant, I want to see the original listing date (not just "updated" date) so I know how long a property has actually been on the market.
- As a tenant, I want to browse listings without intrusive pop-up ads covering the photos so my search experience isn't frustrating.

**Applying & Communicating**
- As a tenant, I want to send enquiries and actually get responses so I'm not sending 40+ messages into the void like on Daft.
- As a tenant, I want to see a landlord's average response time so I know whether it's worth enquiring.
- As a tenant, I want read receipts on my messages so I know my enquiry was seen, even if the answer is no.
- As a tenant, I want to track the status of all my applications (enquired → shortlisted → viewing → offered → accepted/rejected) so I'm not left guessing.
- As a tenant, I want to schedule viewings directly through the platform so I don't play email tag.
- As a tenant, I want to submit a single verified profile (references, employment, ID) that I can share with multiple landlords so I don't repeat paperwork for every application.

**Trust & Safety**
- As a tenant, I want to see that a landlord is verified (ID checked, property ownership confirmed, RTB registered) so I know the listing is legitimate.
- As a tenant, I want to see landlord/agent ratings from previous tenants so I can avoid bad actors.
- As a tenant, I want to report suspicious listings easily so scams are taken down quickly.
- As a tenant, I want to know the platform has a real customer support team I can reach if something goes wrong — not a voicemail that hangs up after 30 seconds.
- As a tenant, I want deposit protection/escrow so I don't lose thousands to a scammer pretending to be a landlord.
- As a tenant, I want to see price history for a property so I know if the rent has been hiked beyond RPZ limits.

**Preference Profile & Smart Alerts**
- As a tenant, I want to fill out my "ideal gaff" profile (area, budget, bedrooms, nice-to-haves like parking/broadband/garden) so the platform works for me even when I'm not searching.
- As a tenant, I want to distinguish between "nice-to-haves" and "deal-breakers" so the system never shows me a property without parking if parking is essential.
- As a tenant, I want to enter my workplace address so I can see commute times on every listing and get matches within my acceptable commute.
- As a tenant, I want to get an instant notification (push + email) when a new property matches my profile so I'm among the first to enquire — not finding out 3 days later like on Daft.
- As a tenant, I want to see a match percentage on each listing so I can prioritise the best fits.
- As a tenant, I want AI-powered recommendations that learn from what I click, save, and skip to get smarter over time.
- As a tenant, I want to see comparable rents in the area so I know if the asking price is fair.

---

#### 🔑 Landlord User Stories

**Listing Properties**
- As a landlord, I want to list my property for free (or very cheaply) so I'm not paying Daft €135–279 per listing.
- As a landlord, I want a simple listing creation flow with guided prompts so I can create a professional listing even if I'm not tech-savvy.
- As a landlord, I want to upload multiple photos, set a price, add property details (BER, bedrooms, bathrooms, parking) and publish within 10 minutes.
- As a landlord, I want to mark a property as "Let Agreed" or "Under Offer" so I stop receiving enquiries once it's taken.
- As a landlord, I want to relist a property easily when a tenancy ends without starting from scratch.
- As a landlord, I want AI-generated listing descriptions based on my property details so I don't stare at a blank page.
- As a landlord, I want to see a listing quality score that tells me how to improve my ad (better photos, more detail, competitive pricing).

**Managing Enquiries**
- As a landlord, I want to see all enquiries in one dashboard — not buried in hundreds of emails I can't manage.
- As a landlord, I want to filter and sort enquiries by tenant verification status, employment, and references so I can focus on serious applicants.
- As a landlord, I want to reply to tenants directly through the platform and know my message actually reaches them (unlike Daft's broken messaging).
- As a landlord, I want to bulk-respond to enquiries (e.g., "Viewing scheduled for Saturday 2pm, reply to confirm") so I'm not writing 200 individual emails.
- As a landlord, I want to schedule viewings and send automated reminders so I reduce no-shows.
- As a landlord, I want a shortlist feature where I can tag promising tenants and compare them side by side.

**Tenant Screening & Trust**
- As a landlord, I want to see verified tenant profiles (ID, employment proof, previous landlord references) so I can make informed decisions.
- As a landlord, I want tenants to have a trust score based on their verification level so I can quickly assess quality.
- As a landlord, I want a structured reference request system so I'm not chasing previous landlords by phone.
- As a landlord, I want to verify my own identity and property ownership so tenants trust my listing.
- As a landlord, I want the platform to flag potentially fake enquiries so I don't waste time on spam.

**Legal & Compliance**
- As a landlord, I want reminders about RTB registration requirements so I stay compliant.
- As a landlord, I want to understand RPZ rent limits for my area so I price my property correctly.
- As a landlord, I want templates for lease agreements and notices so I don't need a solicitor for every tenancy.
- As a landlord, I want to know my obligations under the latest 2026 rental law changes without having to read legislation.

**Analytics**
- As a landlord, I want to see how many people viewed my listing, how many enquired, and how my listing compares to similar properties.
- As a landlord, I want pricing guidance based on comparable properties in my area so I set a competitive rent.
- As a landlord, I want to track my portfolio performance (occupancy rate, average rent, time-to-let) across all my properties.

---

#### 🏢 Estate Agent User Stories

**Listing Management**
- As an agent, I want to manage all my listings (50–200+) from a single dashboard so I don't juggle Daft, email, and spreadsheets.
- As an agent, I want to bulk-upload listings from a CSV or through an API so I'm not manually entering each one.
- As an agent, I want to list properties on Gaff.ie alongside Daft without double the work (easy dual-listing).
- As an agent, I want to edit, pause, or relist properties with one click so I can manage my portfolio efficiently.
- As an agent, I want to feature/boost specific listings so my premium properties get more visibility.
- As an agent, I want branded agent profiles with my company logo, bio, team members, and portfolio so tenants/buyers know who they're dealing with.
- As an agent, I want to see all my active, let-agreed, and archived listings in one view with filters and sorting.

**Enquiry Pipeline**
- As an agent, I want a CRM-style pipeline for each listing (new enquiry → screened → viewing booked → offer → let agreed) so nothing falls through the cracks.
- As an agent, I want to assign enquiries to team members so my staff can share the workload.
- As an agent, I want automated responses for initial enquiries ("Thanks for your interest, here's the viewing schedule...") so I don't manually reply to hundreds of identical messages.
- As an agent, I want to see tenant verification status at a glance so I can prioritise verified, serious applicants.
- As an agent, I want to communicate with tenants through the platform with a log of all messages so I have a paper trail.

**Viewings & Scheduling**
- As an agent, I want to create viewing slots and let tenants book directly so I stop playing phone tag.
- As an agent, I want to send bulk viewing invites to shortlisted tenants with calendar integration.
- As an agent, I want automated viewing reminders and no-show tracking so I can manage my time better.
- As an agent, I want to block-schedule open viewings for popular properties.

**Analytics & Reporting**
- As an agent, I want to see performance analytics: views per listing, enquiry conversion rates, time-to-let, and portfolio overview.
- As an agent, I want market data for my areas (average rents, supply trends, demand indicators) so I can advise clients.
- As an agent, I want to generate reports for my landlord clients showing listing performance and market comparisons.
- As an agent, I want to benchmark my response time and let rate against market averages.

**Pricing & Subscription**
- As an agent, I want a flat monthly subscription instead of per-listing fees so my costs are predictable and lower than Daft.
- As an agent, I want to try the platform for free or at a discount initially so I can evaluate it without risk.
- As an agent, I want to see clear ROI data (cost per lead, cost per let) so I can justify the switch from Daft to my business.

**Tools & Integration**
- As an agent, I want to generate AI-powered listing descriptions from property details so my team produces consistent, high-quality copy.
- As an agent, I want email/calendar integration so platform messages and viewings sync with my existing workflow.
- As an agent, I want to export my data (listings, contacts, messages) so I'm not locked into the platform.
- As an agent, I want an API so I can integrate Gaff.ie with my existing property management software.

---

#### 📊 Cross-Role Stories (All Users)

- As any user, I want the platform to load fast on mobile (LCP < 2.5s) because most Irish property browsing happens on phones.
- As any user, I want a clean, modern UI that doesn't look like it was built in 2005 (unlike Daft's current interface).
- As any user, I want to contact customer support and get a response within 24 hours — not be ignored for weeks.
- As any user, I want to trust that every listing on the platform is real because the platform verifies landlords and detects scams.
- As any user, I want to feel safe sharing my personal information because the platform is GDPR compliant and transparent about data use.
- As any user, I want the platform to work reliably without constant crashes, broken photos, or payment errors.
- As any user, I want to use the platform in English and Irish (Gaeilge) because this is an Irish platform.

---

## 3. Feature Requirements

Features are organized by category and priority:
- **P0** = Launch critical (must have before public beta)
- **P1** = Month 1 post-launch
- **P2** = Months 2–3
- **P3** = Future (Month 4+)

Status: **Built** | **Partial** | **Not Started**

---

### 3.1 Core Platform

#### F001 — Homepage
- **Description:** Landing page with hero search, feature cards, location browse, and social proof.
- **User Stories:**
  - As a visitor, I can immediately search for properties from the homepage.
  - As a visitor, I can understand what makes Gaff different from Daft within 5 seconds.
- **Acceptance Criteria:**
  - Hero section with search bar (rent/buy/share tabs)
  - Feature differentiation cards (verified, free, messaging, scam detection)
  - Location cards linking to search results by city/county
  - Social proof section with real metrics (not fabricated — see Content Strategy)
  - Fast load: LCP < 2.5s
- **Priority:** P0
- **Status:** Partial — Built but displays fake vanity metrics ("2,000+ Verified Listings", "500+ Verified Landlords"). Must fix before launch.
- **Dependencies:** None

#### F002 — Responsive Layout & Navigation
- **Description:** Fully responsive site with consistent navbar, footer, mobile menu.
- **User Stories:**
  - As a mobile user, I can navigate the entire site without horizontal scrolling.
  - As a user, I can access login, search, and dashboard from any page.
- **Acceptance Criteria:**
  - Navbar with logo, search, auth links, role-based dashboard link
  - Mobile hamburger menu
  - Footer with links to about, contact, legal pages
  - All pages responsive from 320px to 2560px
- **Priority:** P0
- **Status:** Partial — Navbar and footer exist but need mobile optimization and auth state awareness.
- **Dependencies:** F010 (Auth)

#### F003 — Error Handling & Loading States
- **Description:** Consistent error pages (404, 500), loading skeletons, toast notifications.
- **User Stories:**
  - As a user, I see a helpful error page when something goes wrong.
  - As a user, I see loading indicators during data fetches.
- **Acceptance Criteria:**
  - Custom 404 and 500 pages
  - Skeleton loaders for listing cards, search results, profile pages
  - Toast notification system for success/error/info messages
  - Form validation with inline error messages
- **Priority:** P0
- **Status:** Not Started
- **Dependencies:** None

---

### 3.2 Authentication & Profiles

#### F010 — User Registration
- **Description:** Registration flow for Tenant, Landlord, and Agent roles.
- **User Stories:**
  - As a visitor, I can register with email, password, name, and role selection.
  - As a registering user, I understand what each role provides.
- **Acceptance Criteria:**
  - Email + password registration (bcrypt hashing)
  - Role selection: Tenant, Landlord, Agent
  - Email format validation, password strength requirements (8+ chars, 1 number)
  - Duplicate email check
  - Success redirect to dashboard
- **Priority:** P0
- **Status:** Built
- **Dependencies:** None

#### F011 — Login / Logout
- **Description:** JWT cookie-based authentication.
- **User Stories:**
  - As a registered user, I can log in with email and password.
  - As a logged-in user, I can log out from any page.
- **Acceptance Criteria:**
  - JWT token set as httpOnly cookie
  - Login form with error handling
  - Logout clears cookie and redirects to homepage
  - Protected routes redirect to login
- **Priority:** P0
- **Status:** Built
- **Dependencies:** F010

#### F012 — Email Verification
- **Description:** Verify email address via confirmation link.
- **User Stories:**
  - As a new user, I receive a verification email after registration.
  - As a user, I can resend the verification email.
- **Acceptance Criteria:**
  - Verification email sent on registration (via Resend/Postmark)
  - Clicking link sets `emailVerified = true`
  - Unverified users see banner prompting verification
  - Resend link available (rate-limited: 1 per 60 seconds)
- **Priority:** P0
- **Status:** Not Started
- **Dependencies:** F010, email service integration

#### F013 — Password Reset
- **Description:** Forgot password flow via email.
- **User Stories:**
  - As a user who forgot my password, I can reset it via email link.
- **Acceptance Criteria:**
  - "Forgot password" link on login page
  - Email with time-limited reset link (1 hour expiry)
  - New password form with confirmation
  - Old sessions invalidated after reset
- **Priority:** P0
- **Status:** Not Started
- **Dependencies:** F010, email service

#### F014 — User Profile Page
- **Description:** Public-facing profile for landlords and tenants.
- **User Stories:**
  - As a tenant, I can view a landlord's profile, verification status, trust score, and reviews.
  - As a landlord, I can view a tenant's profile, verification badge, and references.
  - As a user, I can edit my own profile (bio, avatar, preferences).
- **Acceptance Criteria:**
  - Public profile page at `/user/[id]`
  - Displays: name, avatar, role, verification badges, trust score, member since date
  - Landlord profile: active listings, response rate, reviews received
  - Tenant profile: bio, preferences, verification badge
  - Edit mode for own profile
  - Avatar upload (max 2MB, jpg/png/webp)
- **Priority:** P0
- **Status:** Partial — Landlord page exists at `/landlord/[id]`, no tenant profile, no edit mode.
- **Dependencies:** F010, F040 (Trust Score)

#### F014b — Tenant Preference Profile ("My Ideal Gaff")
- **Description:** During onboarding (or anytime from dashboard), tenants fill out a structured preference profile describing their ideal property. The system uses this to power smart matching (F071) and proactive alerts (F033).
- **User Stories:**
  - As a tenant, I want to specify my ideal area(s), budget range, bedroom count, and move-in date so the platform can find properties for me.
  - As a tenant, I want to list nice-to-haves (parking, high-speed internet, garden, pet-friendly, furnished, dishwasher, dryer, etc.) so I get ranked matches rather than binary yes/no filters.
  - As a tenant, I want to set deal-breakers (e.g., "must allow pets", "must have parking") separately from nice-to-haves so the system never recommends properties that don't meet my essentials.
  - As a tenant, I want to specify my workplace/college address so the system can calculate commute times and prioritise nearby listings.
  - As a tenant, I want to indicate if I accept HAP so I only see HAP-friendly listings.
  - As a tenant, I want to update my preferences anytime as my situation changes.
  - As a tenant, I want to get notified instantly (push/email) when a new listing matches my profile so I can be first to enquire.
- **Acceptance Criteria:**
  - Preference form accessible from onboarding flow and dashboard settings
  - Fields: preferred areas (multi-select counties/towns + map draw), budget min/max, bedrooms min, property type (apartment/house/room/studio), move-in date, lease length preference
  - Nice-to-have checklist: parking, garden/balcony, pet-friendly, furnished/unfurnished, dishwasher, dryer, high-speed broadband, EV charging, wheelchair accessible, storage, en-suite, walk-in wardrobe, public transport nearby
  - Deal-breaker toggle on each nice-to-have (nice-to-have vs. must-have)
  - Commute destination input (address or Eircode) with max commute time (driving/public transport)
  - HAP acceptance toggle
  - Preferences feed into F071 (Smart Matching) match score
  - Preferences feed into F033 (Saved Searches & Alerts) for proactive notifications
  - Preferences stored in user profile, editable anytime
  - Onboarding prompt after first registration: "Tell us what you're looking for" (skippable)
- **Priority:** P0
- **Status:** Not Started
- **Dependencies:** F010, F014

#### F015 — Social Login (Google, Apple)
- **Description:** OAuth login for faster registration.
- **User Stories:**
  - As a visitor, I can register/login with my Google or Apple account.
- **Acceptance Criteria:**
  - Google OAuth integration
  - Apple Sign In integration
  - Auto-create user on first social login
  - Role selection prompt on first social login
  - Link social account to existing email-based account
- **Priority:** P1
- **Status:** Not Started
- **Dependencies:** F010

---

### 3.3 Listings

#### F020 — Create Listing
- **Description:** Multi-step form for landlords/agents to create property listings.
- **User Stories:**
  - As a landlord, I can create a rental listing with all property details.
  - As an agent, I can create listings on behalf of my agency.
- **Acceptance Criteria:**
  - Fields: title, description, property type, listing type (rent/sale/share), price, bedrooms, bathrooms, sqft, address, eircode, BER rating, furnished status, available from date, HAP accepted, pets allowed, parking included, features (JSON)
  - Photo upload (up to 20 images, drag-and-drop reorder)
  - Address autocomplete (Eircode/Google Places)
  - Preview before publishing
  - Draft save capability
  - Validation: required fields, price range checks, description min length (50 chars)
- **Priority:** P0
- **Status:** Partial — Form exists with all fields but lacks photo upload, address autocomplete, preview, and draft save.
- **Dependencies:** F010, F021

#### F021 — Image Upload & Management
- **Description:** Photo upload, optimization, and gallery management for listings.
- **User Stories:**
  - As a landlord, I can upload up to 20 photos for my listing.
  - As a landlord, I can reorder photos and set a primary image.
  - As a tenant, I can view photos in a full-screen gallery with swipe navigation.
- **Acceptance Criteria:**
  - Upload to cloud storage (Cloudflare R2 or S3)
  - Client-side image compression before upload (max 2MB per image)
  - Server-side optimization (WebP conversion, multiple sizes: thumbnail, medium, full)
  - Drag-and-drop reorder
  - Primary image selection
  - Full-screen gallery with keyboard navigation and swipe on mobile
  - Alt text field for accessibility
  - EXIF data stripped for privacy
- **Priority:** P0
- **Status:** Not Started — ListingImage model exists in schema but no upload implementation.
- **Dependencies:** Cloud storage setup

#### F022 — Edit Listing
- **Description:** Edit existing listing details and images.
- **User Stories:**
  - As a landlord, I can edit my listing's details, price, and photos.
  - As a landlord, I can see a changelog of edits.
- **Acceptance Criteria:**
  - Same form as create, pre-populated with existing data
  - Only listing owner (or agent org member) can edit
  - Price change tracked in audit log
  - Updated timestamp visible on listing
- **Priority:** P0
- **Status:** Partial — API route exists (`/api/listings/[id]` PUT) but no edit UI page.
- **Dependencies:** F020

#### F023 — Listing Status Management
- **Description:** Lifecycle management: Draft → Active → Let Agreed/Sale Agreed → Expired → Removed.
- **User Stories:**
  - As a landlord, I can mark my listing as "Let Agreed" when I find a tenant.
  - As a tenant, I can see whether a listing is still active or under offer.
  - As the platform, listings auto-expire after 30 days without renewal.
- **Acceptance Criteria:**
  - Status transitions: Draft→Active, Active→Let Agreed/Sale Agreed, Active→Removed, any→Expired (automated)
  - Auto-expiry: listings expire 30 days after creation/last refresh
  - Renewal prompt email 3 days before expiry
  - "Refresh" button to confirm listing is still active (resets 30-day clock)
  - Expired listings show "This listing has expired" banner
  - Let Agreed/Sale Agreed listings remain visible (searchable) with status badge for 7 days, then hidden
  - Stale listing warning after 14 days without refresh: "This listing may no longer be available"
- **Priority:** P0
- **Status:** Not Started — Enum exists in schema but no lifecycle logic implemented.
- **Dependencies:** F020, cron job / background worker

#### F024 — Premium Listings
- **Description:** Paid upgrade for boosted visibility and featured placement.
- **User Stories:**
  - As a landlord, I can pay €29 to make my listing featured for 30 days.
  - As a tenant, I can distinguish premium listings from regular ones.
- **Acceptance Criteria:**
  - Stripe Checkout integration for premium upgrade
  - Premium listings appear first in search results with "Featured" badge
  - Premium duration: 30 days
  - Premium listing gets highlighted card style in search results
  - Analytics for premium listings (views, enquiries, comparison to non-premium)
- **Priority:** P1
- **Status:** Not Started — `isPremium` and `premiumUntil` fields exist in schema.
- **Dependencies:** F060 (Stripe), F020

#### F025 — Listing Detail Page
- **Description:** Full property detail page with all information, photos, map, and contact.
- **User Stories:**
  - As a tenant, I can view all details of a listing including photos, map, BER rating, and features.
  - As a tenant, I can contact the landlord directly from the listing page.
  - As a tenant, I can save a listing to my favourites.
- **Acceptance Criteria:**
  - Photo gallery (full-screen capable)
  - All property details displayed clearly
  - Map showing property location (MapLibre/Leaflet)
  - Nearby amenities (schools, transport — P2)
  - Contact/enquiry button (opens messaging)
  - Save/favourite button
  - Share button (copy link, social share)
  - BER rating badge with energy cost estimate
  - "Report listing" button
  - Breadcrumb navigation
  - Structured data (Schema.org RealEstateListing) for SEO
  - View count display
  - "Listed X days ago" timestamp
  - Similar listings carousel at bottom
- **Priority:** P0
- **Status:** Partial — Basic detail page exists at `/listing/[id]` but lacks gallery, save, share, contact form, structured data, and similar listings.
- **Dependencies:** F020, F021, F030 (Messaging)

#### F026 — Virtual Tours & Video
- **Description:** Support for 360° virtual tours and video walkthroughs.
- **User Stories:**
  - As a landlord, I can upload a video walkthrough of my property.
  - As a tenant, I can view a virtual tour without visiting in person.
- **Acceptance Criteria:**
  - Video upload (max 200MB, mp4/mov)
  - Video player on listing detail page
  - Optional: 360° photo viewer integration (Marzipano or similar)
  - YouTube/Vimeo embed support as alternative
- **Priority:** P2
- **Status:** Partial — VirtualTour component exists but is a stub with no real functionality.
- **Dependencies:** F021 (storage), video processing pipeline

---

### 3.4 Search & Discovery

#### F030 — Property Search with Filters
- **Description:** Search page with comprehensive filters and results display.
- **User Stories:**
  - As a tenant, I can search for properties by location, price range, bedrooms, property type, and listing type.
  - As a tenant, I can sort results by price, date listed, and relevance.
- **Acceptance Criteria:**
  - Filters: location (city/county/eircode), min/max price, bedrooms (min/max), bathrooms, property type, listing type (rent/sale/share), BER rating, furnished status, HAP accepted, pets allowed, parking, available from date
  - Sort: newest first, price low→high, price high→low, relevance
  - URL-based filter state (shareable search URLs)
  - Results count displayed
  - Pagination or infinite scroll (20 results per page)
  - "No results" state with suggestions
  - Filter chips showing active filters with remove capability
- **Priority:** P0
- **Status:** Partial — Search page exists with location, price, beds, type filters. Missing: BER, furnished, HAP, pets, parking, available date filters. Missing: sort, pagination, URL state.
- **Dependencies:** F020

#### F031 — Map View Search
- **Description:** Interactive map showing property locations with search integration.
- **User Stories:**
  - As a tenant, I can browse properties on a map and click pins for details.
  - As a tenant, I can draw an area on the map to search within.
- **Acceptance Criteria:**
  - MapLibre GL with OpenStreetMap tiles
  - Property pins with price labels
  - Click pin → listing card popup
  - Map bounds update search results (list + map synchronized)
  - Cluster pins when zoomed out
  - Draw-to-search polygon tool (P2)
  - Toggle between list view and map view
- **Priority:** P1
- **Status:** Partial — NeighbourhoodMap component exists but not integrated with search.
- **Dependencies:** F030, PostGIS spatial queries

#### F032 — Saved Listings (Favourites)
- **Description:** Save/favourite listings for later review.
- **User Stories:**
  - As a tenant, I can save listings and view them in my dashboard.
  - As a tenant, I get notified if a saved listing's price changes or status updates.
- **Acceptance Criteria:**
  - Heart/save icon on listing cards and detail pages
  - Saved listings page in dashboard
  - Remove from saved
  - Notification on price change or status change (email, P1)
  - Works without login (localStorage), syncs on login
- **Priority:** P0
- **Status:** Not Started — SavedListing model exists in schema.
- **Dependencies:** F010, F020

#### F033 — Saved Searches & Alerts
- **Description:** Save search criteria and receive alerts when new matching listings appear.
- **User Stories:**
  - As a tenant, I can save a search and get daily/instant email alerts for new matches.
- **Acceptance Criteria:**
  - "Save this search" button on search results page
  - Name the saved search
  - Alert frequency: instant, daily digest, weekly digest
  - Dashboard page listing saved searches with edit/delete
  - Email with matching listings (formatted, with images)
  - Unsubscribe link in each email
  - Max 10 saved searches per user (free tier)
- **Priority:** P1
- **Status:** Not Started — SavedSearch model exists in schema.
- **Dependencies:** F030, email service, background worker

#### F034 — Recently Viewed
- **Description:** Track and display recently viewed listings.
- **User Stories:**
  - As a tenant, I can see my recently viewed listings.
- **Acceptance Criteria:**
  - Last 20 viewed listings stored (localStorage + server sync for logged-in users)
  - Recently viewed section on dashboard
  - Accessible from search results page sidebar
- **Priority:** P1
- **Status:** Not Started
- **Dependencies:** None

#### F035 — Full-Text Search
- **Description:** Search listing titles and descriptions by keyword.
- **User Stories:**
  - As a tenant, I can search for "garden flat near DART" and get relevant results.
- **Acceptance Criteria:**
  - PostgreSQL full-text search on title + description
  - Typo tolerance (P2: Meilisearch/Typesense integration)
  - Search suggestions / autocomplete
  - Highlighted matching text in results
- **Priority:** P1
- **Status:** Not Started — Prisma `fullTextSearch` preview feature enabled in schema.
- **Dependencies:** F030

---

### 3.5 Messaging & Communication

#### F040 — In-App Messaging
- **Description:** Real-time messaging between tenants and landlords/agents about listings.
- **User Stories:**
  - As a tenant, I can send a message to a landlord about a listing.
  - As a landlord, I can view and reply to all enquiries in one inbox.
  - As a user, I can see read receipts on messages.
- **Acceptance Criteria:**
  - Conversation created per (tenant, listing) pair
  - Messages stored in database with timestamps
  - Read receipts (readAt timestamp)
  - Conversation list view with unread count
  - Real-time updates (polling initially, WebSocket P1)
  - Pre-populated enquiry template ("Hi, I'm interested in...")
  - Tenant profile summary visible to landlord in conversation
  - Block user capability
  - Report message capability
- **Priority:** P0
- **Status:** Partial — API routes exist for creating/reading messages and conversations. No frontend inbox UI, no read receipts UI, no real-time updates.
- **Dependencies:** F010, F020

#### F041 — Email Notifications
- **Description:** Email notifications for key events.
- **User Stories:**
  - As a user, I receive an email when I get a new message.
  - As a landlord, I receive an email when someone enquires about my listing.
  - As a user, I can configure which emails I receive.
- **Acceptance Criteria:**
  - Notification events: new message, new enquiry, listing expiry warning, saved search alert, verification status change, review received
  - Email templates (branded, responsive HTML)
  - Notification preferences page (toggle each type)
  - Unsubscribe link in every email
  - Rate limiting (max 1 notification per conversation per 15 minutes)
  - Transactional email provider (Resend or Postmark)
- **Priority:** P0
- **Status:** Not Started
- **Dependencies:** Email service integration

#### F042 — Push Notifications (Web + Mobile)
- **Description:** Browser and mobile push notifications.
- **User Stories:**
  - As a tenant, I get a push notification when a landlord replies to my message.
- **Acceptance Criteria:**
  - Web Push API (service worker)
  - Permission request flow
  - Same events as email notifications
  - Preference controls
- **Priority:** P2
- **Status:** Not Started
- **Dependencies:** F041, service worker, PWA setup

#### F043 — Viewing Scheduler
- **Description:** Structured viewing request and scheduling system.
- **User Stories:**
  - As a landlord, I can set available viewing slots.
  - As a tenant, I can request a viewing for a specific time.
  - As both parties, I receive calendar reminders.
- **Acceptance Criteria:**
  - Landlord sets available time slots per listing
  - Tenant requests viewing from available slots
  - Landlord confirms/declines
  - Calendar invite (.ics) sent to both parties
  - Reminder email 24h and 1h before viewing
  - Cancel/reschedule capability
  - Group viewing support (multiple tenants, same slot)
- **Priority:** P2
- **Status:** Not Started
- **Dependencies:** F040, F041

---

### 3.6 Trust & Safety

#### F050 — Landlord Identity Verification
- **Description:** Verify landlord identity via government ID check.
- **User Stories:**
  - As a landlord, I can verify my identity to earn a "Verified" badge.
  - As a tenant, I can see which landlords are verified and trust their listings.
- **Acceptance Criteria:**
  - Integration with Stripe Identity or Onfido
  - ID document upload (passport, driving licence, national ID)
  - Automated verification (AI document check)
  - Manual review fallback for edge cases
  - Verified badge displayed on profile and all listings
  - Verification expires after 2 years, renewal prompt
  - Admin can manually verify/reject
- **Priority:** P0
- **Status:** Partial — Verification model exists in schema, VerificationFlow UI component is a stub. No actual verification provider integration.
- **Dependencies:** Stripe Identity or Onfido API key

#### F051 — Tenant Verification Badge
- **Description:** Optional paid verification for tenants (€9.99 one-time).
- **User Stories:**
  - As a tenant, I can verify my identity to stand out to landlords.
  - As a landlord, I can prioritize verified tenants in my enquiry queue.
- **Acceptance Criteria:**
  - Same ID verification as landlords
  - Payment via Stripe (€9.99)
  - Verified badge on profile and in messages
  - Landlord inbox can filter/sort by verified tenants
- **Priority:** P1
- **Status:** Not Started
- **Dependencies:** F050, F060

#### F052 — Trust Score System
- **Description:** Composite trust score visible on user profiles.
- **User Stories:**
  - As a tenant, I can see a landlord's trust score before contacting them.
  - As a user, I understand what contributes to trust score.
- **Acceptance Criteria:**
  - Score 0–100, displayed as a visual indicator
  - Components: verification status (40%), response rate (20%), review score (20%), account age (10%), listing quality (10%)
  - Score visible on profile and listing cards
  - "What's this?" tooltip explaining the score
  - Score recalculated daily (background job)
- **Priority:** P1
- **Status:** Partial — `trustScore.ts` library exists with calculation logic. No UI integration beyond TrustScore component stub.
- **Dependencies:** F050, F055, F040

#### F053 — Scam Detection (Automated)
- **Description:** AI-powered detection of fraudulent listings.
- **User Stories:**
  - As a platform, fraudulent listings are automatically flagged before going live.
  - As a tenant, I can trust that listings on Gaff have been screened.
- **Acceptance Criteria:**
  - Rule-based checks on listing creation: price anomalies (>30% below area average), stock photo detection (reverse image search or perceptual hashing), known scam text patterns ("I'm currently abroad", "send deposit via wire"), newly created accounts listing multiple properties
  - Risk score per listing (0–100)
  - High-risk listings held for manual review
  - Medium-risk listings published with warning flag
  - Low-risk listings auto-published
  - Admin moderation queue for flagged listings
  - False positive rate target: <5%
- **Priority:** P0
- **Status:** Partial — `scamDetection.ts` library exists with basic rules. Not integrated into listing creation flow or admin queue.
- **Dependencies:** F020, F070 (Admin)

#### F054 — Report Listing / User
- **Description:** User reporting system for problematic content.
- **User Stories:**
  - As a tenant, I can report a listing I believe is fake or misleading.
  - As a user, I can report another user for abusive behaviour.
- **Acceptance Criteria:**
  - Report button on listing detail page and user profiles
  - Report reasons: Scam, Fake Listing, Misleading, Inappropriate, Duplicate, Discrimination, Other
  - Optional description field
  - Report stored with status tracking (Open → Reviewing → Resolved/Dismissed)
  - Reporter receives email update when report is resolved
  - Admin moderation queue for reports
  - Repeat offender detection (user with 3+ resolved reports gets flagged)
- **Priority:** P0
- **Status:** Partial — Report model in schema, ReportButton component exists, API route at `/api/reports`. Needs admin queue integration and email updates.
- **Dependencies:** F010, F070

#### F055 — Reviews & Ratings
- **Description:** Post-tenancy two-way review system.
- **User Stories:**
  - As a tenant who completed a tenancy, I can rate my landlord.
  - As a landlord, I can rate a tenant after their tenancy ends.
  - As a user, I can read reviews on profiles.
- **Acceptance Criteria:**
  - 1–5 star overall rating
  - Category ratings: communication, property condition (tenant→landlord), fairness, maintenance response (tenant→landlord), property care (landlord→tenant), payment reliability (landlord→tenant)
  - Written review (optional, min 20 chars if provided)
  - Reviews only from verified tenancies (initially: both parties confirm the tenancy existed)
  - Review moderation (profanity filter, admin review for disputes)
  - Reviews displayed on profile page
  - Average rating displayed on listing cards
- **Priority:** P2
- **Status:** Partial — Review model in schema, ReviewCard and WriteReview components exist, API at `/api/reviews`. No tenancy verification for reviews.
- **Dependencies:** F014, F050

#### F056 — RTB Registration Verification
- **Description:** Check landlord's RTB (Residential Tenancies Board) registration.
- **User Stories:**
  - As a tenant, I can see if a landlord's tenancy is registered with the RTB.
- **Acceptance Criteria:**
  - Landlord enters RTB registration number
  - System checks against RTB public register (web scraping or API if available)
  - "RTB Registered" badge on verified listings
  - Auto-re-check every 90 days
- **Priority:** P2
- **Status:** Not Started
- **Dependencies:** F050, RTB data access

---

### 3.7 Payments & Monetization

#### F060 — Stripe Integration
- **Description:** Payment processing for premium listings, subscriptions, and tenant verification.
- **User Stories:**
  - As a landlord, I can pay for a premium listing upgrade via card.
  - As an agent, I can subscribe to a monthly plan.
- **Acceptance Criteria:**
  - Stripe Checkout for one-time payments (premium listings)
  - Stripe Billing for subscriptions (agent plans, Tenant Pro, Landlord Pro)
  - Webhook handler for payment events (success, failure, subscription changes)
  - Receipt emails via Stripe
  - Refund capability (admin-initiated)
  - SCA/PSD2 compliant (3D Secure)
  - Test mode for development
- **Priority:** P1
- **Status:** Not Started — Stripe account exists (acct_1T6vBk6AOsAgmGAh) with test key. `charges_enabled=false`, needs onboarding completion.
- **Dependencies:** Stripe account onboarding

#### F061 — Subscription Management
- **Description:** User-facing subscription management (upgrade, downgrade, cancel).
- **User Stories:**
  - As an agent, I can manage my subscription plan from my dashboard.
  - As a user, I can cancel my subscription at any time.
- **Acceptance Criteria:**
  - Subscription dashboard page
  - Plan comparison table
  - Upgrade/downgrade with prorated billing
  - Cancel with end-of-period access
  - Payment history / invoices
  - Stripe Customer Portal integration
- **Priority:** P1
- **Status:** Not Started — Subscription model exists in schema.
- **Dependencies:** F060

#### F062 — Free Listing Flow
- **Description:** Zero-friction listing creation — no payment required for basic listings.
- **User Stories:**
  - As a landlord, I can list my property for free with no credit card required.
- **Acceptance Criteria:**
  - Listing creation requires only registration (no payment)
  - Free listings get standard visibility
  - Clear upsell prompt for premium listing (non-blocking)
  - "Free forever" messaging on listing creation page
  - Free listings limited to 1 active per user (Landlord free tier); unlimited with Landlord Pro subscription
- **Priority:** P0
- **Status:** Partial — No payment is currently required (all free by default) but no explicit free tier messaging or premium upsell.
- **Dependencies:** F020

---

### 3.8 AI Features

#### F070 — AI Scam Detection
- **Description:** (See F053 — consolidated under Trust & Safety)
- **Priority:** P0
- **Status:** Partial

#### F071 — Smart Matching
- **Description:** AI-powered matching between tenant profiles and listings.
- **User Stories:**
  - As a tenant, I see a "Match Score" on each listing showing how well it fits my profile.
  - As a landlord, I see which enquiring tenants are the best match for my listing.
- **Acceptance Criteria:**
  - Match score 0–100% based on: budget fit, location preference, bedroom/bathroom match, feature preferences (pets, parking, furnished), commute time to preferred destinations
  - Tenants see top matches on dashboard
  - Landlords see match scores on enquiry list
  - "Recommended for you" section on homepage and search
  - Match algorithm improves with user feedback (clicked, saved, enquired, reported)
- **Priority:** P2
- **Status:** Partial — `matching.ts` library exists with basic scoring. RecommendedListings component exists. API at `/api/listings/recommended`. Not integrated with user profiles or feedback loop.
- **Dependencies:** F014 (Profile), F014b (Tenant Preferences), F030 (Search)

> **Integration note:** F071 is powered by the tenant preference profile (F014b). Match scores weight deal-breakers as hard filters (0% if violated) and nice-to-haves as weighted scoring factors. Commute time calculated via geocoding + routing API. New listing notifications (F033) trigger when a new listing scores ≥70% match for a tenant's profile.

#### F072 — AI Listing Quality Score
- **Description:** Automated scoring of listing quality to help landlords improve their ads.
- **User Stories:**
  - As a landlord, I see suggestions to improve my listing quality.
- **Acceptance Criteria:**
  - Score based on: number of photos, description length/quality, completeness of fields, BER rating provided, price reasonableness
  - Visual score indicator on listing management page
  - Specific improvement suggestions ("Add 3 more photos to increase enquiries by 40%")
  - Quality score factors into search ranking
- **Priority:** P2
- **Status:** Not Started
- **Dependencies:** F020

#### F073 — AI Content Generation
- **Description:** AI-assisted listing description writing and area guides.
- **User Stories:**
  - As a landlord, I can get an AI-generated description based on my listing details.
  - As a platform, area guides are generated from public data sources.
- **Acceptance Criteria:**
  - "Generate description" button on listing form
  - Input: property details, features, location → Output: professional listing description
  - Editable output (landlord can modify)
  - Area guides for each Dublin neighbourhood (generated, human-reviewed)
  - LLM integration (OpenAI/Anthropic API)
- **Priority:** P2
- **Status:** Not Started
- **Dependencies:** LLM API integration

---

### 3.9 Maps & Location

#### F080 — Interactive Map on Listing Detail
- **Description:** Map showing property location on listing detail page.
- **User Stories:**
  - As a tenant, I can see exactly where a property is on a map.
- **Acceptance Criteria:**
  - MapLibre GL or Leaflet map
  - Property pin at exact location (latitude/longitude)
  - Zoom controls
  - Satellite/street toggle
  - Nearby POIs shown (optional, P2)
- **Priority:** P0
- **Status:** Partial — NeighbourhoodMap component exists but unclear if integrated into listing detail page.
- **Dependencies:** Geocoding setup

#### F081 — Neighbourhood Data
- **Description:** Area information displayed alongside listings.
- **User Stories:**
  - As a tenant, I can see schools, transport links, shops, and amenities near a property.
- **Acceptance Criteria:**
  - Data sources: OSM (shops, restaurants, parks), NTA/TFI (public transport), Dept of Education (schools), SEAI (BER data), CSO (demographics)
  - Nearest schools with distance
  - Nearest public transport stops with routes
  - Walk score / transport score
  - Neighbourhood summary card on listing detail page
  - Dedicated area page at `/listing/[id]/area`
- **Priority:** P2
- **Status:** Partial — `/listing/[id]/area` route exists but likely a stub.
- **Dependencies:** Third-party data integration

#### F082 — Commute Time Calculator
- **Description:** Calculate commute time from a property to user's workplace/university.
- **User Stories:**
  - As a tenant, I can see how long it takes to commute from a property to my office.
- **Acceptance Criteria:**
  - User sets one or more commute destinations in profile
  - Commute time shown on each listing (driving, public transport, cycling, walking)
  - Filter search results by max commute time
  - Integration with OpenRouteService or similar
- **Priority:** P2
- **Status:** Not Started
- **Dependencies:** F081, routing API

#### F083 — Street View Integration
- **Description:** Street-level imagery of the property's surroundings.
- **User Stories:**
  - As a tenant, I can see the street outside a property.
- **Acceptance Criteria:**
  - Google Street View or Mapillary integration
  - Embedded viewer on listing detail page
  - Link to open full Street View
- **Priority:** P3
- **Status:** Partial — StreetView component exists as a stub.
- **Dependencies:** Google Maps API or Mapillary

---

### 3.10 Estate Agent Tools

#### F090 — Agent Dashboard
- **Description:** Dedicated dashboard for estate agents with listing management and enquiry pipeline.
- **User Stories:**
  - As an agent, I can manage all my agency's listings in one place.
  - As an agent, I can view and respond to all enquiries in a unified inbox.
- **Acceptance Criteria:**
  - Overview: active listings count, total enquiries, response rate, conversion metrics
  - Listing management table (sortable, filterable by status)
  - Bulk actions: archive, refresh, update price
  - Enquiry inbox with conversation threads per listing
  - Quick reply templates
  - Performance metrics (views, enquiries, avg response time per listing)
- **Priority:** P1
- **Status:** Not Started — Current dashboard is landlord-focused.
- **Dependencies:** F020, F040, F091

#### F091 — Agent Organisation Management
- **Description:** Multi-user agent organisations with team management.
- **User Stories:**
  - As an agency owner, I can invite team members and manage their access.
  - As a team member, I can manage listings assigned to me.
- **Acceptance Criteria:**
  - Create organisation with name and logo
  - Invite members via email
  - Roles: Owner (full access), Member (manage own listings)
  - Shared inbox for agency enquiries
  - All listings branded with agency logo
  - Team performance comparison (optional)
- **Priority:** P2
- **Status:** Not Started — AgentOrg and AgentOrgMember models exist in schema.
- **Dependencies:** F010, F090

#### F092 — Bulk Listing Upload
- **Description:** CSV/Excel import for agents with many properties.
- **User Stories:**
  - As an agent, I can upload 50 listings at once via CSV.
- **Acceptance Criteria:**
  - CSV template download
  - Upload and validation (preview before import)
  - Error reporting per row
  - Photo upload via URL references in CSV
  - Duplicate detection
- **Priority:** P2
- **Status:** Not Started
- **Dependencies:** F020, F091

#### F093 — Tenant Vetting Tools
- **Description:** Tools for agents/landlords to screen and shortlist tenants.
- **User Stories:**
  - As a landlord, I can view a ranked shortlist of applicants for my listing.
  - As a landlord, I can request references from applicants.
- **Acceptance Criteria:**
  - Applicant list per listing with match score, verification status, and profile summary
  - Shortlist / reject / archive actions
  - Reference request system (email to referee with structured form)
  - Pipeline view: Applied → Shortlisted → Viewing Scheduled → Offered → Accepted/Rejected
  - Comparison view (side-by-side tenant profiles)
- **Priority:** P2
- **Status:** Not Started
- **Dependencies:** F040, F051, F071

---

### 3.11 Admin Panel

#### F100 — Admin Dashboard
- **Description:** Admin panel for platform moderation and management.
- **User Stories:**
  - As an admin, I can view platform-wide metrics (users, listings, messages, reports).
  - As an admin, I can manage users, listings, and reports.
- **Acceptance Criteria:**
  - Protected admin routes (ADMIN role only)
  - Dashboard overview: total users (by role), total listings (by status), active conversations, open reports, pending verifications
  - Charts: signups over time, listings created over time, revenue
  - Quick links to moderation queues
- **Priority:** P0
- **Status:** Not Started — `/api/admin/flagged` route exists but no admin UI.
- **Dependencies:** F010 (ADMIN role)

#### F101 — Moderation Queue
- **Description:** Queue for reviewing reported listings and flagged content.
- **User Stories:**
  - As an admin, I can review reported listings and take action (approve, remove, warn user).
- **Acceptance Criteria:**
  - List of reports sorted by severity and date
  - Report detail view with listing preview, reporter info, and report reason
  - Actions: Dismiss report, Remove listing, Warn user, Suspend user
  - Scam detection flags integrated into same queue
  - Bulk actions for multiple reports
  - Resolution notes (internal)
  - Auto-notification to reporter on resolution
- **Priority:** P0
- **Status:** Not Started
- **Dependencies:** F054, F053

#### F102 — User Management
- **Description:** Admin user management (search, view, suspend, delete).
- **User Stories:**
  - As an admin, I can search for a user and view their activity.
  - As an admin, I can suspend or delete a user account.
- **Acceptance Criteria:**
  - User search by email, name, or ID
  - User detail view: profile, listings, messages, reports, verification status, trust score
  - Actions: Verify user, Suspend, Unsuspend, Delete (GDPR), Change role
  - Suspension reason logged in audit
  - Suspended users see "Account suspended" on login
- **Priority:** P1
- **Status:** Not Started
- **Dependencies:** F100

#### F103 — Verification Queue
- **Description:** Review pending identity verification submissions.
- **User Stories:**
  - As an admin, I can review and approve/reject verification submissions that failed automated checks.
- **Acceptance Criteria:**
  - List of pending verifications
  - View submitted documents
  - Approve / Reject with reason
  - Auto-notification to user on decision
- **Priority:** P1
- **Status:** Not Started
- **Dependencies:** F050

#### F104 — Audit Log Viewer
- **Description:** Searchable audit log for compliance and debugging.
- **User Stories:**
  - As an admin, I can view all actions taken on the platform (listing edits, user changes, moderation actions).
- **Acceptance Criteria:**
  - Searchable by user, action type, entity, date range
  - Immutable log entries
  - Export to CSV
  - Retention: 2 years minimum
- **Priority:** P1
- **Status:** Not Started — AuditLog model exists in schema.
- **Dependencies:** F100

---

### 3.12 Content & SEO

#### F110 — Static Pages (About, Contact, Terms, Privacy)
- **Description:** Essential informational pages.
- **User Stories:**
  - As a visitor, I can learn about Gaff.ie, its team, and mission.
  - As a user, I can read the terms of service and privacy policy.
- **Acceptance Criteria:**
  - About page: mission, team, story, differentiators
  - Contact page: contact form, email, live chat launcher
  - Terms of Service: legally reviewed
  - Privacy Policy: GDPR compliant, clear language
  - Cookie Policy with consent banner
  - Listing Rules / Community Guidelines
  - FAQ page
- **Priority:** P0
- **Status:** Not Started
- **Dependencies:** Legal review

#### F111 — Area Landing Pages
- **Description:** SEO-optimized pages for each city/town/neighbourhood.
- **User Stories:**
  - As a searcher, I find Gaff.ie when searching "apartments to rent in Rathmines".
- **Acceptance Criteria:**
  - Auto-generated pages for each county, city, and major neighbourhood
  - Content: listing count, average rent/price, area description, nearby amenities, listings preview
  - Structured data (Schema.org)
  - Internal linking between related areas
  - Dynamic content (updated daily with real listing data)
- **Priority:** P1
- **Status:** Not Started
- **Dependencies:** F030, content generation

#### F112 — Tenant & Landlord Guides
- **Description:** Educational content hub for renters and property owners.
- **User Stories:**
  - As a new renter in Ireland, I can learn about my rights, HAP, deposits, and the renting process.
  - As a landlord, I can understand my legal obligations, RTB registration, and tax implications.
- **Acceptance Criteria:**
  - Guide topics: "Renting in Ireland: A Complete Guide", "Understanding HAP", "Landlord Obligations", "Tenant Rights", "Moving to Dublin", "Understanding BER Ratings"
  - SEO optimized (target informational search queries)
  - Updated for 2026 law changes
  - Multilingual (English + Irish initially, more languages P3)
- **Priority:** P1
- **Status:** Not Started
- **Dependencies:** Content creation

#### F113 — Blog / News Section
- **Description:** Platform blog for market updates, product news, and housing content.
- **User Stories:**
  - As a user, I can read the monthly Gaff Market Report.
- **Acceptance Criteria:**
  - Blog with CMS (simple markdown files or headless CMS)
  - Categories: Market Reports, Product Updates, Guides, News
  - RSS feed
  - Social sharing
  - Author attribution
- **Priority:** P2
- **Status:** Not Started
- **Dependencies:** None

#### F114 — SEO Foundations
- **Description:** Technical SEO setup for search engine visibility.
- **User Stories:**
  - As a platform, property listings rank well in Google search.
- **Acceptance Criteria:**
  - Server-side rendering (Next.js SSR — already in place)
  - Structured data on all listing pages (Schema.org RealEstateListing)
  - XML sitemap (auto-generated, updated daily)
  - robots.txt
  - Open Graph and Twitter Card meta tags
  - Canonical URLs
  - Breadcrumb navigation with structured data
  - Page speed: Core Web Vitals in "Good" range
  - Internal linking strategy
- **Priority:** P0
- **Status:** Not Started
- **Dependencies:** None

---

### 3.13 Mobile & Performance

#### F120 — Mobile-Responsive Design
- **Description:** All pages fully responsive and touch-optimized.
- **User Stories:**
  - As a mobile user (70%+ of traffic), I have a native-feeling experience.
- **Acceptance Criteria:**
  - All pages responsive from 320px to 2560px
  - Touch-optimized controls (44px min tap targets)
  - Swipe gestures on photo galleries
  - Bottom navigation bar on mobile (search, saved, messages, profile)
  - No horizontal scroll on any page
  - Tested on: iPhone SE, iPhone 15, Samsung Galaxy S24, iPad
- **Priority:** P0
- **Status:** Partial — Basic responsiveness exists but not thoroughly tested or optimized.
- **Dependencies:** None

#### F121 — Progressive Web App (PWA)
- **Description:** PWA capabilities for app-like experience without app store.
- **User Stories:**
  - As a mobile user, I can add Gaff to my home screen and use it like a native app.
- **Acceptance Criteria:**
  - Service worker for offline caching (search results, saved listings)
  - Web app manifest (icon, splash screen, theme color)
  - "Add to Home Screen" prompt
  - Offline mode: show cached content with "You're offline" banner
  - Background sync for messages (when online)
- **Priority:** P2
- **Status:** Not Started
- **Dependencies:** F120

#### F122 — Performance Targets
- **Description:** Core Web Vitals and performance benchmarks.
- **Acceptance Criteria:**
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1
  - TTI (Time to Interactive): < 3.5s
  - Lighthouse score: > 90 (Performance, Accessibility, Best Practices, SEO)
  - Image lazy loading
  - Code splitting per route
  - API response times: < 200ms (p95)
  - Database query times: < 50ms (p95)
- **Priority:** P0
- **Status:** Not Started — No performance monitoring or optimization in place.
- **Dependencies:** None

#### F123 — Native Mobile Apps
- **Description:** iOS and Android apps (React Native or Flutter).
- **User Stories:**
  - As a user, I can download Gaff from the App Store or Google Play.
- **Acceptance Criteria:**
  - Feature parity with web app
  - Push notifications
  - Camera integration (for photo upload)
  - Map with GPS "near me" search
  - Biometric login (Face ID, fingerprint)
  - App store optimization (ASO)
- **Priority:** P3
- **Status:** Not Started
- **Dependencies:** Web app feature-complete (P0+P1)

---

### 3.14 Analytics & Reporting

#### F130 — Listing Performance Analytics
- **Description:** Analytics for landlords/agents on their listing performance.
- **User Stories:**
  - As a landlord, I can see how many people viewed my listing, saved it, and enquired.
- **Acceptance Criteria:**
  - Per listing: views (total + unique), saves, enquiries, response rate, avg response time
  - Trend charts (daily/weekly)
  - Comparison to area average ("Your listing gets 30% more views than average")
  - Available on landlord/agent dashboard
- **Priority:** P1
- **Status:** Not Started — `viewCount` field exists on Listing model.
- **Dependencies:** F020, analytics tracking

#### F131 — Platform Analytics (Internal)
- **Description:** Internal analytics for the Gaff team.
- **User Stories:**
  - As a product manager, I can understand user behaviour and platform health.
- **Acceptance Criteria:**
  - Events tracked: page views, searches, listing views, enquiries, registrations, verifications, payments
  - Analytics provider: PostHog (self-hosted) or Plausible (privacy-first)
  - Dashboard: DAU/WAU/MAU, retention, funnel conversion, search-to-enquiry rate
  - No Google Analytics (privacy commitment)
- **Priority:** P1
- **Status:** Not Started
- **Dependencies:** None

#### F132 — Market Reports
- **Description:** Monthly public market reports based on platform data.
- **User Stories:**
  - As a journalist, I can cite Gaff data in property market articles.
  - As a user, I can see rent trends in my area.
- **Acceptance Criteria:**
  - Monthly report: average rents by area, supply trends, price changes
  - Interactive charts on website
  - PDF download
  - Press release distribution
  - Historical data archive
  - Free and open access (no paywall — unlike Daft Report)
- **Priority:** P2
- **Status:** Not Started
- **Dependencies:** Sufficient listing data (500+ active listings)

---

## 4. Data Model

### Current Schema (Implemented)

The Prisma schema includes these models:

| Model | Status | Notes |
|-------|--------|-------|
| User | ✅ Built | Roles: TENANT, LANDLORD, AGENT, ADMIN |
| Profile | ✅ Built | Budget, preferences (JSON), bio, RTB number |
| Verification | ✅ Built | Types: ID, PROPERTY, EMPLOYMENT, STUDENT |
| Listing | ✅ Built | Full property details, geocoding, premium support |
| ListingImage | ✅ Built | Ordered images with primary flag |
| SavedListing | ✅ Built | User-listing favourite join table |
| SavedSearch | ✅ Built | Filters (JSON) + alert frequency |
| Conversation | ✅ Built | Per-listing conversation threads |
| ConversationParticipant | ✅ Built | Join table |
| Message | ✅ Built | Text messages with read receipts |
| Review | ✅ Built | 1-5 rating with category breakdown (JSON) |
| Report | ✅ Built | Listing reports with reason and status |
| AgentOrg | ✅ Built | Agent organisation with plan |
| AgentOrgMember | ✅ Built | User-org membership with role |
| Subscription | ✅ Built | Stripe subscription tracking |
| AuditLog | ✅ Built | Immutable action log |

### Needed Schema Additions

#### 4.1 Password Reset Tokens
```prisma
model PasswordReset {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  token     String   @unique
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime @default(now())
  @@index([token])
  @@map("password_resets")
}
```

#### 4.2 Email Verification Tokens
```prisma
model EmailVerification {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
  @@index([token])
  @@map("email_verifications")
}
```

#### 4.3 Notification Preferences
```prisma
model NotificationPreference {
  id                String  @id @default(cuid())
  userId            String  @unique
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  emailNewMessage   Boolean @default(true)
  emailNewEnquiry   Boolean @default(true)
  emailListingExpiry Boolean @default(true)
  emailSearchAlerts Boolean @default(true)
  emailMarketing    Boolean @default(false)
  pushEnabled       Boolean @default(false)
  @@map("notification_preferences")
}
```

#### 4.4 Viewing Slots & Requests
```prisma
model ViewingSlot {
  id        String   @id @default(cuid())
  listingId String
  listing   Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)
  startTime DateTime
  endTime   DateTime
  maxAttendees Int   @default(1)
  createdAt DateTime @default(now())
  requests  ViewingRequest[]
  @@index([listingId, startTime])
  @@map("viewing_slots")
}

model ViewingRequest {
  id        String   @id @default(cuid())
  slotId    String
  slot      ViewingSlot @relation(fields: [slotId], references: [id], onDelete: Cascade)
  tenantId  String
  tenant    User     @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  status    String   @default("PENDING") // PENDING, CONFIRMED, CANCELLED
  createdAt DateTime @default(now())
  @@map("viewing_requests")
}
```

#### 4.5 Application Tracking
```prisma
model Application {
  id        String   @id @default(cuid())
  listingId String
  listing   Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)
  tenantId  String
  tenant    User     @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  status    String   @default("APPLIED") // APPLIED, SHORTLISTED, VIEWING, OFFERED, ACCEPTED, REJECTED, WITHDRAWN
  message   String?  @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@unique([listingId, tenantId])
  @@index([tenantId, status])
  @@map("applications")
}
```

#### 4.6 User Session / Blocked Users
```prisma
model BlockedUser {
  blockerId String
  blocker   User   @relation("BlocksGiven", fields: [blockerId], references: [id], onDelete: Cascade)
  blockedId String
  blocked   User   @relation("BlocksReceived", fields: [blockedId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  @@id([blockerId, blockedId])
  @@map("blocked_users")
}
```

#### 4.7 Price History (for transparency)
```prisma
model PriceHistory {
  id        String   @id @default(cuid())
  listingId String
  listing   Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)
  price     Int      // Price in cents at this point
  changedAt DateTime @default(now())
  @@index([listingId, changedAt])
  @@map("price_history")
}
```

---

## 5. API Endpoints

### Current Endpoints (Built)

| Method | Path | Description | Status |
|--------|------|-------------|--------|
| POST | `/api/auth/register` | User registration | ✅ Built |
| POST | `/api/auth/login` | Login, returns JWT cookie | ✅ Built |
| POST | `/api/auth/logout` | Logout, clears cookie | ✅ Built |
| GET | `/api/auth/me` | Get current user | ✅ Built |
| GET | `/api/listings` | Search/list listings | ✅ Built |
| POST | `/api/listings` | Create listing | ✅ Built |
| GET | `/api/listings/[id]` | Get listing detail | ✅ Built |
| PUT | `/api/listings/[id]` | Update listing | ✅ Built |
| DELETE | `/api/listings/[id]` | Delete listing | ✅ Built |
| GET | `/api/listings/recommended` | Get recommended listings | ✅ Built |
| POST | `/api/messages` | Create conversation/send message | ✅ Built |
| GET | `/api/messages/[conversationId]` | Get conversation messages | ✅ Built |
| POST | `/api/reports` | Report a listing | ✅ Built |
| POST | `/api/reviews` | Create review | ✅ Built |
| GET | `/api/users/[id]/trust` | Get user trust score | ✅ Built |
| GET | `/api/admin/flagged` | Get flagged listings | ✅ Built |

### Needed Endpoints

#### Auth & Profile
| Method | Path | Description | Priority |
|--------|------|-------------|----------|
| POST | `/api/auth/forgot-password` | Request password reset | P0 |
| POST | `/api/auth/reset-password` | Reset password with token | P0 |
| POST | `/api/auth/verify-email` | Verify email with token | P0 |
| POST | `/api/auth/resend-verification` | Resend verification email | P0 |
| GET | `/api/users/[id]` | Get user public profile | P0 |
| PUT | `/api/users/me` | Update own profile | P0 |
| POST | `/api/users/me/avatar` | Upload avatar | P0 |
| DELETE | `/api/users/me` | Delete account (GDPR) | P1 |

#### Listings
| Method | Path | Description | Priority |
|--------|------|-------------|----------|
| POST | `/api/listings/[id]/images` | Upload listing images | P0 |
| DELETE | `/api/listings/[id]/images/[imageId]` | Delete listing image | P0 |
| PUT | `/api/listings/[id]/images/reorder` | Reorder images | P0 |
| POST | `/api/listings/[id]/refresh` | Refresh listing (reset expiry) | P0 |
| PUT | `/api/listings/[id]/status` | Update listing status | P0 |
| POST | `/api/listings/[id]/premium` | Upgrade to premium (Stripe) | P1 |
| GET | `/api/listings/[id]/analytics` | Listing performance data | P1 |
| POST | `/api/listings/bulk` | Bulk create (CSV import) | P2 |

#### Saved
| Method | Path | Description | Priority |
|--------|------|-------------|----------|
| GET | `/api/saved/listings` | Get saved listings | P0 |
| POST | `/api/saved/listings/[id]` | Save a listing | P0 |
| DELETE | `/api/saved/listings/[id]` | Unsave a listing | P0 |
| GET | `/api/saved/searches` | Get saved searches | P1 |
| POST | `/api/saved/searches` | Create saved search | P1 |
| PUT | `/api/saved/searches/[id]` | Update saved search | P1 |
| DELETE | `/api/saved/searches/[id]` | Delete saved search | P1 |

#### Messaging
| Method | Path | Description | Priority |
|--------|------|-------------|----------|
| GET | `/api/conversations` | List user's conversations | P0 |
| PUT | `/api/messages/[id]/read` | Mark message as read | P0 |
| POST | `/api/users/[id]/block` | Block a user | P1 |
| DELETE | `/api/users/[id]/block` | Unblock a user | P1 |

#### Verification
| Method | Path | Description | Priority |
|--------|------|-------------|----------|
| POST | `/api/verification/start` | Start verification flow | P0 |
| GET | `/api/verification/status` | Get verification status | P0 |
| POST | `/api/verification/webhook` | Stripe Identity webhook | P0 |

#### Admin
| Method | Path | Description | Priority |
|--------|------|-------------|----------|
| GET | `/api/admin/dashboard` | Dashboard metrics | P0 |
| GET | `/api/admin/reports` | List reports | P0 |
| PUT | `/api/admin/reports/[id]` | Resolve/dismiss report | P0 |
| GET | `/api/admin/verifications` | Pending verifications | P1 |
| PUT | `/api/admin/verifications/[id]` | Approve/reject verification | P1 |
| GET | `/api/admin/users` | Search/list users | P1 |
| PUT | `/api/admin/users/[id]` | Update user (suspend, role) | P1 |
| GET | `/api/admin/audit-log` | Search audit logs | P1 |

#### Payments
| Method | Path | Description | Priority |
|--------|------|-------------|----------|
| POST | `/api/payments/checkout` | Create Stripe Checkout session | P1 |
| POST | `/api/payments/webhook` | Stripe payment webhooks | P1 |
| GET | `/api/payments/subscription` | Get subscription details | P1 |
| POST | `/api/payments/portal` | Create Stripe Customer Portal link | P1 |

#### Applications & Viewings
| Method | Path | Description | Priority |
|--------|------|-------------|----------|
| POST | `/api/listings/[id]/apply` | Apply for a listing | P2 |
| GET | `/api/applications` | Get user's applications | P2 |
| PUT | `/api/applications/[id]` | Update application status | P2 |
| POST | `/api/listings/[id]/viewings` | Create viewing slots | P2 |
| GET | `/api/listings/[id]/viewings` | Get available viewing slots | P2 |
| POST | `/api/viewings/[id]/request` | Request a viewing | P2 |
| PUT | `/api/viewings/requests/[id]` | Confirm/cancel viewing | P2 |

---

## 6. Non-Functional Requirements

### 6.1 Performance
- **Page Load:** LCP < 2.5s, FID < 100ms, CLS < 0.1
- **API Response:** p95 < 200ms, p99 < 500ms
- **Search:** Results returned in < 300ms for 10,000 listings
- **Image Load:** Optimized WebP, lazy-loaded, CDN-served
- **Uptime:** 99.9% (43 minutes downtime/month max)

### 6.2 Security
- **Authentication:** JWT with httpOnly, Secure, SameSite cookies. Token rotation on password change.
- **Passwords:** bcrypt with cost factor 12. Minimum 8 characters.
- **HTTPS:** Enforced everywhere. HSTS header.
- **Input Validation:** Server-side validation on all inputs. SQL injection protection via Prisma ORM.
- **XSS Protection:** Content Security Policy headers. React auto-escaping. Sanitize user HTML input.
- **CSRF:** SameSite cookies + CSRF tokens on state-changing requests.
- **Rate Limiting:** Per-IP and per-user rate limits on auth endpoints (5 attempts/15 min), API (100 req/min), file upload (10/hour).
- **File Upload:** Validate MIME types, scan for malware (ClamAV), size limits (2MB images, 200MB video).
- **Dependency Security:** Automated vulnerability scanning (Snyk/npm audit). Weekly dependency updates.
- **Secrets Management:** Environment variables. Never commit secrets. Rotate keys quarterly.

### 6.3 Accessibility (WCAG 2.1 AA)
- **Keyboard Navigation:** All interactive elements keyboard-accessible.
- **Screen Readers:** Proper ARIA labels, semantic HTML, alt text on all images.
- **Colour Contrast:** Minimum 4.5:1 for normal text, 3:1 for large text.
- **Focus Indicators:** Visible focus rings on all interactive elements.
- **Forms:** Associated labels, error messages linked to fields, fieldset/legend for groups.
- **Motion:** Respect `prefers-reduced-motion`.
- **Testing:** axe-core automated tests in CI. Manual testing with VoiceOver and NVDA quarterly.

### 6.4 GDPR Compliance
- **Lawful Basis:** Consent for marketing, legitimate interest for platform operation, contract for paid services.
- **Privacy Policy:** Clear, plain-language. Updated for each data processing change.
- **Cookie Consent:** Banner with granular controls (essential, analytics, marketing). No tracking before consent.
- **Right to Access (SAR):** Automated data export within 30 days. Account settings page with "Download my data" button.
- **Right to Erasure:** Account deletion within 30 days. Anonymize data that must be retained (audit logs).
- **Data Minimization:** Collect only necessary data. Regular review of data retention.
- **Data Retention:** User data: deleted on request. Listings: archived after removal, deleted after 1 year. Messages: deleted with account. Audit logs: 2 years then purged.
- **Data Processing Agreements:** DPA with all third-party processors (Stripe, Onfido, cloud hosting, email).
- **Breach Notification:** Procedure for 72-hour DPC notification. Incident response plan.
- **DPO:** Appoint Data Protection Officer by Phase 3 (part-time/contract initially).

### 6.5 Internationalisation
- **Languages (Phase 1):** English (default), Irish
- **Languages (Phase 3):** Polish, Portuguese, Ukrainian, Romanian, French, Spanish, Mandarin
- **Currency:** EUR only (Irish market)
- **Date Format:** DD/MM/YYYY
- **Number Format:** European (1.234,56) — but Irish convention varies; support both.
- **Implementation:** next-intl or next-i18next. Translation files per locale.

---

## 7. Design System

### 7.1 Brand Colours

Based on current implementation (Tailwind config):

| Token | Hex | Usage |
|-------|-----|-------|
| `gaff-teal` | #0d9488 | Primary brand colour, CTAs, links |
| `gaff-teal-light` | #5eead4 | Highlights, gradients |
| `gaff-teal-dark` | #0f766e | Hover states, dark accents |
| `gaff-slate` | #0f172a | Dark backgrounds, text |
| `gaff-amber` | #d97706 | Accent, warnings, premium badges |
| White | #ffffff | Backgrounds, text on dark |
| Gray-50–900 | Tailwind defaults | UI chrome, borders, secondary text |
| Red-500 | #ef4444 | Errors, destructive actions |
| Green-500 | #22c55e | Success states, verified badges |

### 7.2 Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| H1 | System sans-serif (Inter) | 36–60px | 700 (bold) |
| H2 | System sans-serif | 24–36px | 600 (semibold) |
| H3 | System sans-serif | 20–24px | 600 |
| Body | System sans-serif | 16px | 400 |
| Small | System sans-serif | 14px | 400 |
| Caption | System sans-serif | 12px | 400 |

### 7.3 Component Library

Use **Radix UI** primitives with Tailwind styling (shadcn/ui pattern):

- **Buttons:** Primary (teal), Secondary (outline), Ghost, Destructive (red). Sizes: sm, md, lg.
- **Forms:** Input, Select, Textarea, Checkbox, Radio, Switch, DatePicker, FileUpload.
- **Layout:** Card, Container, Grid, Stack, Divider.
- **Feedback:** Toast, Alert, Badge, Skeleton, Spinner, Progress.
- **Navigation:** Navbar, Sidebar, Breadcrumb, Tabs, Pagination.
- **Overlay:** Modal/Dialog, Dropdown, Tooltip, Popover, Sheet (mobile drawer).
- **Data Display:** Table, List, Avatar, Stat card, Chart (Recharts).

### 7.4 Design Principles

1. **Clean over clever** — No visual clutter. Daft is cluttered with ads; we are not.
2. **Mobile-first** — Design for 375px first, scale up.
3. **Trust signals everywhere** — Verified badges, trust scores, and response rates should be prominent.
4. **Speed is a feature** — Skeleton loaders, optimistic updates, no full-page reloads.
5. **Accessible by default** — Every component must pass WCAG AA.

---

## 8. Development Phases

### Phase 0: Foundation (Current → Week 2) — "Fix What's Broken"
**Goal:** Fix critical issues, remove fake data, establish development standards.

| Task | Priority | Est. Days |
|------|----------|-----------|
| Remove fake vanity metrics from homepage | P0 | 0.5 |
| Replace hardcoded sample listings with DB queries | P0 | 1 |
| Set up CI/CD (GitHub Actions → Coolify) | P0 | 1 |
| Add error handling (404/500 pages, toast notifications) | P0 | 1 |
| Email service integration (Resend) | P0 | 1 |
| Email verification flow | P0 | 2 |
| Password reset flow | P0 | 1 |
| Mobile nav optimization | P0 | 1 |
| **Total** | | **~8 days** |

### Phase 1: MVP Launch (Weeks 3–8) — "Real Users Can Use This"
**Goal:** Platform is functional end-to-end for Dublin rentals.

| Task | Priority | Est. Days |
|------|----------|-----------|
| Image upload to R2/S3 + gallery | P0 | 4 |
| Listing status lifecycle + auto-expiry | P0 | 3 |
| Messaging frontend (inbox, conversations) | P0 | 4 |
| User profile pages (view + edit) | P0 | 3 |
| Landlord verification (Stripe Identity) | P0 | 3 |
| Scam detection integration into listing flow | P0 | 2 |
| Report system → admin moderation queue | P0 | 3 |
| Admin dashboard (basic) | P0 | 3 |
| Static pages (about, terms, privacy, FAQ) | P0 | 2 |
| SEO foundations (structured data, sitemap, meta) | P0 | 2 |
| Performance optimization (LCP, lazy load) | P0 | 2 |
| Saved listings (favourites) | P0 | 1 |
| Free listing flow messaging | P0 | 0.5 |
| **Total** | | **~32 days** |

### Phase 2: Growth (Weeks 9–16) — "Earn Trust, Build Habits"
**Goal:** Premium features, agent tools, search improvements, analytics.

| Task | Priority | Est. Days |
|------|----------|-----------|
| Stripe payments (premium listings) | P1 | 3 |
| Subscription management (agent plans) | P1 | 3 |
| Agent dashboard | P1 | 5 |
| Map view search | P1 | 4 |
| Saved searches + alerts | P1 | 3 |
| Full-text search | P1 | 2 |
| Social login (Google, Apple) | P1 | 2 |
| Tenant verification (paid) | P1 | 2 |
| Trust score UI integration | P1 | 2 |
| Area landing pages (SEO) | P1 | 3 |
| Tenant/landlord guides content | P1 | 3 |
| Listing performance analytics | P1 | 3 |
| Platform analytics (PostHog) | P1 | 2 |
| Admin: user management, verification queue, audit log | P1 | 4 |
| Recently viewed listings | P1 | 1 |
| **Total** | | **~42 days** |

### Phase 3: Scale (Weeks 17–24) — "The Trusted Alternative"
**Goal:** AI features, advanced tools, national coverage, reviews.

| Task | Priority | Est. Days |
|------|----------|-----------|
| Smart matching (AI) integration | P2 | 5 |
| AI listing quality score | P2 | 3 |
| AI content generation (descriptions, area guides) | P2 | 3 |
| Neighbourhood data integration | P2 | 5 |
| Commute time calculator | P2 | 3 |
| Viewing scheduler | P2 | 4 |
| Application tracking system | P2 | 5 |
| Reviews & ratings system | P2 | 4 |
| Agent org management + bulk upload | P2 | 4 |
| Tenant vetting tools | P2 | 3 |
| RTB registration verification | P2 | 3 |
| Virtual tours / video support | P2 | 3 |
| PWA setup | P2 | 2 |
| Push notifications | P2 | 2 |
| Market reports (monthly) | P2 | 3 |
| Blog/CMS setup | P2 | 2 |
| **Total** | | **~54 days** |

### Phase 4: Future (Month 7+)
- Native iOS/Android apps
- Multi-language support
- Deposit escrow
- Mortgage/insurance partnerships
- Open data API
- Northern Ireland / UK expansion
- Corporate relocation packages

---

## 9. Metrics & KPIs

### North Star Metric
**Monthly Active Enquiries** — the number of messages sent from tenants to landlords per month. This captures both supply (listings worth enquiring about) and demand (tenants using the platform).

### Launch Targets (End of Phase 1, ~Week 8)

| Metric | Target |
|--------|--------|
| Active listings | 100+ |
| Registered users | 500+ |
| Verified landlords | 20+ |
| Monthly enquiries | 200+ |
| Avg response time | < 48 hours |
| Reported scam rate | < 3% of listings |

### Month 3 Targets

| Metric | Target |
|--------|--------|
| Active listings | 500+ |
| Registered users | 5,000+ |
| MAU | 2,000+ |
| Verified landlords | 50+ |
| Monthly enquiries | 1,000+ |
| Trustpilot rating | > 4.0/5 |
| Avg response time | < 24 hours |

### Month 6 Targets

| Metric | Target |
|--------|--------|
| Active listings | 2,000+ |
| Registered users | 25,000+ |
| MAU | 10,000+ |
| Verified landlords | 200+ |
| Agent subscribers | 30+ |
| MRR | €25,000+ |
| App downloads | 5,000+ |
| Media mentions | 3+ national outlets |

### Month 12 Targets

| Metric | Target |
|--------|--------|
| Active listings | 5,000+ |
| Registered users | 75,000+ |
| MAU | 40,000+ |
| Verified landlords | 500+ |
| Agent subscribers | 100+ |
| MRR | €115,000+ |
| Trustpilot rating | > 4.0/5 |
| Organic traffic | 100,000/month |

### Key Ratios to Monitor

| Ratio | Healthy Range | Why |
|-------|---------------|-----|
| Enquiry-to-listing | > 5 enquiries/listing | Shows demand exists |
| Response rate | > 70% | Core differentiator vs Daft |
| Search-to-enquiry | > 5% | Listing quality & relevance |
| Registration-to-active | > 30% | Onboarding quality |
| Free-to-premium conversion | 10–20% | Revenue health |
| Listing freshness (% < 14 days) | > 85% | Trust & data quality |
| Scam report rate | < 1% | Safety |

---

## 10. Content Strategy

### The Vanity Metrics Problem

**Current state:** The homepage displays:
- "2,000+ Verified Listings" — **Actual: 12 sample listings**
- "500+ Verified Landlords" — **Actual: 0 verified landlords**

These are hardcoded at lines 148-149 of `src/app/page.tsx`:
```tsx
{ num: "2,000+", label: "Verified Listings" },
{ num: "500+", label: "Verified Landlords" },
```

**This is unacceptable.** A platform built on trust cannot launch with fake metrics. This is exactly the kind of deceptive practice we criticize Daft for.

### Resolution: Three Options

#### Option A: Remove Vanity Metrics (Recommended for Now)
Replace the stats section with value-proposition messaging instead:
- "Every Landlord Verified" (aspiration, not a number)
- "Free to List" (differentiator)
- "Messages That Actually Work" (differentiator)

This is honest and differentiating. Implement immediately.

#### Option B: Show Real Metrics (When Meaningful)
Once the platform has real data (50+ listings, 10+ verified landlords), show real numbers:
- "47 Verified Listings" — honesty builds trust
- "12 Verified Landlords" — small numbers with "Verified" label feel trustworthy
- Add "and growing" suffix

Show real metrics only when they're impressive enough to be social proof (100+ listings minimum).

#### Option C: Replace with User Testimonials
After beta, replace stats with real user quotes:
- "First platform where every listing was real" — Beta user
- "Response within 2 hours" — Beta tenant

**Recommendation:** Implement Option A immediately. Transition to Option B when metrics are meaningful. Add Option C testimonials post-beta.

### Content Seeding Strategy

**Problem:** An empty marketplace is useless. We need listings before tenants arrive, and tenants before landlords list.

**Strategy: Supply-first, authenticity-always.**

#### Phase 0: Pre-Launch (Weeks 1–4)
1. **Personal outreach to 50 Dublin landlords** via Facebook property groups, Reddit r/Dublin, Boards.ie property forum. Offer "Founding Landlord" status: free premium listings for 6 months, permanent verified badge, priority feature requests.
2. **Contact 20 small/medium Dublin letting agents** directly. Offer 3 months free Professional plan (€199/month value). Personalized demo.
3. **University accommodation offices** (TCD, UCD, DCU) — partner to list student-friendly properties.
4. **Create area guides** for Dublin neighbourhoods (real content, not fake listings). These drive SEO traffic and give the site substance even with few listings.

#### Phase 1: Beta Launch (Weeks 5–8)
5. **Target: 100+ real listings** before public announcement.
6. **Beta invite 200 tenants** from Reddit/Twitter/university contacts.
7. **"List on Gaff for Free" campaign** — target landlords who publicly complain about Daft pricing on social media.

#### What We Will NOT Do
- ❌ Scrape Daft listings and repost them (legal liability, trust violation)
- ❌ Create fake listings to pad numbers (defeats our entire value proposition)
- ❌ Display misleading metrics (see Vanity Metrics section above)
- ❌ Pay for fake reviews or testimonials

### Content Types & Calendar

| Content Type | Frequency | Owner | Purpose |
|-------------|-----------|-------|---------|
| Area guides (Dublin neighbourhoods) | 2/week during Phase 1, then monthly | AI-generated, human-reviewed | SEO, useful content |
| Tenant guides ("How to rent in Ireland") | Monthly | Content writer | SEO, trust |
| Landlord guides ("Legal obligations") | Monthly | Content + legal review | SEO, attract landlords |
| Market report | Monthly (from Phase 2) | Data + content | Authority, media coverage |
| Product updates | Bi-weekly | Product team | Transparency |
| Social media (X, TikTok, Reddit) | Daily | Marketing | Awareness, community |

### HAP Information Hub

A dedicated section explaining HAP (Housing Assistance Payment) for both tenants and landlords:
- What is HAP and how does it work
- How to apply (step-by-step)
- Landlord benefits of accepting HAP
- HAP rates by local authority
- Common misconceptions

This serves an underserved audience (~60,000 HAP households) and could attract government/NGO partnership.

---

## Appendix A: Daft.ie Problems → Gaff.ie Solutions

| # | Daft Problem (from Research) | Gaff Solution | Feature ID |
|---|------------------------------|---------------|------------|
| 1 | No verification — anyone can post | Mandatory landlord ID verification | F050 |
| 2 | Broken messaging — landlords can't reply | Working in-app messaging with read receipts | F040 |
| 3 | No customer support | Live chat, 4-hour email SLA | F110 |
| 4 | Stale listings (months old, still shown) | 30-day auto-expiry, mandatory status updates | F023 |
| 5 | €135–999 listing fees | Free basic listings | F062 |
| 6 | No application tracking | Application pipeline for tenants + landlords | F093 |
| 7 | Rampant scams | AI scam detection + verification-first | F053 |
| 8 | Intrusive ads, poor UX | Clean, fast, ad-free design | F120, F122 |
| 9 | No neighbourhood data | Schools, transport, amenities | F081 |
| 10 | No tenant screening for landlords | Verified tenant profiles, references | F051, F093 |
| 11 | No HAP filter | HAP-friendly badge and filter | F030 |
| 12 | Only "updated" date, not original listing date | Original listing date always visible | F023 |
| 13 | Fake hit counts / engagement | Real, transparent analytics | F130 |
| 14 | Payment system issues | Stripe (industry standard, Irish company) | F060 |
| 15 | No ratings or reviews | Two-way post-tenancy reviews | F055 |

---

## Appendix B: Technology Stack Summary

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 16 (App Router) | SSR for SEO, React ecosystem |
| Language | TypeScript | Type safety across stack |
| Styling | Tailwind CSS | Rapid development, consistent design |
| Components | Radix UI / shadcn | Accessible primitives |
| Database | PostgreSQL (Prisma ORM) | PostGIS for geo, full-text search |
| Auth | JWT cookies (custom) | Simple, stateless |
| File Storage | Cloudflare R2 or AWS S3 | Cheap, CDN-integrated |
| Payments | Stripe | SCA compliant, Irish company |
| Email | Resend | Reliable, good DX |
| Maps | MapLibre GL + OpenStreetMap | Free, no Google Maps costs |
| Search (P2) | Meilisearch | Fast, typo-tolerant, self-hosted |
| Analytics | PostHog | Privacy-first, self-hostable |
| Hosting | Coolify on Hetzner VPS | Current setup, cost-effective |
| CI/CD | GitHub Actions | Standard, free tier |
| Monitoring | Sentry | Error tracking |
| Verification | Stripe Identity | Integrated with payments |

---

*This PRD is a living document. Review and update bi-weekly. Feature priorities may shift based on user feedback and market conditions.*

**Document Owner:** Product Team  
**Last Review:** 25 March 2026  
**Next Review:** 8 April 2026
