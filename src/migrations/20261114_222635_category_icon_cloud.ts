import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_categories_icon" ADD VALUE 'Cloud';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "categories" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "categories" ALTER COLUMN "icon" SET DEFAULT 'Calculator'::text;
  DROP TYPE "public"."enum_categories_icon";
  CREATE TYPE "public"."enum_categories_icon" AS ENUM('Calculator', 'Receipt', 'Money', 'IdentificationBadge', 'Package', 'Clock');
  ALTER TABLE "categories" ALTER COLUMN "icon" SET DEFAULT 'Calculator'::"public"."enum_categories_icon";
  ALTER TABLE "categories" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_categories_icon" USING "icon"::"public"."enum_categories_icon";`)
}
