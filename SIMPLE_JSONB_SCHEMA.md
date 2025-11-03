# Dead Simple JSONB Schema

> Keep it simple. Add complexity only when it hurts.

---

## Philosophy

**For 100-200 users:**
- JSONB is plenty fast
- No migrations needed
- Claude can build visualizations
- Add structure later if needed (probably never)

---

## The Entire Schema (3 Tables)

```sql
-- Stories (everything in JSONB)
CREATE TABLE stories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE NOT NULL,
  story_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Story pages (minimal structure)
CREATE TABLE story_pages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id uuid REFERENCES stories(id) ON DELETE CASCADE,
  page_number integer NOT NULL,
  page_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(story_id, page_number)
);

-- Playlists (everything in JSONB)
CREATE TABLE playlists (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE NOT NULL,
  playlist_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);
```

**That's it!** 3 tables. No complexity.

---

## What Goes in JSONB

### story_data:
```json
{
  "title": "Bunny Finds Courage",
  "subtitle": "A tale of bravery",
  "author": "PlayfulProcess",
  "cover_image_url": "/stories/bunny/cover.jpg",
  "visibility": "private",
  "published": false,
  "creator_id": "user-uuid",
  "metadata": {
    "themes": ["courage", "kindness"],
    "reading_level": "early-reader",
    "age_range": "3-6"
  }
}
```

### page_data:
```json
{
  "image_url": "/stories/bunny/page-1.jpg",
  "alt_text": "Bunny sitting under a tree",
  "narration": "Once upon a time..."
}
```

### playlist_data:
```json
{
  "title": "Calming Bedtime Videos",
  "description": "Gentle videos for winding down",
  "cover_url": "/playlists/bedtime/cover.jpg",
  "visibility": "public",
  "published": true,
  "creator_id": "user-uuid",
  "items": [
    {
      "position": 1,
      "video_provider": "youtube",
      "video_id": "abc123",
      "title": "Gentle Rain Sounds",
      "notes": "10 minutes of calming rain"
    }
  ]
}
```

---

## Queries (Still Clean Enough)

### Get my stories:
```typescript
const { data } = await supabase
  .from('stories')
  .select('*')
  .eq('story_data->>creator_id', userId);
```

### Get public published stories:
```typescript
const { data } = await supabase
  .from('stories')
  .select('*')
  .eq('story_data->>visibility', 'public')
  .eq('story_data->>published', 'true');
```

### Get story with pages:
```typescript
const { data } = await supabase
  .from('stories')
  .select(`
    *,
    story_pages (*)
  `)
  .eq('slug', 'bunny-finds-courage')
  .single();
```

**Good enough for 200 users!**

---

## Row Level Security (Still Works)

```sql
-- Stories: Public can read public stories, owners can do everything
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public published stories"
  ON stories FOR SELECT
  USING (
    story_data->>'visibility' = 'public'
    AND story_data->>'published' = 'true'
  );

CREATE POLICY "Users can view their own stories"
  ON stories FOR SELECT
  USING (story_data->>'creator_id' = auth.uid()::text);

CREATE POLICY "Users can create stories"
  ON stories FOR INSERT
  WITH CHECK (story_data->>'creator_id' = auth.uid()::text);

CREATE POLICY "Users can update their own stories"
  ON stories FOR UPDATE
  USING (story_data->>'creator_id' = auth.uid()::text);

CREATE POLICY "Users can delete their own stories"
  ON stories FOR DELETE
  USING (story_data->>'creator_id' = auth.uid()::text);

-- Story pages follow parent story
ALTER TABLE story_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Story pages visible to story viewers"
  ON story_pages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = story_pages.story_id
      AND (
        (story_data->>'visibility' = 'public' AND story_data->>'published' = 'true')
        OR story_data->>'creator_id' = auth.uid()::text
      )
    )
  );

CREATE POLICY "Users can manage their story pages"
  ON story_pages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = story_pages.story_id
      AND story_data->>'creator_id' = auth.uid()::text
    )
  );
```

**Security still works, just with JSONB syntax.**

---

## Admin Visualizations (Claude Will Build)

### I Can Build You:

**1. Admin Dashboard:**
```typescript
// src/app/admin/dashboard/page.tsx
// Shows:
// - Total stories/playlists
// - Published vs private
// - Recent activity
// - User breakdown
```

**2. Data Explorer:**
```typescript
// src/app/admin/explore/page.tsx
// Interactive table with filters:
// - Search stories by title
// - Filter by visibility/published
// - Sort by created_at
// - Click to view full JSONB
```

**3. User Activity:**
```typescript
// src/app/admin/users/page.tsx
// Shows:
// - Who created what
// - When they created it
// - Published vs draft counts
```

**4. Export Tools:**
```typescript
// src/app/admin/export/page.tsx
// Download as JSON/CSV
// Backup data
// Generate reports
```

**You won't miss Supabase Studio. I'll build you better tools.**

---

## When to Add Structure

### Only add columns/tables when:

1. **Performance hurts** (it won't at 200 users)
2. **Queries are everywhere** (you said you won't query much)
3. **Supabase Studio is critical** (Claude builds dashboards for you)

**Prediction:** You'll never need to migrate.

---

## Benefits for You

✅ **Zero complexity** - 3 simple tables
✅ **No migrations** - Change JSONB anytime
✅ **Fast iteration** - Ship features, don't plan schema
✅ **Claude builds viz** - Custom dashboards > generic Studio
✅ **Same pattern as channels** - Copy what works
✅ **Future-proof** - Can add structure later (but won't need to)

---

## Action Plan

### Phase 0: Auth (Current)
- Build dual auth (magic link + OTP)
- Use this schema: 3 tables, full JSONB

### Phase 1: Stories
- Create stories table
- No overthinking
- Build features fast

### Phase 2: Playlists
- Create playlists table
- Keep it simple

### Phase 3: Admin Tools
- Claude builds visualization dashboards
- Better than Supabase Studio
- Customized for your needs

### Phase 999: Maybe Migrate (Probably Never)
- If you hit 10,000+ users
- If performance actually hurts
- If complex queries are needed
- **Prediction: You'll never reach this phase**

---

## Comparison

| Your Scale | JSONB | Relational |
|------------|-------|------------|
| 200 users | ✅ Perfect | ❌ Overkill |
| 2,000 stories | ✅ Fast | ❌ Unnecessary |
| Rare queries | ✅ Good enough | ❌ Wasted effort |
| Solo dev | ✅ Easy | ❌ Complex |
| Claude helps | ✅ Builds tools | ❌ Still complex |

**Winner:** Full JSONB

---

## The Schema (Copy-Paste Ready)

```sql
-- Stories
CREATE TABLE stories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE NOT NULL,
  story_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_stories_creator ON stories ((story_data->>'creator_id'));
CREATE INDEX idx_stories_visibility ON stories ((story_data->>'visibility'));

-- Story pages
CREATE TABLE story_pages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id uuid REFERENCES stories(id) ON DELETE CASCADE,
  page_number integer NOT NULL,
  page_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(story_id, page_number)
);

-- Playlists
CREATE TABLE playlists (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE NOT NULL,
  playlist_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_playlists_creator ON playlists ((playlist_data->>'creator_id'));

-- RLS policies (shown above)
```

**Total complexity:** Low
**Total tables:** 3
**Total migrations needed:** 0 (after initial setup)

---

## Bottom Line

**Your instinct is correct:**
- Full JSONB for your scale
- Let Claude build visualizations
- Keep it dead simple
- Move fast

**Stop overthinking. Start building.** 🚀
