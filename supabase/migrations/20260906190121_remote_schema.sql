SET local check_function_bodies = off;

CREATE TABLE "public"."invites" (
  "list_id"       uuid                     NOT NULL,
  "sender_id"     uuid                     NOT NULL,
  "invitee_email" text                     NOT NULL,
  "created_at"    timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"    timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "invites_pkey" PRIMARY KEY (list_id, invitee_email)
);

ALTER TABLE "public"."invites"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."list_items" (
  "id"         uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "list_id"    uuid                     NOT NULL,
  "text"       text                     NOT NULL DEFAULT 'list item'::text,
  "is_checked" boolean                  NOT NULL DEFAULT false,
  "amount"     numeric,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "position"   numeric,
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "list_items_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."list_items"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."list_members" (
  "list_id"    uuid                     NOT NULL,
  "user_id"    uuid                     NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "list_members_pkey" PRIMARY KEY (list_id, user_id)
);

ALTER TABLE "public"."list_members"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."lists" (
  "id"           uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "created_at"   timestamp with time zone NOT NULL DEFAULT now(),
  "name"         text                     NOT NULL DEFAULT 'untitled list'::text,
  "has_amounts"  boolean                  NOT NULL DEFAULT false,
  "has_checks"   boolean                  NOT NULL DEFAULT false,
  "is_published" boolean                  NOT NULL DEFAULT false,
  "updated_at"   timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "lists_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."lists"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."profiles" (
  "id"         uuid                     NOT NULL,
  "name"       text                     NOT NULL,
  "username"   text                     NOT NULL,
  "avatar_url" text,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "profiles_pkey" PRIMARY KEY (id),
  CONSTRAINT "profiles_username_key" UNIQUE (username)
);

ALTER TABLE "public"."profiles"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."saved_lists" (
  "user_id"    uuid                     NOT NULL,
  "list_id"    uuid                     NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "saved_lists_pkey" PRIMARY KEY (user_id, list_id)
);

ALTER TABLE "public"."saved_lists"
  ENABLE ROW LEVEL SECURITY;

CREATE TYPE "public"."invite_status" AS ENUM (
  'pending',
  'accepted'
);

ALTER TABLE "public"."invites"
  ADD COLUMN "status" public.invite_status NOT NULL DEFAULT 'pending'::public.invite_status;

CREATE TYPE "public"."list_member_role" AS ENUM (
  'owner',
  'viewer',
  'editor'
);

ALTER TABLE "public"."invites"
  ADD COLUMN "invitee_role" public.list_member_role NOT NULL DEFAULT 'editor'::public.list_member_role;

ALTER TABLE "public"."list_members"
  ADD COLUMN "role" public.list_member_role NOT NULL DEFAULT 'viewer'::public.list_member_role;

CREATE TYPE "public"."list_visibility_satus" AS ENUM (
  'public',
  'private'
);

ALTER TABLE "public"."lists"
  ADD COLUMN "visibility" public.list_visibility_satus NOT NULL DEFAULT 'public'::public.list_visibility_satus;

CREATE OR REPLACE FUNCTION public.accept_list_invite (
  input_list_id uuid
)
  RETURNS jsonb
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $function$
declare
    v_user_id uuid;
    v_user_email text;
    v_updated_role list_member_role;
begin
    -- 1. Get the authenticated user's ID and Email from the Supabase auth context
    v_user_id := auth.uid();
    v_user_email := auth.email();

    -- Ensure a user is actually logged in
    if v_user_id is null then
        raise exception 'Not authenticated';
    end if;

    -- 2. Update the invites table and return the role assigned to that invite
    update invites
    set status = 'accepted'
    where list_id = input_list_id
      and invitee_email = v_user_email
      and status = 'pending' -- Optional: ensures they can't re-accept an old invite
    returning invitee_role::list_member_role into v_updated_role;

    -- 3. If no invite was found/updated, throw an error or return failure
    if v_updated_role is null then
        return jsonb_build_object(
            'success', false,
            'message', 'No pending invitation found for this list and user.'
        );
    end if;

    -- 4. Insert the new member into the list_members table
    insert into list_members (list_id, user_id, role)
    values (input_list_id, v_user_id, v_updated_role);

    -- 5. Return a success response
    return jsonb_build_object(
        'success', true,
        'message', 'Successfully accepted invitation and joined the list.'
    );

exception
    when others then
      -- Automatically rolls back all changes if any error occurs during the transaction
      return jsonb_build_object(
          'success', false,
          'message', SQLERRM
      );
end;
$function$;

CREATE OR REPLACE FUNCTION public.check_if_email_exists (
  email_to_check text
)
  RETURNS boolean
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
declare
  email_exists boolean;
begin
  select exists (
    select 1 from auth.users where email = email_to_check
  ) into email_exists;
  
  return email_exists;
end;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
declare
  v_email_prefix text;
  v_username text;
  v_name text;
  v_exists boolean;
  v_avatar_url text;
begin
  -- Use the native boolean column directly
  if new.confirmed_at is null then
    return new;
  end if;

  -- Prevent duplicate profile inserts if an update fires multiple times
  select exists(select 1 from public.profiles where id = new.id) into v_exists;
  
  if not v_exists then
    v_email_prefix := split_part(new.email, '@', 1);
    v_name := initcap(v_email_prefix);
    -- Truncate prefix to 10 chars max so the final string (prefix + '_' + 4 digits) is <= 15 chars
    v_username := lower(substring(v_email_prefix from 1 for 10)) || '_' || floor(random() * 9000 + 1000)::text;

    v_avatar_url := 'https://api.dicebear.com/10.x/glyphs/svg?seed=' || substring(new.id::text, 1, 8);

    insert into public.profiles (id, name, username, avatar_url)
    values (new.id, v_name, v_username, v_avatar_url);
  end if;

  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $function$
begin
  new.updated_at := now();
  return new;
end;
$function$;

ALTER TABLE "public"."invites"
  ADD CONSTRAINT "invites_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."list_members"
  ADD CONSTRAINT "list_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."invites"
  ADD CONSTRAINT "invites_list_id_fkey" FOREIGN KEY (list_id) REFERENCES public.lists(id) ON DELETE CASCADE;

ALTER TABLE "public"."list_items"
  ADD CONSTRAINT "list_items_list_id_fkey" FOREIGN KEY (list_id) REFERENCES public.lists(id) ON DELETE CASCADE;

ALTER TABLE "public"."list_members"
  ADD CONSTRAINT "list_members_list_id_fkey" FOREIGN KEY (list_id) REFERENCES public.lists(id) ON DELETE CASCADE;

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."saved_lists"
  ADD CONSTRAINT "saved_lists_list_id_fkey" FOREIGN KEY (list_id) REFERENCES public.lists(id) ON DELETE CASCADE;

ALTER TABLE "public"."saved_lists"
  ADD CONSTRAINT "saved_lists_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER trig_invites_set_updated_at
  BEFORE UPDATE ON public.invites
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_list_items_updated_at
  BEFORE UPDATE ON public.list_items
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_list_members_updated_at
  BEFORE UPDATE ON public.list_members
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_lists_updated_at
  BEFORE UPDATE ON public.lists
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Enable delete for sender" ON "public"."invites"
  FOR DELETE
  TO PUBLIC
  USING ((( SELECT auth.uid() AS uid) = sender_id));

CREATE POLICY "Enable insert for sender" ON "public"."invites"
  FOR INSERT
  TO PUBLIC
  WITH CHECK ((( SELECT auth.uid() AS uid) = sender_id));

CREATE POLICY "Enable read access for all users" ON "public"."invites"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Enable update for invitee or sender" ON "public"."invites"
  FOR UPDATE
  TO PUBLIC
  USING (((( SELECT auth.uid() AS uid) = sender_id) OR ((auth.jwt() ->> 'email'::text) = invitee_email)));

CREATE POLICY "Enable delete for authenticated users only" ON "public"."list_items"
  FOR DELETE
  TO "authenticated"
  USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."list_items"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON "public"."list_items"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Enable update for authenticated users only" ON "public"."list_items"
  FOR UPDATE
  TO "authenticated"
  USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."list_members"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON "public"."list_members"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Enable delete for authenticated users only" ON "public"."lists"
  FOR DELETE
  TO "authenticated"
  USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."lists"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON "public"."lists"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Enable update for authenticated users only" ON "public"."lists"
  FOR UPDATE
  TO "authenticated"
  USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."profiles"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Enable update for users based on user id" ON "public"."profiles"
  FOR UPDATE
  TO PUBLIC
  USING ((( SELECT auth.uid() AS uid) = id));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."saved_lists"
  FOR DELETE
  TO PUBLIC
  USING ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "Enable insert for users based on user_id" ON "public"."saved_lists"
  FOR INSERT
  TO PUBLIC
  WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "Enable users to view their own data only" ON "public"."saved_lists"
  FOR SELECT
  TO "authenticated"
  USING ((( SELECT auth.uid() AS uid) = user_id));

GRANT EXECUTE ON FUNCTION "public"."accept_list_invite"(uuid) TO PUBLIC, "anon", "authenticated", "postgres", "service_role";

GRANT EXECUTE ON FUNCTION "public"."check_if_email_exists"(text) TO PUBLIC, "anon", "authenticated", "postgres", "service_role";

GRANT EXECUTE ON FUNCTION "public"."handle_new_user"() TO PUBLIC, "anon", "authenticated", "postgres", "service_role";

GRANT EXECUTE ON FUNCTION "public"."set_updated_at"() TO PUBLIC, "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."invites" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."list_items" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."list_members" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."lists" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."saved_lists" TO "anon", "authenticated", "postgres", "service_role";

GRANT USAGE ON TYPE "public"."invite_status" TO "postgres";

GRANT USAGE ON TYPE "public"."list_member_role" TO "postgres";

GRANT USAGE ON TYPE "public"."list_visibility_satus" TO "postgres";

