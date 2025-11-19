-- Migration: Add public read access for published sequences
-- Date: 2025-11-18
-- Purpose: Allow anyone to view published sequences at recursive.eco/view/{id}
-- Based on Supabase AI recommendations

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "public_view_published_sequences" ON public.user_documents;

-- Create policy for public read access to published sequences
-- TO anon: restricts to anonymous/public users only
-- Checks both is_public column AND document_data.is_published for safety
CREATE POLICY "public_view_published_sequences"
  ON public.user_documents
  FOR SELECT
  TO anon
  USING (
    tool_slug = 'sequence'
    AND is_public = true
    AND (document_data->>'is_published') = 'true'
  );

-- Verify the policy was created
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'user_documents'
  AND policyname = 'public_view_published_sequences';
