-- On-Cue — lock profile roles
-- Run once in the Supabase SQL Editor, after 0001 and 0002.
--
-- 0001 let any signed-in user insert their own profile with any role, and
-- change the role on their own profile row. That let a person make
-- themselves 1st AD or UPM, which undoes every role check in the database.
-- Roles are assigned by the production office, never by the person
-- (docs/GOVERNANCE-MODEL.md Section 4), so profiles are created by the
-- production office's provisioning (server side), and a person may change
-- only their own display name.

drop policy if exists "users can insert own profile" on profiles;
drop policy if exists "users can update own profile" on profiles;

revoke insert, update, delete on profiles from anon, authenticated;
grant update (display_name) on profiles to authenticated;

create policy "users can update own display name" on profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());
