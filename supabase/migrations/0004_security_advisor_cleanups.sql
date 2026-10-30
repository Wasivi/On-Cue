-- On-Cue — Security Advisor cleanups
-- Runs once, after 0001, 0002, and 0003.
--
-- Two small fixes Supabase's Security Advisor asked for. Neither changes
-- what anyone can see or do in the app.
--
-- auth_role() looked up `profiles` by its bare name, so it depended on the
-- caller's search path. Every name is now written in full and the search
-- path is pinned empty.
--
-- rls_auto_enable() turns on access rules for each new table. It isn't from
-- these setup files; it matches Supabase's documented recipe, and its
-- ensure_rls event trigger stays. The database fires that trigger itself,
-- so nobody needs to call the function directly. This removes the default
-- permission that let outside callers try.
--
-- To undo:
--   create or replace function public.auth_role() returns public.app_role
--   language sql stable as $$ select role from profiles where id = auth.uid() $$;
--   grant execute on function public.rls_auto_enable() to public, anon, authenticated;

create or replace function public.auth_role() returns public.app_role
language sql stable
set search_path = ''
as $$
  select role from public.profiles where id = auth.uid()
$$;

revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
