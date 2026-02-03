import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('es', 'ca', 'en');
  CREATE TYPE "public"."enum_pages_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_hero_links_link_appearance" AS ENUM('default', 'outline', 'secondary');
  CREATE TYPE "public"."enum_pages_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_carousel_slider_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_carousel_slider_items_link_appearance" AS ENUM('link');
  CREATE TYPE "public"."enum_pages_blocks_centered_with_media_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_centered_with_media_links_link_appearance" AS ENUM('default', 'outline', 'secondary');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_appearance" AS ENUM('default', 'outline', 'secondary');
  CREATE TYPE "public"."enum_pages_blocks_form_block_background_color" AS ENUM('none', 'pastel', 'olive', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_menu_section_background_color" AS ENUM('none', 'pastel', 'olive', 'accent');
  CREATE TYPE "public"."enum_menu_display_info_items_type" AS ENUM('date', 'time');
  CREATE TYPE "public"."enum_menu_display_section_background_color" AS ENUM('none', 'pastel', 'olive', 'accent');
  CREATE TYPE "public"."enum_two_col_content_media_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_two_col_content_media_links_link_appearance" AS ENUM('default', 'outline', 'secondary');
  CREATE TYPE "public"."enum_two_col_content_media_content_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_two_col_content_media_media_layout" AS ENUM('single', 'dual');
  CREATE TYPE "public"."enum_two_col_content_media_background_color" AS ENUM('none', 'pastel', 'olive', 'accent');
  CREATE TYPE "public"."enum_two_col_content_media_media_background_color" AS ENUM('none', 'pastel', 'olive', 'accent');
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_appearance" AS ENUM('default', 'outline', 'secondary');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_carousel_slider_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_carousel_slider_items_link_appearance" AS ENUM('link');
  CREATE TYPE "public"."enum__pages_v_blocks_centered_with_media_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_centered_with_media_links_link_appearance" AS ENUM('default', 'outline', 'secondary');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance" AS ENUM('default', 'outline', 'secondary');
  CREATE TYPE "public"."enum__pages_v_blocks_form_block_background_color" AS ENUM('none', 'pastel', 'olive', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_menu_section_background_color" AS ENUM('none', 'pastel', 'olive', 'accent');
  CREATE TYPE "public"."enum__menu_display_v_info_items_type" AS ENUM('date', 'time');
  CREATE TYPE "public"."enum__menu_display_v_section_background_color" AS ENUM('none', 'pastel', 'olive', 'accent');
  CREATE TYPE "public"."enum__two_col_content_media_v_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__two_col_content_media_v_links_link_appearance" AS ENUM('default', 'outline', 'secondary');
  CREATE TYPE "public"."enum__two_col_content_media_v_content_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__two_col_content_media_v_media_layout" AS ENUM('single', 'dual');
  CREATE TYPE "public"."enum__two_col_content_media_v_background_color" AS ENUM('none', 'pastel', 'olive', 'accent');
  CREATE TYPE "public"."enum__two_col_content_media_v_media_background_color" AS ENUM('none', 'pastel', 'olive', 'accent');
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('es', 'ca', 'en');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'user');
  CREATE TYPE "public"."enum_dishes_category" AS ENUM('starters', 'mains', 'desserts', 'drinks');
  CREATE TYPE "public"."enum_plugin_ai_instructions_field_type" AS ENUM('text', 'textarea', 'upload', 'richText');
  CREATE TYPE "public"."enum_plugin_ai_instructions_model_id" AS ENUM('Oai-text', 'dall-e', 'gpt-image-1', 'tts', 'Oai-object');
  CREATE TYPE "public"."enum_plugin_ai_instructions_oai_text_settings_model" AS ENUM('gpt-5', 'gpt-5-mini', 'gpt-5-nano', 'gpt-4.1', 'gpt-4o', 'gpt-4-turbo', 'gpt-4o-mini', 'gpt-3.5-turbo');
  CREATE TYPE "public"."enum_plugin_ai_instructions_dalle_e_settings_version" AS ENUM('dall-e-3', 'dall-e-2');
  CREATE TYPE "public"."enum_plugin_ai_instructions_dalle_e_settings_size" AS ENUM('256x256', '512x512', '1024x1024', '1792x1024', '1024x1792');
  CREATE TYPE "public"."enum_plugin_ai_instructions_dalle_e_settings_style" AS ENUM('vivid', 'natural');
  CREATE TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_version" AS ENUM('gpt-image-1');
  CREATE TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_size" AS ENUM('1024x1024', '1024x1536', '1536x1024', 'auto');
  CREATE TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_quality" AS ENUM('low', 'medium', 'high', 'auto');
  CREATE TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_output_format" AS ENUM('png', 'jpeg', 'webp');
  CREATE TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_background" AS ENUM('white', 'transparent');
  CREATE TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_moderation" AS ENUM('auto', 'low');
  CREATE TYPE "public"."enum_plugin_ai_instructions_oai_tts_settings_voice" AS ENUM('alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer');
  CREATE TYPE "public"."enum_plugin_ai_instructions_oai_tts_settings_model" AS ENUM('tts-1', 'tts-1-hd');
  CREATE TYPE "public"."enum_plugin_ai_instructions_oai_tts_settings_response_format" AS ENUM('mp3', 'opus', 'aac', 'flac', 'wav', 'pcm');
  CREATE TYPE "public"."enum_plugin_ai_instructions_oai_object_settings_model" AS ENUM('gpt-5', 'gpt-5-mini', 'gpt-5-nano', 'gpt-4.1', 'gpt-4o', 'gpt-4-turbo', 'gpt-4o-mini', 'gpt-3.5-turbo');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_forms_blocks_row_columns_width" AS ENUM('full', 'half', 'third', 'quarter', 'twoThirds', 'threeQuarters');
  CREATE TYPE "public"."enum_forms_actions_type" AS ENUM('logToConsole', 'createReservation');
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TYPE "public"."enum_reservation_types_available_days" AS ENUM('0', '1', '2', '3', '4', '5', '6');
  CREATE TYPE "public"."enum_reservations_status" AS ENUM('pending', 'confirmed', 'cancelled');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_folders_folder_type" AS ENUM('media');
  CREATE TYPE "public"."enum_header_nav_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_header_language_selector_languages_code" AS ENUM('ca', 'es', 'en');
  CREATE TYPE "public"."enum_footer_socials_platform" AS ENUM('instagram', 'facebook');
  CREATE TYPE "public"."enum_footer_nav_items_link_type" AS ENUM('reference', 'custom');
  CREATE TABLE "pages_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum_pages_hero_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_hero_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum_pages_blocks_cta_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_cta_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_locales" (
  	"rich_text" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_carousel_slider_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"link_type" "enum_pages_blocks_carousel_slider_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum_pages_blocks_carousel_slider_items_link_appearance" DEFAULT 'link'
  );
  
  CREATE TABLE "pages_blocks_carousel_slider_items_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_carousel_slider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_carousel_slider_locales" (
  	"pre_title" varchar,
  	"rich_text" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_centered_with_media_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_centered_with_media_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum_pages_blocks_centered_with_media_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_centered_with_media_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_centered_with_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_centered_with_media_locales" (
  	"pre_title" varchar,
  	"rich_text" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_pages_blocks_content_columns_size" DEFAULT 'oneThird',
  	"enable_link" boolean,
  	"link_type" "enum_pages_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum_pages_blocks_content_columns_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_content_columns_locales" (
  	"rich_text" jsonb,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer
  );
  
  CREATE TABLE "pages_blocks_features_items_locales" (
  	"heading" varchar,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"background_color" "enum_pages_blocks_form_block_background_color" DEFAULT 'none',
  	"enable_intro" boolean DEFAULT true,
  	"intro_content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_menu" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"menu_id" integer,
  	"section_background_color" "enum_pages_blocks_menu_section_background_color" DEFAULT 'none',
  	"show_images" boolean DEFAULT true,
  	"show_allergens" boolean DEFAULT true,
  	"group_by_category" boolean DEFAULT true,
  	"only_featured" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_menu_locales" (
  	"pre_title" varchar,
  	"title" jsonb,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "menu_display_info_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_menu_display_info_items_type",
  	"label" varchar
  );
  
  CREATE TABLE "menu_display_menu_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb
  );
  
  CREATE TABLE "menu_display_pricing_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"price" varchar,
  	"per_price_label" varchar
  );
  
  CREATE TABLE "menu_display" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_background_color" "enum_menu_display_section_background_color" DEFAULT 'none',
  	"background_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "menu_display_locales" (
  	"pre_title" varchar,
  	"title" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "two_col_content_media_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_two_col_content_media_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum_two_col_content_media_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "two_col_content_media_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "two_col_content_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content_position" "enum_two_col_content_media_content_position" DEFAULT 'left',
  	"media_layout" "enum_two_col_content_media_media_layout" DEFAULT 'single',
  	"background_color" "enum_two_col_content_media_background_color" DEFAULT 'none',
  	"media_primary_id" integer,
  	"media_secondary_id" integer,
  	"media_background_color" "enum_two_col_content_media_media_background_color" DEFAULT 'none',
  	"rectangle_width" numeric DEFAULT 30,
  	"rectangle_offset_top" numeric DEFAULT 0,
  	"rectangle_height" numeric DEFAULT 100,
  	"block_name" varchar
  );
  
  CREATE TABLE "two_col_content_media_locales" (
  	"pre_title" varchar,
  	"rich_text" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_type" "enum_pages_hero_type" DEFAULT 'lowImpact',
  	"hero_media_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar,
  	"hero_pre_title" varchar,
  	"hero_rich_text" jsonb,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  CREATE TABLE "_pages_v_version_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_version_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum__pages_v_version_hero_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_hero_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum__pages_v_blocks_cta_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_locales" (
  	"rich_text" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_carousel_slider_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"link_type" "enum__pages_v_blocks_carousel_slider_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum__pages_v_blocks_carousel_slider_items_link_appearance" DEFAULT 'link',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_carousel_slider_items_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_carousel_slider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_carousel_slider_locales" (
  	"pre_title" varchar,
  	"rich_text" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_centered_with_media_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_centered_with_media_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum__pages_v_blocks_centered_with_media_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_centered_with_media_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_centered_with_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_centered_with_media_locales" (
  	"pre_title" varchar,
  	"rich_text" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__pages_v_blocks_content_columns_size" DEFAULT 'oneThird',
  	"enable_link" boolean,
  	"link_type" "enum__pages_v_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum__pages_v_blocks_content_columns_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_columns_locales" (
  	"rich_text" jsonb,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_features_items_locales" (
  	"heading" varchar,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"background_color" "enum__pages_v_blocks_form_block_background_color" DEFAULT 'none',
  	"enable_intro" boolean DEFAULT true,
  	"intro_content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_menu" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"menu_id" integer,
  	"section_background_color" "enum__pages_v_blocks_menu_section_background_color" DEFAULT 'none',
  	"show_images" boolean DEFAULT true,
  	"show_allergens" boolean DEFAULT true,
  	"group_by_category" boolean DEFAULT true,
  	"only_featured" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_menu_locales" (
  	"pre_title" varchar,
  	"title" jsonb,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_menu_display_v_info_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__menu_display_v_info_items_type",
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_menu_display_v_menu_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_menu_display_v_pricing_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"price" varchar,
  	"per_price_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_menu_display_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_background_color" "enum__menu_display_v_section_background_color" DEFAULT 'none',
  	"background_image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_menu_display_v_locales" (
  	"pre_title" varchar,
  	"title" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_two_col_content_media_v_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__two_col_content_media_v_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum__two_col_content_media_v_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_two_col_content_media_v_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_two_col_content_media_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content_position" "enum__two_col_content_media_v_content_position" DEFAULT 'left',
  	"media_layout" "enum__two_col_content_media_v_media_layout" DEFAULT 'single',
  	"background_color" "enum__two_col_content_media_v_background_color" DEFAULT 'none',
  	"media_primary_id" integer,
  	"media_secondary_id" integer,
  	"media_background_color" "enum__two_col_content_media_v_media_background_color" DEFAULT 'none',
  	"rectangle_width" numeric DEFAULT 30,
  	"rectangle_offset_top" numeric DEFAULT 0,
  	"rectangle_height" numeric DEFAULT 100,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_two_col_content_media_v_locales" (
  	"pre_title" varchar,
  	"rich_text" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_hero_type" "enum__pages_v_version_hero_type" DEFAULT 'lowImpact',
  	"version_hero_media_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_title" varchar,
  	"version_hero_pre_title" varchar,
  	"version_hero_rich_text" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"caption" jsonb,
  	"folder_id" integer,
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
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_square_url" varchar,
  	"sizes_square_width" numeric,
  	"sizes_square_height" numeric,
  	"sizes_square_mime_type" varchar,
  	"sizes_square_filesize" numeric,
  	"sizes_square_filename" varchar,
  	"sizes_small_url" varchar,
  	"sizes_small_width" numeric,
  	"sizes_small_height" numeric,
  	"sizes_small_mime_type" varchar,
  	"sizes_small_filesize" numeric,
  	"sizes_small_filename" varchar,
  	"sizes_medium_url" varchar,
  	"sizes_medium_width" numeric,
  	"sizes_medium_height" numeric,
  	"sizes_medium_mime_type" varchar,
  	"sizes_medium_filesize" numeric,
  	"sizes_medium_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar,
  	"sizes_xlarge_url" varchar,
  	"sizes_xlarge_width" numeric,
  	"sizes_xlarge_height" numeric,
  	"sizes_xlarge_mime_type" varchar,
  	"sizes_xlarge_filesize" numeric,
  	"sizes_xlarge_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
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
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "dishes_allergens" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"allergen" varchar NOT NULL
  );
  
  CREATE TABLE "dishes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"price" varchar NOT NULL,
  	"category" "enum_dishes_category" NOT NULL,
  	"image_id" integer,
  	"featured" boolean DEFAULT false,
  	"available" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "dishes_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "menus" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "menus_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "menus_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"dishes_id" integer
  );
  
  CREATE TABLE "plugin_ai_instructions_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "plugin_ai_instructions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"schema_path" varchar,
  	"field_type" "enum_plugin_ai_instructions_field_type" DEFAULT 'text',
  	"relation_to" varchar,
  	"model_id" "enum_plugin_ai_instructions_model_id",
  	"disabled" boolean DEFAULT false,
  	"prompt" varchar,
  	"system" varchar DEFAULT 'INSTRUCTIONS:
  You are a highly skilled and professional blog writer,
  renowned for crafting engaging and well-organized articles.
  When given a title, you meticulously create blogs that are not only
  informative and accurate but also captivating and beautifully structured.',
  	"layout" varchar DEFAULT '[paragraph] - Write a concise introduction (2-3 sentences) that outlines the main topic.
  [horizontalrule] - Insert a horizontal rule to separate the introduction from the main content.
  [list] - Create a list with 3-5 items. Each list item should contain:
     a. [heading] - A brief, descriptive heading (up to 5 words)
     b. [paragraph] - A short explanation or elaboration (1-2 sentences)
  [horizontalrule] - Insert another horizontal rule to separate the main content from the conclusion.
  [paragraph] - Compose a brief conclusion (2-3 sentences) summarizing the key points.
  [quote] - Include a relevant quote from a famous person, directly related to the topic. Format: "Quote text." - Author Name',
  	"oai_text_settings_model" "enum_plugin_ai_instructions_oai_text_settings_model" DEFAULT 'gpt-4o-mini',
  	"oai_text_settings_max_tokens" numeric DEFAULT 5000,
  	"oai_text_settings_temperature" numeric DEFAULT 0.7,
  	"oai_text_settings_extract_attachments" boolean,
  	"dalle_e_settings_version" "enum_plugin_ai_instructions_dalle_e_settings_version" DEFAULT 'dall-e-3',
  	"dalle_e_settings_size" "enum_plugin_ai_instructions_dalle_e_settings_size" DEFAULT '1024x1024',
  	"dalle_e_settings_style" "enum_plugin_ai_instructions_dalle_e_settings_style" DEFAULT 'natural',
  	"dalle_e_settings_enable_prompt_optimization" boolean,
  	"gpt_image_1_settings_version" "enum_plugin_ai_instructions_gpt_image_1_settings_version" DEFAULT 'gpt-image-1',
  	"gpt_image_1_settings_size" "enum_plugin_ai_instructions_gpt_image_1_settings_size" DEFAULT 'auto',
  	"gpt_image_1_settings_quality" "enum_plugin_ai_instructions_gpt_image_1_settings_quality" DEFAULT 'auto',
  	"gpt_image_1_settings_output_format" "enum_plugin_ai_instructions_gpt_image_1_settings_output_format" DEFAULT 'png',
  	"gpt_image_1_settings_output_compression" numeric DEFAULT 100,
  	"gpt_image_1_settings_background" "enum_plugin_ai_instructions_gpt_image_1_settings_background" DEFAULT 'white',
  	"gpt_image_1_settings_moderation" "enum_plugin_ai_instructions_gpt_image_1_settings_moderation" DEFAULT 'auto',
  	"oai_tts_settings_voice" "enum_plugin_ai_instructions_oai_tts_settings_voice" DEFAULT 'alloy',
  	"oai_tts_settings_model" "enum_plugin_ai_instructions_oai_tts_settings_model" DEFAULT 'tts-1',
  	"oai_tts_settings_response_format" "enum_plugin_ai_instructions_oai_tts_settings_response_format" DEFAULT 'mp3',
  	"oai_tts_settings_speed" numeric DEFAULT 1,
  	"oai_object_settings_model" "enum_plugin_ai_instructions_oai_object_settings_model" DEFAULT 'gpt-4o',
  	"oai_object_settings_max_tokens" numeric DEFAULT 5000,
  	"oai_object_settings_temperature" numeric DEFAULT 0.7,
  	"oai_object_settings_extract_attachments" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  CREATE TABLE "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_checkbox_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_country" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_country_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_email_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_message_locales" (
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_number_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_options_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"placeholder" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_select_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_state" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_state_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_text_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_textarea_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_reservation_field" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"reservation_type_id" integer NOT NULL,
  	"default_people" numeric DEFAULT 2,
  	"max_people" numeric DEFAULT 10,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_row_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"width" "enum_forms_blocks_row_columns_width" DEFAULT 'half'
  );
  
  CREATE TABLE "forms_blocks_row" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_stepper_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "forms_blocks_stepper" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"previous_button_label" varchar DEFAULT 'Anterior',
  	"next_button_label" varchar DEFAULT 'Següent',
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar
  );
  
  CREATE TABLE "forms_emails_locales" (
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_actions_mask_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar
  );
  
  CREATE TABLE "forms_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_forms_actions_type" NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"max_value_length" numeric DEFAULT 500
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
  	"redirect_url" varchar,
  	"validation_error_message" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_locales" (
  	"submit_button_label" varchar,
  	"confirmation_message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "form_submissions_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "reservation_types_available_days" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_reservation_types_available_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "reservation_types_time_slots" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"start_time" varchar NOT NULL,
  	"end_time" varchar NOT NULL,
  	"max_capacity" numeric NOT NULL
  );
  
  CREATE TABLE "reservation_types" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"inherits_from_id" integer,
  	"date_range_start_date" timestamp(3) with time zone,
  	"date_range_end_date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "reservations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reservation_type_id" integer NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"start_time" varchar NOT NULL,
  	"end_time" varchar NOT NULL,
  	"number_of_people" numeric NOT NULL,
  	"guest_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"status" "enum_reservations_status" DEFAULT 'pending' NOT NULL,
  	"form_submission_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_folders_folder_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_payload_folders_folder_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload_folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
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
  	"pages_id" integer,
  	"media_id" integer,
  	"users_id" integer,
  	"dishes_id" integer,
  	"menus_id" integer,
  	"plugin_ai_instructions_id" integer,
  	"redirects_id" integer,
  	"forms_id" integer,
  	"form_submissions_id" integer,
  	"reservation_types_id" integer,
  	"reservations_id" integer,
  	"payload_folders_id" integer
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
  
  CREATE TABLE "header_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "header_language_selector_languages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"code" "enum_header_language_selector_languages_code",
  	"label" varchar,
  	"flag_id" integer
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"language_selector_enabled" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "header_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"pages_id" integer
  );
  
  CREATE TABLE "footer_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_footer_socials_platform" NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "footer_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_locales" (
  	"intro_text" varchar,
  	"contact_title" varchar NOT NULL,
  	"contact_address" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "footer_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"pages_id" integer
  );
  
  CREATE TABLE "chatbot_welcome_quick_replies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "chatbot_faqs_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "chatbot_faqs_patterns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "chatbot_faqs_quick_replies" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "chatbot_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"priority" numeric
  );
  
  CREATE TABLE "chatbot_faqs_locales" (
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "chatbot" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "chatbot_locales" (
  	"context" varchar,
  	"welcome_title" varchar,
  	"welcome_message" jsonb,
  	"ui_input_placeholder" varchar DEFAULT 'Escribe tu mensaje...',
  	"fallback_message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_hero_links" ADD CONSTRAINT "pages_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_hero_links_locales" ADD CONSTRAINT "pages_hero_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_hero_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_links" ADD CONSTRAINT "pages_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_links_locales" ADD CONSTRAINT "pages_blocks_cta_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_locales" ADD CONSTRAINT "pages_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_carousel_slider_items" ADD CONSTRAINT "pages_blocks_carousel_slider_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_carousel_slider_items" ADD CONSTRAINT "pages_blocks_carousel_slider_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_carousel_slider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_carousel_slider_items_locales" ADD CONSTRAINT "pages_blocks_carousel_slider_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_carousel_slider_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_carousel_slider" ADD CONSTRAINT "pages_blocks_carousel_slider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_carousel_slider_locales" ADD CONSTRAINT "pages_blocks_carousel_slider_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_carousel_slider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_centered_with_media_links" ADD CONSTRAINT "pages_blocks_centered_with_media_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_centered_with_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_centered_with_media_links_locales" ADD CONSTRAINT "pages_blocks_centered_with_media_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_centered_with_media_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_centered_with_media" ADD CONSTRAINT "pages_blocks_centered_with_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_centered_with_media" ADD CONSTRAINT "pages_blocks_centered_with_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_centered_with_media_locales" ADD CONSTRAINT "pages_blocks_centered_with_media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_centered_with_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_columns" ADD CONSTRAINT "pages_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_columns_locales" ADD CONSTRAINT "pages_blocks_content_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_items" ADD CONSTRAINT "pages_blocks_features_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_items" ADD CONSTRAINT "pages_blocks_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_items_locales" ADD CONSTRAINT "pages_blocks_features_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features" ADD CONSTRAINT "pages_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_menu" ADD CONSTRAINT "pages_blocks_menu_menu_id_menus_id_fk" FOREIGN KEY ("menu_id") REFERENCES "public"."menus"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_menu" ADD CONSTRAINT "pages_blocks_menu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_menu_locales" ADD CONSTRAINT "pages_blocks_menu_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_display_info_items" ADD CONSTRAINT "menu_display_info_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_display"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_display_menu_items" ADD CONSTRAINT "menu_display_menu_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_display"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_display_pricing_items" ADD CONSTRAINT "menu_display_pricing_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_display"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_display" ADD CONSTRAINT "menu_display_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "menu_display" ADD CONSTRAINT "menu_display_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_display_locales" ADD CONSTRAINT "menu_display_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_display"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "two_col_content_media_links" ADD CONSTRAINT "two_col_content_media_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."two_col_content_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "two_col_content_media_links_locales" ADD CONSTRAINT "two_col_content_media_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."two_col_content_media_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "two_col_content_media" ADD CONSTRAINT "two_col_content_media_media_primary_id_media_id_fk" FOREIGN KEY ("media_primary_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "two_col_content_media" ADD CONSTRAINT "two_col_content_media_media_secondary_id_media_id_fk" FOREIGN KEY ("media_secondary_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "two_col_content_media" ADD CONSTRAINT "two_col_content_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "two_col_content_media_locales" ADD CONSTRAINT "two_col_content_media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."two_col_content_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_links" ADD CONSTRAINT "_pages_v_version_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_links_locales" ADD CONSTRAINT "_pages_v_version_hero_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_version_hero_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_links" ADD CONSTRAINT "_pages_v_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_links_locales" ADD CONSTRAINT "_pages_v_blocks_cta_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_locales" ADD CONSTRAINT "_pages_v_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_carousel_slider_items" ADD CONSTRAINT "_pages_v_blocks_carousel_slider_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_carousel_slider_items" ADD CONSTRAINT "_pages_v_blocks_carousel_slider_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_carousel_slider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_carousel_slider_items_locales" ADD CONSTRAINT "_pages_v_blocks_carousel_slider_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_carousel_slider_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_carousel_slider" ADD CONSTRAINT "_pages_v_blocks_carousel_slider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_carousel_slider_locales" ADD CONSTRAINT "_pages_v_blocks_carousel_slider_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_carousel_slider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_centered_with_media_links" ADD CONSTRAINT "_pages_v_blocks_centered_with_media_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_centered_with_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_centered_with_media_links_locales" ADD CONSTRAINT "_pages_v_blocks_centered_with_media_links_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_centered_with_media_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_centered_with_media" ADD CONSTRAINT "_pages_v_blocks_centered_with_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_centered_with_media" ADD CONSTRAINT "_pages_v_blocks_centered_with_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_centered_with_media_locales" ADD CONSTRAINT "_pages_v_blocks_centered_with_media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_centered_with_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_columns" ADD CONSTRAINT "_pages_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_columns_locales" ADD CONSTRAINT "_pages_v_blocks_content_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content" ADD CONSTRAINT "_pages_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_items" ADD CONSTRAINT "_pages_v_blocks_features_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_items" ADD CONSTRAINT "_pages_v_blocks_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_items_locales" ADD CONSTRAINT "_pages_v_blocks_features_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_features_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features" ADD CONSTRAINT "_pages_v_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_menu" ADD CONSTRAINT "_pages_v_blocks_menu_menu_id_menus_id_fk" FOREIGN KEY ("menu_id") REFERENCES "public"."menus"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_menu" ADD CONSTRAINT "_pages_v_blocks_menu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_menu_locales" ADD CONSTRAINT "_pages_v_blocks_menu_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_menu_display_v_info_items" ADD CONSTRAINT "_menu_display_v_info_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menu_display_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_menu_display_v_menu_items" ADD CONSTRAINT "_menu_display_v_menu_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menu_display_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_menu_display_v_pricing_items" ADD CONSTRAINT "_menu_display_v_pricing_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menu_display_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_menu_display_v" ADD CONSTRAINT "_menu_display_v_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_menu_display_v" ADD CONSTRAINT "_menu_display_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_menu_display_v_locales" ADD CONSTRAINT "_menu_display_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menu_display_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_two_col_content_media_v_links" ADD CONSTRAINT "_two_col_content_media_v_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_two_col_content_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_two_col_content_media_v_links_locales" ADD CONSTRAINT "_two_col_content_media_v_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_two_col_content_media_v_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_two_col_content_media_v" ADD CONSTRAINT "_two_col_content_media_v_media_primary_id_media_id_fk" FOREIGN KEY ("media_primary_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_two_col_content_media_v" ADD CONSTRAINT "_two_col_content_media_v_media_secondary_id_media_id_fk" FOREIGN KEY ("media_secondary_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_two_col_content_media_v" ADD CONSTRAINT "_two_col_content_media_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_two_col_content_media_v_locales" ADD CONSTRAINT "_two_col_content_media_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_two_col_content_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dishes_allergens" ADD CONSTRAINT "dishes_allergens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dishes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dishes" ADD CONSTRAINT "dishes_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "dishes_locales" ADD CONSTRAINT "dishes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dishes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menus_locales" ADD CONSTRAINT "menus_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menus_rels" ADD CONSTRAINT "menus_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."menus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menus_rels" ADD CONSTRAINT "menus_rels_dishes_fk" FOREIGN KEY ("dishes_id") REFERENCES "public"."dishes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "plugin_ai_instructions_images" ADD CONSTRAINT "plugin_ai_instructions_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "plugin_ai_instructions_images" ADD CONSTRAINT "plugin_ai_instructions_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."plugin_ai_instructions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox_locales" ADD CONSTRAINT "forms_blocks_checkbox_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_checkbox"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country" ADD CONSTRAINT "forms_blocks_country_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country_locales" ADD CONSTRAINT "forms_blocks_country_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_country"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email_locales" ADD CONSTRAINT "forms_blocks_email_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_email"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message_locales" ADD CONSTRAINT "forms_blocks_message_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_message"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number_locales" ADD CONSTRAINT "forms_blocks_number_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_number"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options_locales" ADD CONSTRAINT "forms_blocks_select_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_locales" ADD CONSTRAINT "forms_blocks_select_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state" ADD CONSTRAINT "forms_blocks_state_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state_locales" ADD CONSTRAINT "forms_blocks_state_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_state"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text_locales" ADD CONSTRAINT "forms_blocks_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea_locales" ADD CONSTRAINT "forms_blocks_textarea_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_textarea"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_reservation_field" ADD CONSTRAINT "forms_blocks_reservation_field_reservation_type_id_reservation_types_id_fk" FOREIGN KEY ("reservation_type_id") REFERENCES "public"."reservation_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forms_blocks_reservation_field" ADD CONSTRAINT "forms_blocks_reservation_field_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_row_columns" ADD CONSTRAINT "forms_blocks_row_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_row"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_row" ADD CONSTRAINT "forms_blocks_row_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_stepper_steps" ADD CONSTRAINT "forms_blocks_stepper_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_stepper"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_stepper" ADD CONSTRAINT "forms_blocks_stepper_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails_locales" ADD CONSTRAINT "forms_emails_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_emails"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_actions_mask_fields" ADD CONSTRAINT "forms_actions_mask_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_actions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_actions" ADD CONSTRAINT "forms_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_locales" ADD CONSTRAINT "forms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reservation_types_available_days" ADD CONSTRAINT "reservation_types_available_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."reservation_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reservation_types_time_slots" ADD CONSTRAINT "reservation_types_time_slots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reservation_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reservation_types" ADD CONSTRAINT "reservation_types_inherits_from_id_reservation_types_id_fk" FOREIGN KEY ("inherits_from_id") REFERENCES "public"."reservation_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reservations" ADD CONSTRAINT "reservations_reservation_type_id_reservation_types_id_fk" FOREIGN KEY ("reservation_type_id") REFERENCES "public"."reservation_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reservations" ADD CONSTRAINT "reservations_form_submission_id_form_submissions_id_fk" FOREIGN KEY ("form_submission_id") REFERENCES "public"."form_submissions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders_folder_type" ADD CONSTRAINT "payload_folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders" ADD CONSTRAINT "payload_folders_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_dishes_fk" FOREIGN KEY ("dishes_id") REFERENCES "public"."dishes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_menus_fk" FOREIGN KEY ("menus_id") REFERENCES "public"."menus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_plugin_ai_instructions_fk" FOREIGN KEY ("plugin_ai_instructions_id") REFERENCES "public"."plugin_ai_instructions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reservation_types_fk" FOREIGN KEY ("reservation_types_id") REFERENCES "public"."reservation_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reservations_fk" FOREIGN KEY ("reservations_id") REFERENCES "public"."reservations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_folders_fk" FOREIGN KEY ("payload_folders_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_language_selector_languages" ADD CONSTRAINT "header_language_selector_languages_flag_id_media_id_fk" FOREIGN KEY ("flag_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_language_selector_languages" ADD CONSTRAINT "header_language_selector_languages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_socials" ADD CONSTRAINT "footer_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_nav_items" ADD CONSTRAINT "footer_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "chatbot_welcome_quick_replies" ADD CONSTRAINT "chatbot_welcome_quick_replies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."chatbot"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "chatbot_faqs_keywords" ADD CONSTRAINT "chatbot_faqs_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."chatbot_faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "chatbot_faqs_patterns" ADD CONSTRAINT "chatbot_faqs_patterns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."chatbot_faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "chatbot_faqs_quick_replies" ADD CONSTRAINT "chatbot_faqs_quick_replies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."chatbot_faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "chatbot_faqs" ADD CONSTRAINT "chatbot_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."chatbot"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "chatbot_faqs_locales" ADD CONSTRAINT "chatbot_faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."chatbot_faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "chatbot_locales" ADD CONSTRAINT "chatbot_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."chatbot"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_hero_links_order_idx" ON "pages_hero_links" USING btree ("_order");
  CREATE INDEX "pages_hero_links_parent_id_idx" ON "pages_hero_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_hero_links_locales_locale_parent_id_unique" ON "pages_hero_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cta_links_order_idx" ON "pages_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_links_parent_id_idx" ON "pages_blocks_cta_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_cta_links_locales_locale_parent_id_unique" ON "pages_blocks_cta_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_cta_locales_locale_parent_id_unique" ON "pages_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_carousel_slider_items_order_idx" ON "pages_blocks_carousel_slider_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_carousel_slider_items_parent_id_idx" ON "pages_blocks_carousel_slider_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_carousel_slider_items_media_idx" ON "pages_blocks_carousel_slider_items" USING btree ("media_id");
  CREATE UNIQUE INDEX "pages_blocks_carousel_slider_items_locales_locale_parent_id_" ON "pages_blocks_carousel_slider_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_carousel_slider_order_idx" ON "pages_blocks_carousel_slider" USING btree ("_order");
  CREATE INDEX "pages_blocks_carousel_slider_parent_id_idx" ON "pages_blocks_carousel_slider" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_carousel_slider_path_idx" ON "pages_blocks_carousel_slider" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_carousel_slider_locales_locale_parent_id_unique" ON "pages_blocks_carousel_slider_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_centered_with_media_links_order_idx" ON "pages_blocks_centered_with_media_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_centered_with_media_links_parent_id_idx" ON "pages_blocks_centered_with_media_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_centered_with_media_links_locales_locale_parent" ON "pages_blocks_centered_with_media_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_centered_with_media_order_idx" ON "pages_blocks_centered_with_media" USING btree ("_order");
  CREATE INDEX "pages_blocks_centered_with_media_parent_id_idx" ON "pages_blocks_centered_with_media" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_centered_with_media_path_idx" ON "pages_blocks_centered_with_media" USING btree ("_path");
  CREATE INDEX "pages_blocks_centered_with_media_media_idx" ON "pages_blocks_centered_with_media" USING btree ("media_id");
  CREATE UNIQUE INDEX "pages_blocks_centered_with_media_locales_locale_parent_id_un" ON "pages_blocks_centered_with_media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_content_columns_order_idx" ON "pages_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_columns_parent_id_idx" ON "pages_blocks_content_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_content_columns_locales_locale_parent_id_unique" ON "pages_blocks_content_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_content_order_idx" ON "pages_blocks_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_parent_id_idx" ON "pages_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_path_idx" ON "pages_blocks_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_features_items_order_idx" ON "pages_blocks_features_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_items_parent_id_idx" ON "pages_blocks_features_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_items_icon_idx" ON "pages_blocks_features_items" USING btree ("icon_id");
  CREATE UNIQUE INDEX "pages_blocks_features_items_locales_locale_parent_id_unique" ON "pages_blocks_features_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_features_order_idx" ON "pages_blocks_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_parent_id_idx" ON "pages_blocks_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_path_idx" ON "pages_blocks_features" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_block_order_idx" ON "pages_blocks_media_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_block_parent_id_idx" ON "pages_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_block_path_idx" ON "pages_blocks_media_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_block_media_idx" ON "pages_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "pages_blocks_form_block_order_idx" ON "pages_blocks_form_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_block_parent_id_idx" ON "pages_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_block_path_idx" ON "pages_blocks_form_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_block_form_idx" ON "pages_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "pages_blocks_menu_order_idx" ON "pages_blocks_menu" USING btree ("_order");
  CREATE INDEX "pages_blocks_menu_parent_id_idx" ON "pages_blocks_menu" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_menu_path_idx" ON "pages_blocks_menu" USING btree ("_path");
  CREATE INDEX "pages_blocks_menu_menu_idx" ON "pages_blocks_menu" USING btree ("menu_id");
  CREATE UNIQUE INDEX "pages_blocks_menu_locales_locale_parent_id_unique" ON "pages_blocks_menu_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "menu_display_info_items_order_idx" ON "menu_display_info_items" USING btree ("_order");
  CREATE INDEX "menu_display_info_items_parent_id_idx" ON "menu_display_info_items" USING btree ("_parent_id");
  CREATE INDEX "menu_display_info_items_locale_idx" ON "menu_display_info_items" USING btree ("_locale");
  CREATE INDEX "menu_display_menu_items_order_idx" ON "menu_display_menu_items" USING btree ("_order");
  CREATE INDEX "menu_display_menu_items_parent_id_idx" ON "menu_display_menu_items" USING btree ("_parent_id");
  CREATE INDEX "menu_display_menu_items_locale_idx" ON "menu_display_menu_items" USING btree ("_locale");
  CREATE INDEX "menu_display_pricing_items_order_idx" ON "menu_display_pricing_items" USING btree ("_order");
  CREATE INDEX "menu_display_pricing_items_parent_id_idx" ON "menu_display_pricing_items" USING btree ("_parent_id");
  CREATE INDEX "menu_display_pricing_items_locale_idx" ON "menu_display_pricing_items" USING btree ("_locale");
  CREATE INDEX "menu_display_order_idx" ON "menu_display" USING btree ("_order");
  CREATE INDEX "menu_display_parent_id_idx" ON "menu_display" USING btree ("_parent_id");
  CREATE INDEX "menu_display_path_idx" ON "menu_display" USING btree ("_path");
  CREATE INDEX "menu_display_background_image_idx" ON "menu_display" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "menu_display_locales_locale_parent_id_unique" ON "menu_display_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "two_col_content_media_links_order_idx" ON "two_col_content_media_links" USING btree ("_order");
  CREATE INDEX "two_col_content_media_links_parent_id_idx" ON "two_col_content_media_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "two_col_content_media_links_locales_locale_parent_id_unique" ON "two_col_content_media_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "two_col_content_media_order_idx" ON "two_col_content_media" USING btree ("_order");
  CREATE INDEX "two_col_content_media_parent_id_idx" ON "two_col_content_media" USING btree ("_parent_id");
  CREATE INDEX "two_col_content_media_path_idx" ON "two_col_content_media" USING btree ("_path");
  CREATE INDEX "two_col_content_media_media_primary_idx" ON "two_col_content_media" USING btree ("media_primary_id");
  CREATE INDEX "two_col_content_media_media_secondary_idx" ON "two_col_content_media" USING btree ("media_secondary_id");
  CREATE UNIQUE INDEX "two_col_content_media_locales_locale_parent_id_unique" ON "two_col_content_media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_hero_hero_media_idx" ON "pages" USING btree ("hero_media_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_pages_id_idx" ON "pages_rels" USING btree ("pages_id");
  CREATE INDEX "_pages_v_version_hero_links_order_idx" ON "_pages_v_version_hero_links" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_links_parent_id_idx" ON "_pages_v_version_hero_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_version_hero_links_locales_locale_parent_id_unique" ON "_pages_v_version_hero_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_links_order_idx" ON "_pages_v_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_links_parent_id_idx" ON "_pages_v_blocks_cta_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_cta_links_locales_locale_parent_id_unique" ON "_pages_v_blocks_cta_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_cta_locales_locale_parent_id_unique" ON "_pages_v_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_carousel_slider_items_order_idx" ON "_pages_v_blocks_carousel_slider_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_carousel_slider_items_parent_id_idx" ON "_pages_v_blocks_carousel_slider_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_carousel_slider_items_media_idx" ON "_pages_v_blocks_carousel_slider_items" USING btree ("media_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_carousel_slider_items_locales_locale_parent_" ON "_pages_v_blocks_carousel_slider_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_carousel_slider_order_idx" ON "_pages_v_blocks_carousel_slider" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_carousel_slider_parent_id_idx" ON "_pages_v_blocks_carousel_slider" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_carousel_slider_path_idx" ON "_pages_v_blocks_carousel_slider" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_carousel_slider_locales_locale_parent_id_uni" ON "_pages_v_blocks_carousel_slider_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_centered_with_media_links_order_idx" ON "_pages_v_blocks_centered_with_media_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_centered_with_media_links_parent_id_idx" ON "_pages_v_blocks_centered_with_media_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_centered_with_media_links_locales_locale_par" ON "_pages_v_blocks_centered_with_media_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_centered_with_media_order_idx" ON "_pages_v_blocks_centered_with_media" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_centered_with_media_parent_id_idx" ON "_pages_v_blocks_centered_with_media" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_centered_with_media_path_idx" ON "_pages_v_blocks_centered_with_media" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_centered_with_media_media_idx" ON "_pages_v_blocks_centered_with_media" USING btree ("media_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_centered_with_media_locales_locale_parent_id" ON "_pages_v_blocks_centered_with_media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_content_columns_order_idx" ON "_pages_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_columns_parent_id_idx" ON "_pages_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_content_columns_locales_locale_parent_id_uni" ON "_pages_v_blocks_content_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_content_order_idx" ON "_pages_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_parent_id_idx" ON "_pages_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_path_idx" ON "_pages_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_features_items_order_idx" ON "_pages_v_blocks_features_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_items_parent_id_idx" ON "_pages_v_blocks_features_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_items_icon_idx" ON "_pages_v_blocks_features_items" USING btree ("icon_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_features_items_locales_locale_parent_id_uniq" ON "_pages_v_blocks_features_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_features_order_idx" ON "_pages_v_blocks_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_parent_id_idx" ON "_pages_v_blocks_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_path_idx" ON "_pages_v_blocks_features" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_block_order_idx" ON "_pages_v_blocks_media_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_block_parent_id_idx" ON "_pages_v_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_block_path_idx" ON "_pages_v_blocks_media_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_block_media_idx" ON "_pages_v_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_form_block_order_idx" ON "_pages_v_blocks_form_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_block_parent_id_idx" ON "_pages_v_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_block_path_idx" ON "_pages_v_blocks_form_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_block_form_idx" ON "_pages_v_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "_pages_v_blocks_menu_order_idx" ON "_pages_v_blocks_menu" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_menu_parent_id_idx" ON "_pages_v_blocks_menu" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_menu_path_idx" ON "_pages_v_blocks_menu" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_menu_menu_idx" ON "_pages_v_blocks_menu" USING btree ("menu_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_menu_locales_locale_parent_id_unique" ON "_pages_v_blocks_menu_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_menu_display_v_info_items_order_idx" ON "_menu_display_v_info_items" USING btree ("_order");
  CREATE INDEX "_menu_display_v_info_items_parent_id_idx" ON "_menu_display_v_info_items" USING btree ("_parent_id");
  CREATE INDEX "_menu_display_v_info_items_locale_idx" ON "_menu_display_v_info_items" USING btree ("_locale");
  CREATE INDEX "_menu_display_v_menu_items_order_idx" ON "_menu_display_v_menu_items" USING btree ("_order");
  CREATE INDEX "_menu_display_v_menu_items_parent_id_idx" ON "_menu_display_v_menu_items" USING btree ("_parent_id");
  CREATE INDEX "_menu_display_v_menu_items_locale_idx" ON "_menu_display_v_menu_items" USING btree ("_locale");
  CREATE INDEX "_menu_display_v_pricing_items_order_idx" ON "_menu_display_v_pricing_items" USING btree ("_order");
  CREATE INDEX "_menu_display_v_pricing_items_parent_id_idx" ON "_menu_display_v_pricing_items" USING btree ("_parent_id");
  CREATE INDEX "_menu_display_v_pricing_items_locale_idx" ON "_menu_display_v_pricing_items" USING btree ("_locale");
  CREATE INDEX "_menu_display_v_order_idx" ON "_menu_display_v" USING btree ("_order");
  CREATE INDEX "_menu_display_v_parent_id_idx" ON "_menu_display_v" USING btree ("_parent_id");
  CREATE INDEX "_menu_display_v_path_idx" ON "_menu_display_v" USING btree ("_path");
  CREATE INDEX "_menu_display_v_background_image_idx" ON "_menu_display_v" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "_menu_display_v_locales_locale_parent_id_unique" ON "_menu_display_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_two_col_content_media_v_links_order_idx" ON "_two_col_content_media_v_links" USING btree ("_order");
  CREATE INDEX "_two_col_content_media_v_links_parent_id_idx" ON "_two_col_content_media_v_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_two_col_content_media_v_links_locales_locale_parent_id_uniq" ON "_two_col_content_media_v_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_two_col_content_media_v_order_idx" ON "_two_col_content_media_v" USING btree ("_order");
  CREATE INDEX "_two_col_content_media_v_parent_id_idx" ON "_two_col_content_media_v" USING btree ("_parent_id");
  CREATE INDEX "_two_col_content_media_v_path_idx" ON "_two_col_content_media_v" USING btree ("_path");
  CREATE INDEX "_two_col_content_media_v_media_primary_idx" ON "_two_col_content_media_v" USING btree ("media_primary_id");
  CREATE INDEX "_two_col_content_media_v_media_secondary_idx" ON "_two_col_content_media_v" USING btree ("media_secondary_id");
  CREATE UNIQUE INDEX "_two_col_content_media_v_locales_locale_parent_id_unique" ON "_two_col_content_media_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_media_idx" ON "_pages_v" USING btree ("version_hero_media_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_pages_id_idx" ON "_pages_v_rels" USING btree ("pages_id");
  CREATE INDEX "media_folder_idx" ON "media" USING btree ("folder_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_square_sizes_square_filename_idx" ON "media" USING btree ("sizes_square_filename");
  CREATE INDEX "media_sizes_small_sizes_small_filename_idx" ON "media" USING btree ("sizes_small_filename");
  CREATE INDEX "media_sizes_medium_sizes_medium_filename_idx" ON "media" USING btree ("sizes_medium_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX "media_sizes_xlarge_sizes_xlarge_filename_idx" ON "media" USING btree ("sizes_xlarge_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "dishes_allergens_order_idx" ON "dishes_allergens" USING btree ("_order");
  CREATE INDEX "dishes_allergens_parent_id_idx" ON "dishes_allergens" USING btree ("_parent_id");
  CREATE INDEX "dishes_allergens_locale_idx" ON "dishes_allergens" USING btree ("_locale");
  CREATE INDEX "dishes_image_idx" ON "dishes" USING btree ("image_id");
  CREATE INDEX "dishes_updated_at_idx" ON "dishes" USING btree ("updated_at");
  CREATE INDEX "dishes_created_at_idx" ON "dishes" USING btree ("created_at");
  CREATE UNIQUE INDEX "dishes_locales_locale_parent_id_unique" ON "dishes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "menus_slug_idx" ON "menus" USING btree ("slug");
  CREATE INDEX "menus_updated_at_idx" ON "menus" USING btree ("updated_at");
  CREATE INDEX "menus_created_at_idx" ON "menus" USING btree ("created_at");
  CREATE UNIQUE INDEX "menus_locales_locale_parent_id_unique" ON "menus_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "menus_rels_order_idx" ON "menus_rels" USING btree ("order");
  CREATE INDEX "menus_rels_parent_idx" ON "menus_rels" USING btree ("parent_id");
  CREATE INDEX "menus_rels_path_idx" ON "menus_rels" USING btree ("path");
  CREATE INDEX "menus_rels_dishes_id_idx" ON "menus_rels" USING btree ("dishes_id");
  CREATE INDEX "plugin_ai_instructions_images_order_idx" ON "plugin_ai_instructions_images" USING btree ("_order");
  CREATE INDEX "plugin_ai_instructions_images_parent_id_idx" ON "plugin_ai_instructions_images" USING btree ("_parent_id");
  CREATE INDEX "plugin_ai_instructions_images_image_idx" ON "plugin_ai_instructions_images" USING btree ("image_id");
  CREATE UNIQUE INDEX "plugin_ai_instructions_schema_path_idx" ON "plugin_ai_instructions" USING btree ("schema_path");
  CREATE INDEX "plugin_ai_instructions_updated_at_idx" ON "plugin_ai_instructions" USING btree ("updated_at");
  CREATE INDEX "plugin_ai_instructions_created_at_idx" ON "plugin_ai_instructions" USING btree ("created_at");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");
  CREATE INDEX "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_checkbox_locales_locale_parent_id_unique" ON "forms_blocks_checkbox_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_country_order_idx" ON "forms_blocks_country" USING btree ("_order");
  CREATE INDEX "forms_blocks_country_parent_id_idx" ON "forms_blocks_country" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_country_path_idx" ON "forms_blocks_country" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_country_locales_locale_parent_id_unique" ON "forms_blocks_country_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_email_locales_locale_parent_id_unique" ON "forms_blocks_email_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_message_locales_locale_parent_id_unique" ON "forms_blocks_message_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_number_locales_locale_parent_id_unique" ON "forms_blocks_number_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_select_options_locales_locale_parent_id_unique" ON "forms_blocks_select_options_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_select_locales_locale_parent_id_unique" ON "forms_blocks_select_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_state_order_idx" ON "forms_blocks_state" USING btree ("_order");
  CREATE INDEX "forms_blocks_state_parent_id_idx" ON "forms_blocks_state" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_state_path_idx" ON "forms_blocks_state" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_state_locales_locale_parent_id_unique" ON "forms_blocks_state_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_text_locales_locale_parent_id_unique" ON "forms_blocks_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_textarea_locales_locale_parent_id_unique" ON "forms_blocks_textarea_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_reservation_field_order_idx" ON "forms_blocks_reservation_field" USING btree ("_order");
  CREATE INDEX "forms_blocks_reservation_field_parent_id_idx" ON "forms_blocks_reservation_field" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_reservation_field_path_idx" ON "forms_blocks_reservation_field" USING btree ("_path");
  CREATE INDEX "forms_blocks_reservation_field_reservation_type_idx" ON "forms_blocks_reservation_field" USING btree ("reservation_type_id");
  CREATE INDEX "forms_blocks_row_columns_order_idx" ON "forms_blocks_row_columns" USING btree ("_order");
  CREATE INDEX "forms_blocks_row_columns_parent_id_idx" ON "forms_blocks_row_columns" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_row_order_idx" ON "forms_blocks_row" USING btree ("_order");
  CREATE INDEX "forms_blocks_row_parent_id_idx" ON "forms_blocks_row" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_row_path_idx" ON "forms_blocks_row" USING btree ("_path");
  CREATE INDEX "forms_blocks_stepper_steps_order_idx" ON "forms_blocks_stepper_steps" USING btree ("_order");
  CREATE INDEX "forms_blocks_stepper_steps_parent_id_idx" ON "forms_blocks_stepper_steps" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_stepper_order_idx" ON "forms_blocks_stepper" USING btree ("_order");
  CREATE INDEX "forms_blocks_stepper_parent_id_idx" ON "forms_blocks_stepper" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_stepper_path_idx" ON "forms_blocks_stepper" USING btree ("_path");
  CREATE INDEX "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_emails_locales_locale_parent_id_unique" ON "forms_emails_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_actions_mask_fields_order_idx" ON "forms_actions_mask_fields" USING btree ("_order");
  CREATE INDEX "forms_actions_mask_fields_parent_id_idx" ON "forms_actions_mask_fields" USING btree ("_parent_id");
  CREATE INDEX "forms_actions_order_idx" ON "forms_actions" USING btree ("_order");
  CREATE INDEX "forms_actions_parent_id_idx" ON "forms_actions" USING btree ("_parent_id");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE UNIQUE INDEX "forms_locales_locale_parent_id_unique" ON "forms_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE INDEX "reservation_types_available_days_order_idx" ON "reservation_types_available_days" USING btree ("order");
  CREATE INDEX "reservation_types_available_days_parent_idx" ON "reservation_types_available_days" USING btree ("parent_id");
  CREATE INDEX "reservation_types_time_slots_order_idx" ON "reservation_types_time_slots" USING btree ("_order");
  CREATE INDEX "reservation_types_time_slots_parent_id_idx" ON "reservation_types_time_slots" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "reservation_types_slug_idx" ON "reservation_types" USING btree ("slug");
  CREATE INDEX "reservation_types_inherits_from_idx" ON "reservation_types" USING btree ("inherits_from_id");
  CREATE INDEX "reservation_types_updated_at_idx" ON "reservation_types" USING btree ("updated_at");
  CREATE INDEX "reservation_types_created_at_idx" ON "reservation_types" USING btree ("created_at");
  CREATE INDEX "reservations_reservation_type_idx" ON "reservations" USING btree ("reservation_type_id");
  CREATE INDEX "reservations_form_submission_idx" ON "reservations" USING btree ("form_submission_id");
  CREATE INDEX "reservations_updated_at_idx" ON "reservations" USING btree ("updated_at");
  CREATE INDEX "reservations_created_at_idx" ON "reservations" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_folders_folder_type_order_idx" ON "payload_folders_folder_type" USING btree ("order");
  CREATE INDEX "payload_folders_folder_type_parent_idx" ON "payload_folders_folder_type" USING btree ("parent_id");
  CREATE INDEX "payload_folders_name_idx" ON "payload_folders" USING btree ("name");
  CREATE INDEX "payload_folders_folder_idx" ON "payload_folders" USING btree ("folder_id");
  CREATE INDEX "payload_folders_updated_at_idx" ON "payload_folders" USING btree ("updated_at");
  CREATE INDEX "payload_folders_created_at_idx" ON "payload_folders" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_dishes_id_idx" ON "payload_locked_documents_rels" USING btree ("dishes_id");
  CREATE INDEX "payload_locked_documents_rels_menus_id_idx" ON "payload_locked_documents_rels" USING btree ("menus_id");
  CREATE INDEX "payload_locked_documents_rels_plugin_ai_instructions_id_idx" ON "payload_locked_documents_rels" USING btree ("plugin_ai_instructions_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_reservation_types_id_idx" ON "payload_locked_documents_rels" USING btree ("reservation_types_id");
  CREATE INDEX "payload_locked_documents_rels_reservations_id_idx" ON "payload_locked_documents_rels" USING btree ("reservations_id");
  CREATE INDEX "payload_locked_documents_rels_payload_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_folders_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "header_nav_items_order_idx" ON "header_nav_items" USING btree ("_order");
  CREATE INDEX "header_nav_items_parent_id_idx" ON "header_nav_items" USING btree ("_parent_id");
  CREATE INDEX "header_nav_items_locale_idx" ON "header_nav_items" USING btree ("_locale");
  CREATE INDEX "header_language_selector_languages_order_idx" ON "header_language_selector_languages" USING btree ("_order");
  CREATE INDEX "header_language_selector_languages_parent_id_idx" ON "header_language_selector_languages" USING btree ("_parent_id");
  CREATE INDEX "header_language_selector_languages_flag_idx" ON "header_language_selector_languages" USING btree ("flag_id");
  CREATE INDEX "header_rels_order_idx" ON "header_rels" USING btree ("order");
  CREATE INDEX "header_rels_parent_idx" ON "header_rels" USING btree ("parent_id");
  CREATE INDEX "header_rels_path_idx" ON "header_rels" USING btree ("path");
  CREATE INDEX "header_rels_locale_idx" ON "header_rels" USING btree ("locale");
  CREATE INDEX "header_rels_pages_id_idx" ON "header_rels" USING btree ("pages_id","locale");
  CREATE INDEX "footer_socials_order_idx" ON "footer_socials" USING btree ("_order");
  CREATE INDEX "footer_socials_parent_id_idx" ON "footer_socials" USING btree ("_parent_id");
  CREATE INDEX "footer_socials_locale_idx" ON "footer_socials" USING btree ("_locale");
  CREATE INDEX "footer_nav_items_order_idx" ON "footer_nav_items" USING btree ("_order");
  CREATE INDEX "footer_nav_items_parent_id_idx" ON "footer_nav_items" USING btree ("_parent_id");
  CREATE INDEX "footer_nav_items_locale_idx" ON "footer_nav_items" USING btree ("_locale");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_rels_order_idx" ON "footer_rels" USING btree ("order");
  CREATE INDEX "footer_rels_parent_idx" ON "footer_rels" USING btree ("parent_id");
  CREATE INDEX "footer_rels_path_idx" ON "footer_rels" USING btree ("path");
  CREATE INDEX "footer_rels_locale_idx" ON "footer_rels" USING btree ("locale");
  CREATE INDEX "footer_rels_pages_id_idx" ON "footer_rels" USING btree ("pages_id","locale");
  CREATE INDEX "chatbot_welcome_quick_replies_order_idx" ON "chatbot_welcome_quick_replies" USING btree ("_order");
  CREATE INDEX "chatbot_welcome_quick_replies_parent_id_idx" ON "chatbot_welcome_quick_replies" USING btree ("_parent_id");
  CREATE INDEX "chatbot_welcome_quick_replies_locale_idx" ON "chatbot_welcome_quick_replies" USING btree ("_locale");
  CREATE INDEX "chatbot_faqs_keywords_order_idx" ON "chatbot_faqs_keywords" USING btree ("_order");
  CREATE INDEX "chatbot_faqs_keywords_parent_id_idx" ON "chatbot_faqs_keywords" USING btree ("_parent_id");
  CREATE INDEX "chatbot_faqs_keywords_locale_idx" ON "chatbot_faqs_keywords" USING btree ("_locale");
  CREATE INDEX "chatbot_faqs_patterns_order_idx" ON "chatbot_faqs_patterns" USING btree ("_order");
  CREATE INDEX "chatbot_faqs_patterns_parent_id_idx" ON "chatbot_faqs_patterns" USING btree ("_parent_id");
  CREATE INDEX "chatbot_faqs_patterns_locale_idx" ON "chatbot_faqs_patterns" USING btree ("_locale");
  CREATE INDEX "chatbot_faqs_quick_replies_order_idx" ON "chatbot_faqs_quick_replies" USING btree ("_order");
  CREATE INDEX "chatbot_faqs_quick_replies_parent_id_idx" ON "chatbot_faqs_quick_replies" USING btree ("_parent_id");
  CREATE INDEX "chatbot_faqs_quick_replies_locale_idx" ON "chatbot_faqs_quick_replies" USING btree ("_locale");
  CREATE INDEX "chatbot_faqs_order_idx" ON "chatbot_faqs" USING btree ("_order");
  CREATE INDEX "chatbot_faqs_parent_id_idx" ON "chatbot_faqs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "chatbot_faqs_locales_locale_parent_id_unique" ON "chatbot_faqs_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "chatbot_locales_locale_parent_id_unique" ON "chatbot_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_hero_links" CASCADE;
  DROP TABLE "pages_hero_links_locales" CASCADE;
  DROP TABLE "pages_blocks_cta_links" CASCADE;
  DROP TABLE "pages_blocks_cta_links_locales" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_cta_locales" CASCADE;
  DROP TABLE "pages_blocks_carousel_slider_items" CASCADE;
  DROP TABLE "pages_blocks_carousel_slider_items_locales" CASCADE;
  DROP TABLE "pages_blocks_carousel_slider" CASCADE;
  DROP TABLE "pages_blocks_carousel_slider_locales" CASCADE;
  DROP TABLE "pages_blocks_centered_with_media_links" CASCADE;
  DROP TABLE "pages_blocks_centered_with_media_links_locales" CASCADE;
  DROP TABLE "pages_blocks_centered_with_media" CASCADE;
  DROP TABLE "pages_blocks_centered_with_media_locales" CASCADE;
  DROP TABLE "pages_blocks_content_columns" CASCADE;
  DROP TABLE "pages_blocks_content_columns_locales" CASCADE;
  DROP TABLE "pages_blocks_content" CASCADE;
  DROP TABLE "pages_blocks_features_items" CASCADE;
  DROP TABLE "pages_blocks_features_items_locales" CASCADE;
  DROP TABLE "pages_blocks_features" CASCADE;
  DROP TABLE "pages_blocks_media_block" CASCADE;
  DROP TABLE "pages_blocks_form_block" CASCADE;
  DROP TABLE "pages_blocks_menu" CASCADE;
  DROP TABLE "pages_blocks_menu_locales" CASCADE;
  DROP TABLE "menu_display_info_items" CASCADE;
  DROP TABLE "menu_display_menu_items" CASCADE;
  DROP TABLE "menu_display_pricing_items" CASCADE;
  DROP TABLE "menu_display" CASCADE;
  DROP TABLE "menu_display_locales" CASCADE;
  DROP TABLE "two_col_content_media_links" CASCADE;
  DROP TABLE "two_col_content_media_links_locales" CASCADE;
  DROP TABLE "two_col_content_media" CASCADE;
  DROP TABLE "two_col_content_media_locales" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_version_hero_links" CASCADE;
  DROP TABLE "_pages_v_version_hero_links_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_links" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_links_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_carousel_slider_items" CASCADE;
  DROP TABLE "_pages_v_blocks_carousel_slider_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_carousel_slider" CASCADE;
  DROP TABLE "_pages_v_blocks_carousel_slider_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_centered_with_media_links" CASCADE;
  DROP TABLE "_pages_v_blocks_centered_with_media_links_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_centered_with_media" CASCADE;
  DROP TABLE "_pages_v_blocks_centered_with_media_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_content_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_content_columns_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_content" CASCADE;
  DROP TABLE "_pages_v_blocks_features_items" CASCADE;
  DROP TABLE "_pages_v_blocks_features_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_features" CASCADE;
  DROP TABLE "_pages_v_blocks_media_block" CASCADE;
  DROP TABLE "_pages_v_blocks_form_block" CASCADE;
  DROP TABLE "_pages_v_blocks_menu" CASCADE;
  DROP TABLE "_pages_v_blocks_menu_locales" CASCADE;
  DROP TABLE "_menu_display_v_info_items" CASCADE;
  DROP TABLE "_menu_display_v_menu_items" CASCADE;
  DROP TABLE "_menu_display_v_pricing_items" CASCADE;
  DROP TABLE "_menu_display_v" CASCADE;
  DROP TABLE "_menu_display_v_locales" CASCADE;
  DROP TABLE "_two_col_content_media_v_links" CASCADE;
  DROP TABLE "_two_col_content_media_v_links_locales" CASCADE;
  DROP TABLE "_two_col_content_media_v" CASCADE;
  DROP TABLE "_two_col_content_media_v_locales" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "dishes_allergens" CASCADE;
  DROP TABLE "dishes" CASCADE;
  DROP TABLE "dishes_locales" CASCADE;
  DROP TABLE "menus" CASCADE;
  DROP TABLE "menus_locales" CASCADE;
  DROP TABLE "menus_rels" CASCADE;
  DROP TABLE "plugin_ai_instructions_images" CASCADE;
  DROP TABLE "plugin_ai_instructions" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "forms_blocks_checkbox_locales" CASCADE;
  DROP TABLE "forms_blocks_country" CASCADE;
  DROP TABLE "forms_blocks_country_locales" CASCADE;
  DROP TABLE "forms_blocks_email" CASCADE;
  DROP TABLE "forms_blocks_email_locales" CASCADE;
  DROP TABLE "forms_blocks_message" CASCADE;
  DROP TABLE "forms_blocks_message_locales" CASCADE;
  DROP TABLE "forms_blocks_number" CASCADE;
  DROP TABLE "forms_blocks_number_locales" CASCADE;
  DROP TABLE "forms_blocks_select_options" CASCADE;
  DROP TABLE "forms_blocks_select_options_locales" CASCADE;
  DROP TABLE "forms_blocks_select" CASCADE;
  DROP TABLE "forms_blocks_select_locales" CASCADE;
  DROP TABLE "forms_blocks_state" CASCADE;
  DROP TABLE "forms_blocks_state_locales" CASCADE;
  DROP TABLE "forms_blocks_text" CASCADE;
  DROP TABLE "forms_blocks_text_locales" CASCADE;
  DROP TABLE "forms_blocks_textarea" CASCADE;
  DROP TABLE "forms_blocks_textarea_locales" CASCADE;
  DROP TABLE "forms_blocks_reservation_field" CASCADE;
  DROP TABLE "forms_blocks_row_columns" CASCADE;
  DROP TABLE "forms_blocks_row" CASCADE;
  DROP TABLE "forms_blocks_stepper_steps" CASCADE;
  DROP TABLE "forms_blocks_stepper" CASCADE;
  DROP TABLE "forms_emails" CASCADE;
  DROP TABLE "forms_emails_locales" CASCADE;
  DROP TABLE "forms_actions_mask_fields" CASCADE;
  DROP TABLE "forms_actions" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "forms_locales" CASCADE;
  DROP TABLE "form_submissions_submission_data" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "reservation_types_available_days" CASCADE;
  DROP TABLE "reservation_types_time_slots" CASCADE;
  DROP TABLE "reservation_types" CASCADE;
  DROP TABLE "reservations" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_folders_folder_type" CASCADE;
  DROP TABLE "payload_folders" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "header_nav_items" CASCADE;
  DROP TABLE "header_language_selector_languages" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "header_rels" CASCADE;
  DROP TABLE "footer_socials" CASCADE;
  DROP TABLE "footer_nav_items" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  DROP TABLE "footer_rels" CASCADE;
  DROP TABLE "chatbot_welcome_quick_replies" CASCADE;
  DROP TABLE "chatbot_faqs_keywords" CASCADE;
  DROP TABLE "chatbot_faqs_patterns" CASCADE;
  DROP TABLE "chatbot_faqs_quick_replies" CASCADE;
  DROP TABLE "chatbot_faqs" CASCADE;
  DROP TABLE "chatbot_faqs_locales" CASCADE;
  DROP TABLE "chatbot" CASCADE;
  DROP TABLE "chatbot_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_pages_hero_links_link_type";
  DROP TYPE "public"."enum_pages_hero_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_cta_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_carousel_slider_items_link_type";
  DROP TYPE "public"."enum_pages_blocks_carousel_slider_items_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_centered_with_media_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_centered_with_media_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_content_columns_size";
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_type";
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_form_block_background_color";
  DROP TYPE "public"."enum_pages_blocks_menu_section_background_color";
  DROP TYPE "public"."enum_menu_display_info_items_type";
  DROP TYPE "public"."enum_menu_display_section_background_color";
  DROP TYPE "public"."enum_two_col_content_media_links_link_type";
  DROP TYPE "public"."enum_two_col_content_media_links_link_appearance";
  DROP TYPE "public"."enum_two_col_content_media_content_position";
  DROP TYPE "public"."enum_two_col_content_media_media_layout";
  DROP TYPE "public"."enum_two_col_content_media_background_color";
  DROP TYPE "public"."enum_two_col_content_media_media_background_color";
  DROP TYPE "public"."enum_pages_hero_type";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_type";
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_cta_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_carousel_slider_items_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_carousel_slider_items_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_centered_with_media_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_centered_with_media_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_size";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_form_block_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_menu_section_background_color";
  DROP TYPE "public"."enum__menu_display_v_info_items_type";
  DROP TYPE "public"."enum__menu_display_v_section_background_color";
  DROP TYPE "public"."enum__two_col_content_media_v_links_link_type";
  DROP TYPE "public"."enum__two_col_content_media_v_links_link_appearance";
  DROP TYPE "public"."enum__two_col_content_media_v_content_position";
  DROP TYPE "public"."enum__two_col_content_media_v_media_layout";
  DROP TYPE "public"."enum__two_col_content_media_v_background_color";
  DROP TYPE "public"."enum__two_col_content_media_v_media_background_color";
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_dishes_category";
  DROP TYPE "public"."enum_plugin_ai_instructions_field_type";
  DROP TYPE "public"."enum_plugin_ai_instructions_model_id";
  DROP TYPE "public"."enum_plugin_ai_instructions_oai_text_settings_model";
  DROP TYPE "public"."enum_plugin_ai_instructions_dalle_e_settings_version";
  DROP TYPE "public"."enum_plugin_ai_instructions_dalle_e_settings_size";
  DROP TYPE "public"."enum_plugin_ai_instructions_dalle_e_settings_style";
  DROP TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_version";
  DROP TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_size";
  DROP TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_quality";
  DROP TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_output_format";
  DROP TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_background";
  DROP TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_moderation";
  DROP TYPE "public"."enum_plugin_ai_instructions_oai_tts_settings_voice";
  DROP TYPE "public"."enum_plugin_ai_instructions_oai_tts_settings_model";
  DROP TYPE "public"."enum_plugin_ai_instructions_oai_tts_settings_response_format";
  DROP TYPE "public"."enum_plugin_ai_instructions_oai_object_settings_model";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_forms_blocks_row_columns_width";
  DROP TYPE "public"."enum_forms_actions_type";
  DROP TYPE "public"."enum_forms_confirmation_type";
  DROP TYPE "public"."enum_reservation_types_available_days";
  DROP TYPE "public"."enum_reservations_status";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_payload_folders_folder_type";
  DROP TYPE "public"."enum_header_nav_items_link_type";
  DROP TYPE "public"."enum_header_language_selector_languages_code";
  DROP TYPE "public"."enum_footer_socials_platform";
  DROP TYPE "public"."enum_footer_nav_items_link_type";`)
}
