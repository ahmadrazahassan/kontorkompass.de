import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_beitraege_kind" AS ENUM('ratgeber', 'magazin');
  CREATE TYPE "public"."enum_beitraege_legacy_body" AS ENUM('e-rechnung-2027', 'fristen');
  CREATE TYPE "public"."enum_beitraege_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__beitraege_v_version_kind" AS ENUM('ratgeber', 'magazin');
  CREATE TYPE "public"."enum__beitraege_v_version_legacy_body" AS ENUM('e-rechnung-2027', 'fristen');
  CREATE TYPE "public"."enum__beitraege_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_software_plans_unit" AS ENUM('flat', 'perUser', 'perEmployee');
  CREATE TYPE "public"."enum_software_checks_status" AS ENUM('yes', 'partial', 'no', 'unknown', 'na');
  CREATE TYPE "public"."enum_software_scenario_basis" AS ENUM('users', 'employees', 'none');
  CREATE TYPE "public"."enum_categories_icon" AS ENUM('Calculator', 'Receipt', 'Money', 'IdentificationBadge', 'Package', 'Clock');
  CREATE TYPE "public"."enum_sources_type" AS ENUM('behoerde', 'kammer', 'studie', 'anbieter', 'presse');
  CREATE TABLE "beitraege_takeaways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "beitraege_legacy_toc" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "beitraege_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar,
  	"a" varchar
  );
  
  CREATE TABLE "beitraege" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"kind" "enum_beitraege_kind" DEFAULT 'ratgeber',
  	"category_id" integer,
  	"lead" varchar,
  	"body" jsonb,
  	"legacy_body" "enum_beitraege_legacy_body",
  	"last_verified_at" timestamp(3) with time zone,
  	"next_review_at" timestamp(3) with time zone,
  	"legal_disclaimer" boolean DEFAULT true,
  	"has_affiliate" boolean DEFAULT false,
  	"seo_title" varchar,
  	"description" varchar,
  	"reading_minutes" numeric DEFAULT 5,
  	"cover_seed" numeric DEFAULT 1,
  	"hero_image_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_beitraege_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "beitraege_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"sources_id" integer
  );
  
  CREATE TABLE "_beitraege_v_version_takeaways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_beitraege_v_version_legacy_toc" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_beitraege_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"q" varchar,
  	"a" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_beitraege_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_kind" "enum__beitraege_v_version_kind" DEFAULT 'ratgeber',
  	"version_category_id" integer,
  	"version_lead" varchar,
  	"version_body" jsonb,
  	"version_legacy_body" "enum__beitraege_v_version_legacy_body",
  	"version_last_verified_at" timestamp(3) with time zone,
  	"version_next_review_at" timestamp(3) with time zone,
  	"version_legal_disclaimer" boolean DEFAULT true,
  	"version_has_affiliate" boolean DEFAULT false,
  	"version_seo_title" varchar,
  	"version_description" varchar,
  	"version_reading_minutes" numeric DEFAULT 5,
  	"version_cover_seed" numeric DEFAULT 1,
  	"version_hero_image_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__beitraege_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_beitraege_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"sources_id" integer
  );
  
  CREATE TABLE "software_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "software_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"monthly_net" numeric,
  	"billing" varchar NOT NULL,
  	"includes" varchar NOT NULL,
  	"promo" varchar,
  	"unit" "enum_software_plans_unit" DEFAULT 'flat',
  	"included_users" numeric,
  	"extra_user_monthly" numeric,
  	"included_employees" numeric,
  	"extra_employee_monthly" numeric,
  	"min_monthly" numeric,
  	"annual_monthly" numeric,
  	"promo_monthly" numeric,
  	"promo_months" numeric
  );
  
  CREATE TABLE "software_checks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"criterion" varchar NOT NULL,
  	"status" "enum_software_checks_status" NOT NULL,
  	"note" varchar
  );
  
  CREATE TABLE "software_fits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "software_not_fits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "software" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"vendor" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"logo_id" integer,
  	"affiliate_link_id" integer NOT NULL,
  	"cta_label" varchar DEFAULT 'Zum Anbieter' NOT NULL,
  	"trial" varchar NOT NULL,
  	"entry_price" numeric,
  	"scenario_basis" "enum_software_scenario_basis" DEFAULT 'users',
  	"price_note" varchar,
  	"verdict" varchar,
  	"review" jsonb,
  	"verified" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "software_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"software_id" integer,
  	"sources_id" integer
  );
  
  CREATE TABLE "glossar_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "glossar" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"term" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"short" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "glossar_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"sources_id" integer
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"icon" "enum_categories_icon" DEFAULT 'Calculator' NOT NULL,
  	"description" varchar NOT NULL,
  	"intro" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" numeric,
  	"publisher" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"accessed_at" timestamp(3) with time zone NOT NULL,
  	"type" "enum_sources_type",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "affiliate_links" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"partner" varchar NOT NULL,
  	"tracking_url" varchar NOT NULL,
  	"is_affiliate" boolean DEFAULT false,
  	"network" varchar,
  	"active" boolean DEFAULT true,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "newsletter_consents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"requested_at" timestamp(3) with time zone,
  	"confirmed_at" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"decorative" boolean DEFAULT false,
  	"credit" varchar,
  	"licence" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"beitraege_id" integer,
  	"software_id" integer,
  	"glossar_id" integer,
  	"categories_id" integer,
  	"sources_id" integer,
  	"affiliate_links_id" integer,
  	"newsletter_consents_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "beitraege_takeaways" ADD CONSTRAINT "beitraege_takeaways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."beitraege"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "beitraege_legacy_toc" ADD CONSTRAINT "beitraege_legacy_toc_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."beitraege"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "beitraege_faqs" ADD CONSTRAINT "beitraege_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."beitraege"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "beitraege" ADD CONSTRAINT "beitraege_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "beitraege" ADD CONSTRAINT "beitraege_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "beitraege_rels" ADD CONSTRAINT "beitraege_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."beitraege"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "beitraege_rels" ADD CONSTRAINT "beitraege_rels_sources_fk" FOREIGN KEY ("sources_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_beitraege_v_version_takeaways" ADD CONSTRAINT "_beitraege_v_version_takeaways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_beitraege_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_beitraege_v_version_legacy_toc" ADD CONSTRAINT "_beitraege_v_version_legacy_toc_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_beitraege_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_beitraege_v_version_faqs" ADD CONSTRAINT "_beitraege_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_beitraege_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_beitraege_v" ADD CONSTRAINT "_beitraege_v_parent_id_beitraege_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."beitraege"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_beitraege_v" ADD CONSTRAINT "_beitraege_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_beitraege_v" ADD CONSTRAINT "_beitraege_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_beitraege_v_rels" ADD CONSTRAINT "_beitraege_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_beitraege_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_beitraege_v_rels" ADD CONSTRAINT "_beitraege_v_rels_sources_fk" FOREIGN KEY ("sources_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "software_facts" ADD CONSTRAINT "software_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."software"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "software_plans" ADD CONSTRAINT "software_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."software"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "software_checks" ADD CONSTRAINT "software_checks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."software"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "software_fits" ADD CONSTRAINT "software_fits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."software"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "software_not_fits" ADD CONSTRAINT "software_not_fits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."software"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "software" ADD CONSTRAINT "software_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "software" ADD CONSTRAINT "software_affiliate_link_id_affiliate_links_id_fk" FOREIGN KEY ("affiliate_link_id") REFERENCES "public"."affiliate_links"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "software_rels" ADD CONSTRAINT "software_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."software"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "software_rels" ADD CONSTRAINT "software_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "software_rels" ADD CONSTRAINT "software_rels_software_fk" FOREIGN KEY ("software_id") REFERENCES "public"."software"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "software_rels" ADD CONSTRAINT "software_rels_sources_fk" FOREIGN KEY ("sources_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "glossar_body" ADD CONSTRAINT "glossar_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."glossar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "glossar_rels" ADD CONSTRAINT "glossar_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."glossar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "glossar_rels" ADD CONSTRAINT "glossar_rels_sources_fk" FOREIGN KEY ("sources_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_beitraege_fk" FOREIGN KEY ("beitraege_id") REFERENCES "public"."beitraege"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_software_fk" FOREIGN KEY ("software_id") REFERENCES "public"."software"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_glossar_fk" FOREIGN KEY ("glossar_id") REFERENCES "public"."glossar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sources_fk" FOREIGN KEY ("sources_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_affiliate_links_fk" FOREIGN KEY ("affiliate_links_id") REFERENCES "public"."affiliate_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_newsletter_consents_fk" FOREIGN KEY ("newsletter_consents_id") REFERENCES "public"."newsletter_consents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "beitraege_takeaways_order_idx" ON "beitraege_takeaways" USING btree ("_order");
  CREATE INDEX "beitraege_takeaways_parent_id_idx" ON "beitraege_takeaways" USING btree ("_parent_id");
  CREATE INDEX "beitraege_legacy_toc_order_idx" ON "beitraege_legacy_toc" USING btree ("_order");
  CREATE INDEX "beitraege_legacy_toc_parent_id_idx" ON "beitraege_legacy_toc" USING btree ("_parent_id");
  CREATE INDEX "beitraege_faqs_order_idx" ON "beitraege_faqs" USING btree ("_order");
  CREATE INDEX "beitraege_faqs_parent_id_idx" ON "beitraege_faqs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "beitraege_slug_idx" ON "beitraege" USING btree ("slug");
  CREATE INDEX "beitraege_category_idx" ON "beitraege" USING btree ("category_id");
  CREATE INDEX "beitraege_hero_image_idx" ON "beitraege" USING btree ("hero_image_id");
  CREATE INDEX "beitraege_updated_at_idx" ON "beitraege" USING btree ("updated_at");
  CREATE INDEX "beitraege_created_at_idx" ON "beitraege" USING btree ("created_at");
  CREATE INDEX "beitraege__status_idx" ON "beitraege" USING btree ("_status");
  CREATE INDEX "beitraege_rels_order_idx" ON "beitraege_rels" USING btree ("order");
  CREATE INDEX "beitraege_rels_parent_idx" ON "beitraege_rels" USING btree ("parent_id");
  CREATE INDEX "beitraege_rels_path_idx" ON "beitraege_rels" USING btree ("path");
  CREATE INDEX "beitraege_rels_sources_id_idx" ON "beitraege_rels" USING btree ("sources_id");
  CREATE INDEX "_beitraege_v_version_takeaways_order_idx" ON "_beitraege_v_version_takeaways" USING btree ("_order");
  CREATE INDEX "_beitraege_v_version_takeaways_parent_id_idx" ON "_beitraege_v_version_takeaways" USING btree ("_parent_id");
  CREATE INDEX "_beitraege_v_version_legacy_toc_order_idx" ON "_beitraege_v_version_legacy_toc" USING btree ("_order");
  CREATE INDEX "_beitraege_v_version_legacy_toc_parent_id_idx" ON "_beitraege_v_version_legacy_toc" USING btree ("_parent_id");
  CREATE INDEX "_beitraege_v_version_faqs_order_idx" ON "_beitraege_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_beitraege_v_version_faqs_parent_id_idx" ON "_beitraege_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_beitraege_v_parent_idx" ON "_beitraege_v" USING btree ("parent_id");
  CREATE INDEX "_beitraege_v_version_version_slug_idx" ON "_beitraege_v" USING btree ("version_slug");
  CREATE INDEX "_beitraege_v_version_version_category_idx" ON "_beitraege_v" USING btree ("version_category_id");
  CREATE INDEX "_beitraege_v_version_version_hero_image_idx" ON "_beitraege_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_beitraege_v_version_version_updated_at_idx" ON "_beitraege_v" USING btree ("version_updated_at");
  CREATE INDEX "_beitraege_v_version_version_created_at_idx" ON "_beitraege_v" USING btree ("version_created_at");
  CREATE INDEX "_beitraege_v_version_version__status_idx" ON "_beitraege_v" USING btree ("version__status");
  CREATE INDEX "_beitraege_v_created_at_idx" ON "_beitraege_v" USING btree ("created_at");
  CREATE INDEX "_beitraege_v_updated_at_idx" ON "_beitraege_v" USING btree ("updated_at");
  CREATE INDEX "_beitraege_v_latest_idx" ON "_beitraege_v" USING btree ("latest");
  CREATE INDEX "_beitraege_v_rels_order_idx" ON "_beitraege_v_rels" USING btree ("order");
  CREATE INDEX "_beitraege_v_rels_parent_idx" ON "_beitraege_v_rels" USING btree ("parent_id");
  CREATE INDEX "_beitraege_v_rels_path_idx" ON "_beitraege_v_rels" USING btree ("path");
  CREATE INDEX "_beitraege_v_rels_sources_id_idx" ON "_beitraege_v_rels" USING btree ("sources_id");
  CREATE INDEX "software_facts_order_idx" ON "software_facts" USING btree ("_order");
  CREATE INDEX "software_facts_parent_id_idx" ON "software_facts" USING btree ("_parent_id");
  CREATE INDEX "software_plans_order_idx" ON "software_plans" USING btree ("_order");
  CREATE INDEX "software_plans_parent_id_idx" ON "software_plans" USING btree ("_parent_id");
  CREATE INDEX "software_checks_order_idx" ON "software_checks" USING btree ("_order");
  CREATE INDEX "software_checks_parent_id_idx" ON "software_checks" USING btree ("_parent_id");
  CREATE INDEX "software_fits_order_idx" ON "software_fits" USING btree ("_order");
  CREATE INDEX "software_fits_parent_id_idx" ON "software_fits" USING btree ("_parent_id");
  CREATE INDEX "software_not_fits_order_idx" ON "software_not_fits" USING btree ("_order");
  CREATE INDEX "software_not_fits_parent_id_idx" ON "software_not_fits" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "software_slug_idx" ON "software" USING btree ("slug");
  CREATE INDEX "software_logo_idx" ON "software" USING btree ("logo_id");
  CREATE INDEX "software_affiliate_link_idx" ON "software" USING btree ("affiliate_link_id");
  CREATE INDEX "software_updated_at_idx" ON "software" USING btree ("updated_at");
  CREATE INDEX "software_created_at_idx" ON "software" USING btree ("created_at");
  CREATE INDEX "software_rels_order_idx" ON "software_rels" USING btree ("order");
  CREATE INDEX "software_rels_parent_idx" ON "software_rels" USING btree ("parent_id");
  CREATE INDEX "software_rels_path_idx" ON "software_rels" USING btree ("path");
  CREATE INDEX "software_rels_categories_id_idx" ON "software_rels" USING btree ("categories_id");
  CREATE INDEX "software_rels_software_id_idx" ON "software_rels" USING btree ("software_id");
  CREATE INDEX "software_rels_sources_id_idx" ON "software_rels" USING btree ("sources_id");
  CREATE INDEX "glossar_body_order_idx" ON "glossar_body" USING btree ("_order");
  CREATE INDEX "glossar_body_parent_id_idx" ON "glossar_body" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "glossar_slug_idx" ON "glossar" USING btree ("slug");
  CREATE INDEX "glossar_updated_at_idx" ON "glossar" USING btree ("updated_at");
  CREATE INDEX "glossar_created_at_idx" ON "glossar" USING btree ("created_at");
  CREATE INDEX "glossar_rels_order_idx" ON "glossar_rels" USING btree ("order");
  CREATE INDEX "glossar_rels_parent_idx" ON "glossar_rels" USING btree ("parent_id");
  CREATE INDEX "glossar_rels_path_idx" ON "glossar_rels" USING btree ("path");
  CREATE INDEX "glossar_rels_sources_id_idx" ON "glossar_rels" USING btree ("sources_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "sources_updated_at_idx" ON "sources" USING btree ("updated_at");
  CREATE INDEX "sources_created_at_idx" ON "sources" USING btree ("created_at");
  CREATE UNIQUE INDEX "affiliate_links_slug_idx" ON "affiliate_links" USING btree ("slug");
  CREATE INDEX "affiliate_links_updated_at_idx" ON "affiliate_links" USING btree ("updated_at");
  CREATE INDEX "affiliate_links_created_at_idx" ON "affiliate_links" USING btree ("created_at");
  CREATE INDEX "newsletter_consents_email_idx" ON "newsletter_consents" USING btree ("email");
  CREATE INDEX "newsletter_consents_updated_at_idx" ON "newsletter_consents" USING btree ("updated_at");
  CREATE INDEX "newsletter_consents_created_at_idx" ON "newsletter_consents" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_beitraege_id_idx" ON "payload_locked_documents_rels" USING btree ("beitraege_id");
  CREATE INDEX "payload_locked_documents_rels_software_id_idx" ON "payload_locked_documents_rels" USING btree ("software_id");
  CREATE INDEX "payload_locked_documents_rels_glossar_id_idx" ON "payload_locked_documents_rels" USING btree ("glossar_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_sources_id_idx" ON "payload_locked_documents_rels" USING btree ("sources_id");
  CREATE INDEX "payload_locked_documents_rels_affiliate_links_id_idx" ON "payload_locked_documents_rels" USING btree ("affiliate_links_id");
  CREATE INDEX "payload_locked_documents_rels_newsletter_consents_id_idx" ON "payload_locked_documents_rels" USING btree ("newsletter_consents_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "beitraege_takeaways" CASCADE;
  DROP TABLE "beitraege_legacy_toc" CASCADE;
  DROP TABLE "beitraege_faqs" CASCADE;
  DROP TABLE "beitraege" CASCADE;
  DROP TABLE "beitraege_rels" CASCADE;
  DROP TABLE "_beitraege_v_version_takeaways" CASCADE;
  DROP TABLE "_beitraege_v_version_legacy_toc" CASCADE;
  DROP TABLE "_beitraege_v_version_faqs" CASCADE;
  DROP TABLE "_beitraege_v" CASCADE;
  DROP TABLE "_beitraege_v_rels" CASCADE;
  DROP TABLE "software_facts" CASCADE;
  DROP TABLE "software_plans" CASCADE;
  DROP TABLE "software_checks" CASCADE;
  DROP TABLE "software_fits" CASCADE;
  DROP TABLE "software_not_fits" CASCADE;
  DROP TABLE "software" CASCADE;
  DROP TABLE "software_rels" CASCADE;
  DROP TABLE "glossar_body" CASCADE;
  DROP TABLE "glossar" CASCADE;
  DROP TABLE "glossar_rels" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "sources" CASCADE;
  DROP TABLE "affiliate_links" CASCADE;
  DROP TABLE "newsletter_consents" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_beitraege_kind";
  DROP TYPE "public"."enum_beitraege_legacy_body";
  DROP TYPE "public"."enum_beitraege_status";
  DROP TYPE "public"."enum__beitraege_v_version_kind";
  DROP TYPE "public"."enum__beitraege_v_version_legacy_body";
  DROP TYPE "public"."enum__beitraege_v_version_status";
  DROP TYPE "public"."enum_software_plans_unit";
  DROP TYPE "public"."enum_software_checks_status";
  DROP TYPE "public"."enum_software_scenario_basis";
  DROP TYPE "public"."enum_categories_icon";
  DROP TYPE "public"."enum_sources_type";`)
}
