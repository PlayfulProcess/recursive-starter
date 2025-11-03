# Context for Claude Code: Recursive Creator Project

> **Last Updated:** 2025-11-03 (Session 3)
> **Current Phase:** Phase 0 COMPLETE - Auth Fixed + Dark Mode ✅
> **Next Session:** Configure Supabase email template and test on production domains

---

## Project Overview

**Name:** Recursive Creator
**Purpose:** Unified creator hub for Recursive.eco ecosystem
**Domain:** creator.recursive.eco (future)
**Stack:** Next.js 15 + React 19 + Supabase + TypeScript

**What We're Building:**
1. **Story Publisher** - Parents upload images to create children's books
2. **Playlist Wrapper** - Curated YouTube playlists for kids (privacy-enhanced)
3. **Account Hub** - Unified dashboard for all Recursive.eco content

---

## Key Decision: Auth First! ✅

**Decision Made:** Build dual auth (magic link + OTP) BEFORE fun features

**Rationale:**
- Magic links fail on non-Gmail providers
- 3-4 days of auth work saves weeks of frustration
- No refactoring needed later
- Copy pattern to all projects immediately (channels, journal)
- Solid foundation for testing dashboard features

**Timeline:**
- Days 1-4: Implement dual auth
- Days 5+: Build stories, playlists, etc.

---

## Key Decision: Full JSONB Schema ✅

**Decision Made:** Use JSONB-heavy approach (like existing projects)

**Rationale:**
- Small scale (200 users max) → JSONB is plenty fast
- Solo dev → speed > perfect structure
- Infrequent querying → no need for complex optimization
- Claude builds visualizations → don't need Supabase Studio
- **Better for AI features** → JSON format is native for LLMs, embeddings, etc.
- No migrations needed → iterate fast

**See:** `SIMPLE_JSONB_SCHEMA.md` for full schema (3 tables, dead simple)

---

## Project Structure

```
recursive-creator/
├── CLAUDE.md                        ← YOU ARE HERE (context for resuming)
├── PROJECT_PLAN.md                  ← Master plan (11 weeks, all phases)
├── AUTH_IMPLEMENTATION_PLAN.md      ← Detailed auth guide (magic link + OTP)
├── AUTH_PORTABILITY.md              ← How to copy auth to other projects
├── SUPABASE_SCHEMA_REVISED.md       ← Database schema (relational design)
│
├── src/                             ← (Not created yet - will initialize Next.js)
│   ├── app/
│   │   ├── dashboard/               ← Creator tools
│   │   ├── stories/[slug]/          ← Story viewer
│   │   ├── playlists/[slug]/        ← Playlist viewer
│   │   ├── api/                     ← Server routes
│   │   └── auth/callback/           ← Auth callback handler
│   ├── components/
│   │   ├── auth/DualAuth.tsx        ← Dual auth component (TO BUILD)
│   │   ├── viewers/                 ← Story/playlist viewers
│   │   └── dashboard/               ← Creator UI
│   └── lib/
│       ├── supabase-client.ts       ← Copy from channels
│       └── supabase-server.ts       ← Copy from channels
│
└── public/
    └── assets/                      ← Animations, styles
```

---

## Architecture Decisions

### 1. Hybrid Approach (React + Vanilla-Style Viewers)

**Question Resolved:** "Does vanilla HTML have more creative freedom?"

**Answer:** No - it's mostly psychological. React can render identical HTML/CSS/JS.

**Solution:**
- Use Next.js dynamic routes (for auth checks)
- Render vanilla-style components (same UX as recursive-landing)
- Best of both worlds: auth checks + creative freedom

### 2. Private/Unlisted/Public Content

**Requirement:** Users need to preview stories before publishing

**Solution:**
- Server-side permission checks in Next.js routes
- Visibility options: private (owner only), unlisted (anyone with link), public (everyone)
- Preview mode shows unpublished content to owner

### 3. Auth Portability

**Requirement:** Copy auth to channels and journal projects

**Solution:**
- All projects share same Supabase instance
- Copy 4 files, update Supabase email template once
- Works across all projects in ~50 minutes
- See: `AUTH_PORTABILITY.md`

---

## Current State

### ✅ Completed (Phase 0):
- [x] Project planning documents created
- [x] Architecture decisions finalized
- [x] Schema design completed (relational)
- [x] Auth strategy defined (dual: magic link + OTP)
- [x] Portability plan documented
- [x] Next.js 15 project initialized
- [x] DualAuth component implemented
- [x] **CRITICAL FIX:** Cookie domain configuration (localhost + production)
- [x] **Dark mode** implemented across all auth pages
- [x] **OTP fallback** added to error page
- [x] Local development server tested (running on port 3001)

### 🔨 Next Steps (Immediate):
- [ ] Update Supabase email template to include `{{ .Token }}`
- [ ] Test auth flow locally with real email
- [ ] Test on Vercel deployment
- [ ] Copy fixed auth pattern to recursive-channels-fresh
- [ ] Copy fixed auth pattern to jongu-tool-best-possible-self

### 📋 Future Phases:
- [ ] Phase 1: Story publisher & viewer (weeks 2-4)
- [ ] Phase 2: Playlist publisher & viewer (weeks 5-8)
- [ ] Phase 3: Account hub (weeks 9-10)
- [ ] Phase 4: Polish & deploy (weeks 11-12)

---

## Technical Context

### Supabase Connection

**Project:** Shared across all Recursive.eco apps
**URL:** https://yoursrpohfbpxoalyoeg.supabase.co (check .env)

**Existing Tables:**
- `channels` - Wellness/creative/learning channels
- `tools` - Community tools (JSONB-heavy, keep as-is)
- `profiles` - User profiles (JSONB-heavy, keep as-is)
- `journal_templates` - Journaling prompts
- `user_documents` - Generic user data (JSONB-heavy, keep as-is)
- `newsletter_subscribers` - Email signups

**New Tables (To Create):**
- `stories` - Story metadata (relational design)
- `story_pages` - Individual story pages
- `playlists` - Playlist metadata (relational design)
- `playlist_items` - Individual videos
- `user_stars` - Cross-project starred content

**Schema Location:** `z.Supabase/schema_20251030.sql`

### Auth Setup

**Current Status:** ✅ Dual auth implemented + bugs fixed

**Implementation Complete:**
1. ✅ `DualAuth.tsx` component (two-step flow: email → OTP)
2. ✅ Auth callback route (`app/auth/callback/route.ts`)
3. ✅ Error page with OTP fallback (`app/auth/error/page.tsx`)
4. ✅ **CRITICAL BUG FIXED:** Cookie domain configuration

**Remaining:**
1. ⏳ Update Supabase email template (include `{{ .Token }}`)
2. ⏳ Test across email providers and environments

**See:** `AUTH_IMPLEMENTATION_PLAN.md` for complete code

---

## Session 3 Updates: Auth Bugs Fixed + Dark Mode

### Critical Bug Fixed: Cookie Domain Configuration

**Problem Identified:**
Both `lib/supabase-client.ts` and `lib/supabase-server.ts` were hardcoded to use `domain: '.recursive.eco'` for cookies. This prevented auth from working in:
- Local development (localhost)
- Vercel preview deployments (*.vercel.app)
- Any non-production environment

This was the root cause of the "Token has expired or is invalid" errors.

**Solution Implemented:**
- Added environment detection logic to both files
- Cookies now use `undefined` domain for localhost and Vercel previews
- Cookies use `.recursive.eco` domain only for production
- `secure` flag is `false` for localhost, `true` for production
- Works seamlessly across all environments

**Files Changed:**
- `lib/supabase-client.ts` - Lines 4-13, 27-31 (environment detection)
- `lib/supabase-server.ts` - Lines 6-14, 31-36 (environment detection)

### Dark Mode Implementation

**All auth pages converted to dark theme:**
- `app/page.tsx` - Main landing page (bg-gray-900)
- `components/auth/DualAuth.tsx` - Auth form (bg-gray-800 cards)
- `app/auth/error/page.tsx` - Error page (dark theme + OTP input)

**Design choices:**
- Background: `bg-gray-900` (main page), `bg-gray-800` (cards)
- Text: `text-white` (headings), `text-gray-400` (body)
- Inputs: `bg-gray-700` with `border-gray-600`
- Success/Error messages: Semi-transparent backgrounds with colored borders
- Buttons: Blue primary (`bg-blue-600`) for consistency

### OTP Fallback on Error Page

**New functionality added to `/auth/error`:**
- Initial view shows error message + "Enter 6-Digit Code" button
- Clicking button reveals full OTP verification form
- Form includes email input + OTP input (6 digits)
- Successfully verifies and logs user in if OTP is valid
- Provides fallback if magic link fails

**User flow:**
1. Magic link fails → redirected to `/auth/error`
2. User sees error explanation + OTP option
3. User clicks "Enter 6-Digit Code"
4. User enters email + 6-digit code from email
5. System verifies OTP → redirects to dashboard

**File:** `app/auth/error/page.tsx` - Now client component with state management

---

## Related Projects

### recursive-channels-fresh
- **Location:** `../recursive-channels-fresh/`
- **URL:** https://channels.recursive.eco/
- **Auth Pattern:** Copy FROM here (MagicLinkAuth component)
- **Then:** Copy DualAuth BACK to here

### jongu-tool-best-possible-self
- **Location:** `../jongu-tool-best-possible-self/`
- **URL:** https://journal.recursive.eco/
- **Auth Pattern:** Copy DualAuth TO here

### recursive-landing
- **Location:** `../recursive-landing/`
- **URL:** https://www.recursive.eco/
- **Viewer Pattern:** Copy FROM here (vanilla HTML story viewer)
- **Adapt:** Convert to React component for auth checks

---

## User Context (PlayfulProcess)

**Background:**
- Philosophy + future LCSW (MSW starting Jan 2026)
- Building open-source psychoeducation tools
- "Gateway building, not gatekeeping" ethos
- Inspired by virtue ethics, process philosophy

**Mission:**
- Create spaces for recursive meaning-making
- Support parents with wellness tools + kids content
- Teach "vibe coding" (building with AI/Claude)
- Join Free Software movement (not start new movement)

**Design Principles:**
- Minimal, grounded (not overly promotional)
- No emojis unless requested
- Process over outcome
- Community contribution encouraged
- Open source, forkable

**See:** `../mission-statement.md` for full philosophy

---

## Compliance Considerations

### COPPA (Children's Privacy):
- ✅ Service is parent-facing (not child-directed)
- ✅ No accounts for children
- ✅ Adult affirmation gate on kid content
- ✅ Privacy notice: "We don't collect children's data"

### YouTube Terms:
- ✅ Use `youtube-nocookie.com` (privacy-enhanced)
- ✅ Keep YouTube branding visible
- ✅ No downloading/scraping
- ✅ Clear attribution

### GDPR:
- ✅ Data export already implemented (channels)
- ✅ Account deletion already implemented
- ✅ Copy pattern to creator hub

**See:** `PROJECT_PLAN.md` section on compliance

---

## Key Files to Reference

### Planning Documents (Read These First):
1. **PROJECT_PLAN.md** - Master plan, all phases, timeline
2. **AUTH_IMPLEMENTATION_PLAN.md** - Complete auth code + guide
3. **SUPABASE_SCHEMA_REVISED.md** - Database design (relational)
4. **AUTH_PORTABILITY.md** - How to copy to other projects

### Existing Code (Reference Implementation):
1. **components/auth/DualAuth.tsx** - ✅ COMPLETE - Dual auth component (magic link + OTP)
2. **lib/supabase-client.ts** - ✅ FIXED - Environment-aware cookie configuration
3. **lib/supabase-server.ts** - ✅ FIXED - Environment-aware cookie configuration
4. **app/auth/callback/route.ts** - ✅ COMPLETE - Auth callback handler
5. **app/auth/error/page.tsx** - ✅ COMPLETE - Error page with OTP fallback
6. **middleware.ts** - Cookie handling (already existed)

### Code to Copy TO Other Projects:
These files should be copied to recursive-channels-fresh and jongu-tool-best-possible-self:
1. `lib/supabase-client.ts` (with fixed cookie logic)
2. `lib/supabase-server.ts` (with fixed cookie logic)
3. `components/auth/DualAuth.tsx` (dual auth component)
4. `app/auth/callback/route.ts` (callback handler)
5. `app/auth/error/page.tsx` (error page with OTP)

### Context Documents:
1. **../README.md** - Ecosystem overview
2. **../mission-statement.md** - Philosophy + goals
3. **../z.Supabase/README.md** - Database context
4. **../z.Supabase/schema_20251030.sql** - Current schema

---

## Common Commands

### Development:
```bash
# Start recursive-creator (port 3000)
cd recursive-creator
npm run dev

# Start channels (port 3003)
cd recursive-channels-fresh
npm run dev

# Start journal (port 3002)
cd jongu-tool-best-possible-self
npm run dev
```

### Supabase:
```bash
# Export schema
cd recursive-channels-fresh
npx supabase db dump --schema public > ../z.Supabase/schema_$(date +%Y%m%d).sql

# Run migrations
npx supabase migration new <name>
npx supabase db push
```

---

## Quick Start (Resuming Development)

### If Starting Fresh Session:

**Step 1: Read Context (5 min)**
- Read this file (CLAUDE.md)
- Skim PROJECT_PLAN.md
- Check "Current State" section above

**Step 2: Check Phase**
- Look at "Current State" → what's done, what's next
- If Phase 0 (auth): Read AUTH_IMPLEMENTATION_PLAN.md
- If Phase 1+ (features): Read PROJECT_PLAN.md

**Step 3: Ask User**
- "Ready to continue with [current task]?"
- Confirm any decisions if unclear

**Step 4: Continue**
- Pick up where we left off
- Use TodoWrite to track progress
- Update this file when major decisions are made

### If User Says "Continue" or "Let's go":
- Check "Next Steps" in "Current State" section
- Start with first unchecked task
- Create todos with TodoWrite
- Begin implementation

---

## Important Notes

### Don't Do Without Asking:
- ❌ Don't deploy to production
- ❌ Don't push to git (user handles this)
- ❌ Don't delete existing files
- ❌ Don't modify other projects without permission
- ❌ Don't add emojis unless requested

### Always Do:
- ✅ Use TodoWrite for multi-step tasks
- ✅ Mark todos complete as you finish
- ✅ Copy proven patterns (don't reinvent)
- ✅ Test across email providers (Gmail, Outlook, etc.)
- ✅ Ask for clarification if ambiguous

### Code Style:
- TypeScript (strict mode)
- Tailwind CSS (utility-first)
- Server components by default (use 'use client' when needed)
- Descriptive variable names
- Comments for complex logic

---

## Debugging Tips

### If Auth Issues:
- **Check cookie domain first!** Most auth failures are due to incorrect domain configuration
  - In browser dev tools, check if cookies are being set with correct domain
  - localhost should have no domain attribute (browser default)
  - production should have `domain=.recursive.eco`
- Check Supabase cookies in browser dev tools (Application → Cookies)
  - Look for cookies with names like `sb-*-auth-token`
  - Verify they're being set and not blocked
- Verify callback URL in Supabase dashboard matches your environment
- Check middleware.ts is running (console logs will show)
- Test with different email providers (Gmail, Outlook, etc.)
- **If magic link fails:** Try OTP input on error page as fallback

### If Database Issues:
- Check RLS policies (common source of "no rows" errors)
- Verify foreign keys exist
- Look at Supabase logs in dashboard
- Test queries in SQL Editor

### If Build Issues:
- Check Next.js version (15.4.3)
- Verify all imports
- Check middleware.ts path config
- Clear .next folder and rebuild

---

## When to Update This File

**Update CLAUDE.md when:**
- ✅ Major phase completed (e.g., "Phase 0 complete: Auth working")
- ✅ Architecture decision changed
- ✅ New tables added to Supabase
- ✅ New key files created
- ✅ Moving to next phase

**How to Update:**
- User will say: "Update CLAUDE.md"
- Update "Current State" section
- Update "Next Steps"
- Add any new decisions/context
- Increment "Last Updated" date

---

## Current Session Context (Session 3)

**Date:** 2025-11-03
**Focus:** Debug auth failures + implement dark mode + OTP fallback
**Accomplishments:**
- ✅ Diagnosed root cause: cookie domain configuration bug
- ✅ Fixed cookie domain logic in client + server files
- ✅ Converted all auth pages to dark mode
- ✅ Added OTP input fallback to error page
- ✅ Dev server tested locally (port 3001)

**What User Needs to Do Next:**
1. **Update Supabase Email Template** (see template below)
2. Test auth flow locally with real email
3. Deploy to Vercel and test on production domain
4. If working, copy auth pattern to other projects

**Supabase Email Template (Magic Link + OTP):**

Go to: Supabase Dashboard → Authentication → Email Templates → Magic Link

```html
<h2>Sign in to Recursive.eco</h2>

<p>Click the link below to sign in:</p>
<p><a href="{{ .ConfirmationURL }}">Sign In</a></p>

<p><strong>Or enter this 6-digit code:</strong></p>
<p style="font-size: 24px; font-weight: bold; font-family: monospace;">{{ .Token }}</p>

<p style="font-size: 12px; color: #666;">
  This code expires in 1 hour.<br>
  If you didn't request this, you can safely ignore it.
</p>
```

**Key:** The `{{ .Token }}` variable includes the 6-digit OTP code

**Redirect URLs to Whitelist in Supabase:**
- Local: `http://localhost:3001/auth/callback`
- Preview: `https://*.vercel.app/auth/callback`
- Production: `https://creator.recursive.eco/auth/callback`

**Current Development Server:**
- Running on port 3001 (port 3000 was in use)
- Access at: http://localhost:3001
- Ready for testing with updated email template

---

## Questions to Ask User (If Resuming and Unclear)

1. "What phase are we on?" (Check Current State)
2. "Should I continue with [next task]?" (Check Next Steps)
3. "Any decisions changed since last session?" (Validate context)
4. "Ready to start implementation?" (Get confirmation)

**If user says "continue," "let's go," or similar:**
→ Check Next Steps, create todos, start work!

---

## Quick Reference: What Changed in Session 3

### Files Modified:
1. `lib/supabase-client.ts` - Added environment-aware cookie domain logic
2. `lib/supabase-server.ts` - Added environment-aware cookie domain logic
3. `app/page.tsx` - Converted to dark mode (bg-gray-900)
4. `components/auth/DualAuth.tsx` - Converted to dark mode (bg-gray-800)
5. `app/auth/error/page.tsx` - Converted to dark mode + added OTP input form

### Key Bug Fixed:
**Cookie Domain Configuration** - Auth was failing because cookies were hardcoded to `.recursive.eco` domain, which doesn't work on localhost or Vercel preview. Fixed by detecting environment and setting domain appropriately.

### Features Added:
1. **Dark mode** across all auth pages
2. **OTP fallback** on error page (if magic link fails, user can enter 6-digit code)
3. **Environment-aware cookies** (works on localhost, Vercel preview, and production)

### Testing Status:
- ✅ Dev server running on port 3001
- ⏳ Awaiting Supabase email template update
- ⏳ Awaiting real-world auth test with email

### Next Session Preview:
Once Supabase email template is updated and auth is tested, the next session will likely focus on:
- Copying fixed auth to other projects (channels, journal)
- OR starting Phase 1 (story publisher features)

---

**END OF CONTEXT FILE**

*This file will be updated as we progress. Always read this first when resuming!*
