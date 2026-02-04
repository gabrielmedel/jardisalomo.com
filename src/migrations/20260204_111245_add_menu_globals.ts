import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "daily_menu" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"menu_file_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "monthly_menu" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"menu_file_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "daily_menu" ADD CONSTRAINT "daily_menu_menu_file_id_media_id_fk" FOREIGN KEY ("menu_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "monthly_menu" ADD CONSTRAINT "monthly_menu_menu_file_id_media_id_fk" FOREIGN KEY ("menu_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "daily_menu_menu_file_idx" ON "daily_menu" USING btree ("menu_file_id");
  CREATE INDEX "monthly_menu_menu_file_idx" ON "monthly_menu" USING btree ("menu_file_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "daily_menu" CASCADE;
  DROP TABLE "monthly_menu" CASCADE;`)
}
