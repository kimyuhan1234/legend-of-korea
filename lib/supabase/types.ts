// ============================================================
// Legend of Korea — Supabase Database Types
// supabase gen types typescript --project-id isixbzxophgxrfgjesaa
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// 다국어 텍스트 헬퍼 타입
export interface I18nText {
  ko: string
  ja?: string
  en?: string
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          nickname: string
          language: "ko" | "ja" | "en"
          social_provider: string | null
          avatar_url: string | null
          total_lp: number
          current_tier: number
          role: "user" | "admin"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          nickname: string
          language?: "ko" | "ja" | "en"
          social_provider?: string | null
          avatar_url?: string | null
          total_lp?: number
          current_tier?: number
          role?: "user" | "admin"
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string
          nickname?: string
          language?: "ko" | "ja" | "en"
          social_provider?: string | null
          avatar_url?: string | null
          total_lp?: number
          current_tier?: number
          role?: "user" | "admin"
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          id: string
          legend_type: string
          region: string
          difficulty: "easy" | "medium" | "hard"
          duration_text: I18nText
          title: I18nText
          description: I18nText
          thumbnail_url: string | null
          video_url: string | null
          price_1p: number
          price_2p: number
          is_active: boolean
          season: string | null
          created_at: string
        }
        Insert: {
          id?: string
          legend_type: string
          region: string
          difficulty: "easy" | "medium" | "hard"
          duration_text: I18nText
          title: I18nText
          description: I18nText
          thumbnail_url?: string | null
          video_url?: string | null
          price_1p: number
          price_2p: number
          is_active?: boolean
          season?: string | null
          created_at?: string
        }
        Update: {
          legend_type?: string
          region?: string
          difficulty?: "easy" | "medium" | "hard"
          duration_text?: I18nText
          title?: I18nText
          description?: I18nText
          thumbnail_url?: string | null
          video_url?: string | null
          price_1p?: number
          price_2p?: number
          is_active?: boolean
          season?: string | null
        }
        Relationships: []
      }
      kit_products: {
        Row: {
          id: string
          course_id: string
          option_type: "solo" | "couple"
          price: number
          stock: number
          is_active: boolean
        }
        Insert: {
          id?: string
          course_id: string
          option_type: "solo" | "couple"
          price: number
          stock?: number
          is_active?: boolean
        }
        Update: {
          option_type?: "solo" | "couple"
          price?: number
          stock?: number
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "kit_products_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          kit_id: string | null
          quantity: number
          total_price: number
          payment_method: "toss" | "stripe" | null
          payment_status: "pending" | "paid" | "failed" | "refunded"
          shipping_name: string
          shipping_phone: string
          shipping_address: string
          shipping_address_detail: string | null
          shipping_zipcode: string | null
          shipping_status: "preparing" | "shipped" | "delivered"
          tracking_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          kit_id?: string | null
          quantity?: number
          total_price: number
          payment_method?: "toss" | "stripe" | null
          payment_status?: "pending" | "paid" | "failed" | "refunded"
          shipping_name: string
          shipping_phone: string
          shipping_address: string
          shipping_address_detail?: string | null
          shipping_zipcode?: string | null
          shipping_status?: "preparing" | "shipped" | "delivered"
          tracking_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          payment_method?: "toss" | "stripe" | null
          payment_status?: "pending" | "paid" | "failed" | "refunded"
          shipping_status?: "preparing" | "shipped" | "delivered"
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_kit_id_fkey"
            columns: ["kit_id"]
            referencedRelation: "kit_products"
            referencedColumns: ["id"]
          }
        ]
      }
      missions: {
        Row: {
          id: string
          course_id: string
          sequence: number
          type: "quiz" | "photo" | "open" | "boss" | "hidden"
          title: I18nText
          description: I18nText
          hint_1: I18nText | null
          hint_2: I18nText | null
          hint_3: I18nText | null
          correct_answer: string | null
          lp_reward: number
          is_hidden: boolean
          location_name: I18nText | null
          location_description: I18nText | null
          latitude: number | null
          longitude: number | null
          qr_code: string | null
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          sequence: number
          type: "quiz" | "photo" | "open" | "boss" | "hidden"
          title: I18nText
          description: I18nText
          hint_1?: I18nText | null
          hint_2?: I18nText | null
          hint_3?: I18nText | null
          correct_answer?: string | null
          lp_reward?: number
          is_hidden?: boolean
          location_name?: I18nText | null
          location_description?: I18nText | null
          latitude?: number | null
          longitude?: number | null
          qr_code?: string | null
          created_at?: string
        }
        Update: {
          sequence?: number
          type?: "quiz" | "photo" | "open" | "boss" | "hidden"
          title?: I18nText
          description?: I18nText
          hint_1?: I18nText | null
          hint_2?: I18nText | null
          hint_3?: I18nText | null
          correct_answer?: string | null
          lp_reward?: number
          is_hidden?: boolean
          location_name?: I18nText | null
          location_description?: I18nText | null
          latitude?: number | null
          longitude?: number | null
          qr_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "missions_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
      }
      mission_progress: {
        Row: {
          id: string
          user_id: string
          mission_id: string
          status: "locked" | "unlocked" | "in_progress" | "completed"
          answer_text: string | null
          photo_url: string | null
          lp_earned: number
          started_at: string | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          mission_id: string
          status?: "locked" | "unlocked" | "in_progress" | "completed"
          answer_text?: string | null
          photo_url?: string | null
          lp_earned?: number
          started_at?: string | null
          completed_at?: string | null
        }
        Update: {
          status?: "locked" | "unlocked" | "in_progress" | "completed"
          answer_text?: string | null
          photo_url?: string | null
          lp_earned?: number
          started_at?: string | null
          completed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mission_progress_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_progress_mission_id_fkey"
            columns: ["mission_id"]
            referencedRelation: "missions"
            referencedColumns: ["id"]
          }
        ]
      }
      lp_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: "mission" | "photo_upload" | "review" | "referral" | "coupon_exchange" | "admin"
          reference_id: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: "mission" | "photo_upload" | "review" | "referral" | "coupon_exchange" | "admin"
          reference_id?: string | null
          description?: string | null
          created_at?: string
        }
        Update: never
        Relationships: [
          {
            foreignKeyName: "lp_transactions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tiers: {
        Row: {
          level: number
          name: I18nText
          min_lp: number
          discount_rate: number
          badge_url: string | null
        }
        Insert: {
          level: number
          name: I18nText
          min_lp: number
          discount_rate?: number
          badge_url?: string | null
        }
        Update: {
          name?: I18nText
          min_lp?: number
          discount_rate?: number
          badge_url?: string | null
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          id: string
          user_id: string
          course_id: string | null
          mission_id: string | null
          photos: string[]
          text: string | null
          likes_count: number
          is_spoiler: boolean
          is_hidden: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id?: string | null
          mission_id?: string | null
          photos?: string[]
          text?: string | null
          likes_count?: number
          is_spoiler?: boolean
          is_hidden?: boolean
          created_at?: string
        }
        Update: {
          photos?: string[]
          text?: string | null
          is_spoiler?: boolean
          is_hidden?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_posts_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
      }
      community_likes: {
        Row: {
          id: string
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: never
        Relationships: [
          {
            foreignKeyName: "community_likes_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          }
        ]
      }
      community_comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          text: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          text: string
          created_at?: string
        }
        Update: {
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          }
        ]
      }
      coupons: {
        Row: {
          id: string
          user_id: string
          code: string
          discount_rate: number
          lp_cost: number
          is_used: boolean
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          code: string
          discount_rate: number
          lp_cost: number
          is_used?: boolean
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          is_used?: boolean
          expires_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupons_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      affiliate_links: {
        Row: {
          id: string
          course_id: string | null
          platform: string
          category: "accommodation" | "transport" | "activity"
          title: I18nText
          target_url: string
          display_order: number
          is_active: boolean
        }
        Insert: {
          id?: string
          course_id?: string | null
          platform: string
          category: "accommodation" | "transport" | "activity"
          title: I18nText
          target_url: string
          display_order?: number
          is_active?: boolean
        }
        Update: {
          platform?: string
          category?: "accommodation" | "transport" | "activity"
          title?: I18nText
          target_url?: string
          display_order?: number
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_links_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
      }
      affiliate_clicks: {
        Row: {
          id: string
          link_id: string
          user_id: string | null
          clicked_at: string
          converted: boolean
        }
        Insert: {
          id?: string
          link_id: string
          user_id?: string | null
          clicked_at?: string
          converted?: boolean
        }
        Update: {
          converted?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_clicks_link_id_fkey"
            columns: ["link_id"]
            referencedRelation: "affiliate_links"
            referencedColumns: ["id"]
          }
        ]
      }
      b2b_orders: {
        Row: {
          id: string
          agency_name: string
          agency_contact: string | null
          course_id: string | null
          kit_quantity: number
          unit_price: number
          total_price: number
          status: "pending" | "confirmed" | "shipped" | "delivered"
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          agency_name: string
          agency_contact?: string | null
          course_id?: string | null
          kit_quantity: number
          unit_price: number
          total_price: number
          status?: "pending" | "confirmed" | "shipped" | "delivered"
          notes?: string | null
          created_at?: string
        }
        Update: {
          agency_name?: string
          agency_contact?: string | null
          kit_quantity?: number
          unit_price?: number
          total_price?: number
          status?: "pending" | "confirmed" | "shipped" | "delivered"
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "b2b_orders_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
      }
      goods_notify_subscribers: {
        Row: {
          id: string
          email: string
          locale: string
          subscribed_at: string
          is_notified: boolean
        }
        Insert: {
          id?: string
          email: string
          locale?: string
          subscribed_at?: string
          is_notified?: boolean
        }
        Update: {
          is_notified?: boolean
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          id: string
          name: I18nText
          price: number
          plan_type: "free" | "explorer" | "legend"
          features: { ko: string[]; ja: string[]; en: string[] }
          kit_discount_rate: number
          tier_levelup: boolean
          monthly_credits: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: I18nText
          price: number
          plan_type: "free" | "explorer" | "legend"
          features: { ko: string[]; ja: string[]; en: string[] }
          kit_discount_rate?: number
          tier_levelup?: boolean
          monthly_credits?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          name?: I18nText
          price?: number
          plan_type?: "free" | "explorer" | "legend"
          features?: { ko: string[]; ja: string[]; en: string[] }
          kit_discount_rate?: number
          tier_levelup?: boolean
          monthly_credits?: number
          is_active?: boolean
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          status: "active" | "canceled" | "expired" | "trial"
          payment_provider: string | null
          payment_subscription_id: string | null
          current_period_start: string
          current_period_end: string
          tier_levelup_used: boolean
          credits_remaining: number
          credits_reset_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          status?: "active" | "canceled" | "expired" | "trial"
          payment_provider?: string | null
          payment_subscription_id?: string | null
          current_period_start?: string
          current_period_end: string
          tier_levelup_used?: boolean
          credits_remaining?: number
          credits_reset_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          plan_id?: string
          status?: "active" | "canceled" | "expired" | "trial"
          payment_provider?: string | null
          payment_subscription_id?: string | null
          current_period_start?: string
          current_period_end?: string
          tier_levelup_used?: boolean
          credits_remaining?: number
          credits_reset_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          }
        ]
      }
      travel_plans: {
        Row: {
          id: string
          user_id: string
          title: I18nText | null
          city_id: string
          start_date: string | null
          end_date: string | null
          travel_style: "relaxed" | "active" | "full"
          has_mission_kit: boolean
          kit_course_id: string | null
          hotel_name: string | null
          hotel_address: string | null
          hotel_lat: number | null
          hotel_lng: number | null
          hotel_source: "curated" | "manual" | null
          status: "draft" | "confirmed" | "completed"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: I18nText | null
          city_id: string
          start_date?: string | null
          end_date?: string | null
          travel_style?: "relaxed" | "active" | "full"
          has_mission_kit?: boolean
          kit_course_id?: string | null
          hotel_name?: string | null
          hotel_address?: string | null
          hotel_lat?: number | null
          hotel_lng?: number | null
          hotel_source?: "curated" | "manual" | null
          status?: "draft" | "confirmed" | "completed"
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: I18nText | null
          city_id?: string
          start_date?: string | null
          end_date?: string | null
          travel_style?: "relaxed" | "active" | "full"
          has_mission_kit?: boolean
          kit_course_id?: string | null
          hotel_name?: string | null
          hotel_address?: string | null
          hotel_lat?: number | null
          hotel_lng?: number | null
          hotel_source?: "curated" | "manual" | null
          status?: "draft" | "confirmed" | "completed"
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "travel_plans_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "travel_plans_kit_course_id_fkey"
            columns: ["kit_course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
      }
      credit_purchases: {
        Row: {
          id: string
          user_id: string
          credits: number
          price: number
          payment_provider: string | null
          payment_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          credits: number
          price: number
          payment_provider?: string | null
          payment_id?: string | null
          created_at?: string
        }
        Update: {
          credits?: number
          price?: number
          payment_provider?: string | null
          payment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_purchases_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      credit_usage: {
        Row: {
          id: string
          user_id: string
          feature: "weather" | "distance" | "ai_curation" | "pdf" | "schedule_change" | "companion_share" | "ai_dupe" | "taste_match"
          credits_used: number
          metadata: Record<string, unknown> | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          feature: "weather" | "distance" | "ai_curation" | "pdf" | "schedule_change" | "companion_share" | "ai_dupe" | "taste_match"
          credits_used: number
          metadata?: Record<string, unknown> | null
          created_at?: string
        }
        Update: {
          feature?: "weather" | "distance" | "ai_curation" | "pdf" | "schedule_change" | "companion_share"
          credits_used?: number
          metadata?: Record<string, unknown> | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_usage_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      plan_items: {
        Row: {
          id: string
          plan_id: string
          item_type: "food" | "stay" | "diy" | "quest" | "ootd" | "goods" | "transport" | "surprise"
          item_data: Record<string, unknown>
          day_number: number | null
          time_slot: "morning" | "afternoon" | "evening" | "anytime" | null
          sort_order: number
          is_confirmed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          plan_id: string
          item_type: "food" | "stay" | "diy" | "quest" | "ootd" | "goods" | "transport" | "surprise"
          item_data: Record<string, unknown>
          day_number?: number | null
          time_slot?: "morning" | "afternoon" | "evening" | "anytime" | null
          sort_order?: number
          is_confirmed?: boolean
          created_at?: string
        }
        Update: {
          item_type?: "food" | "stay" | "diy" | "quest" | "ootd" | "goods" | "transport" | "surprise"
          item_data?: Record<string, unknown>
          day_number?: number | null
          time_slot?: "morning" | "afternoon" | "evening" | "anytime" | null
          sort_order?: number
          is_confirmed?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "plan_items_plan_id_fkey"
            columns: ["plan_id"]
            referencedRelation: "travel_plans"
            referencedColumns: ["id"]
          }
        ]
      }
      quest_parties: {
        Row: {
          id: string
          course_id: string
          leader_id: string
          title: string
          description: string | null
          adventure_date: string
          max_members: number
          current_members: number
          status: "open" | "full" | "completed" | "cancelled"
          language: string
          leader_nationality: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          leader_id: string
          title: string
          description?: string | null
          adventure_date: string
          max_members?: number
          current_members?: number
          status?: "open" | "full" | "completed" | "cancelled"
          language?: string
          leader_nationality?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          adventure_date?: string
          max_members?: number
          current_members?: number
          status?: "open" | "full" | "completed" | "cancelled"
          language?: string
          leader_nationality?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quest_parties_leader_id_fkey"
            columns: ["leader_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      quest_party_members: {
        Row: {
          id: string
          party_id: string
          user_id: string
          role: "leader" | "member"
          joined_at: string
        }
        Insert: {
          id?: string
          party_id: string
          user_id: string
          role?: "leader" | "member"
          joined_at?: string
        }
        Update: {
          role?: "leader" | "member"
        }
        Relationships: [
          {
            foreignKeyName: "quest_party_members_party_id_fkey"
            columns: ["party_id"]
            referencedRelation: "quest_parties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quest_party_members_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      participant_reviews: {
        Row: {
          id: string
          event_type: "quest_party" | "gyeongdo"
          event_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_type: "quest_party" | "gyeongdo"
          event_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          rating?: number
          comment?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "participant_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participant_reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_reports: {
        Row: {
          id: string
          reporter_id: string
          reported_id: string
          event_type: "quest_party" | "gyeongdo"
          event_id: string
          reason: "no_show" | "harassment" | "fraud" | "violence" | "inappropriate" | "other"
          detail: string | null
          status: "pending" | "reviewed" | "resolved" | "dismissed"
          created_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          reported_id: string
          event_type: "quest_party" | "gyeongdo"
          event_id: string
          reason: "no_show" | "harassment" | "fraud" | "violence" | "inappropriate" | "other"
          detail?: string | null
          status?: "pending" | "reviewed" | "resolved" | "dismissed"
          created_at?: string
        }
        Update: {
          status?: "pending" | "reviewed" | "resolved" | "dismissed"
          detail?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reports_reported_id_fkey"
            columns: ["reported_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      blacklist: {
        Row: {
          id: string
          user_id: string
          reason: "low_rating" | "admin_ban" | "reports"
          average_rating: number | null
          total_reports: number
          blocked_at: string
          blocked_until: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          reason: "low_rating" | "admin_ban" | "reports"
          average_rating?: number | null
          total_reports?: number
          blocked_at?: string
          blocked_until?: string | null
          is_active?: boolean
        }
        Update: {
          reason?: "low_rating" | "admin_ban" | "reports"
          average_rating?: number | null
          total_reports?: number
          blocked_until?: string | null
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "blacklist_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// ============================================================
// 편의 타입 (Row 타입 단축)
// ============================================================
export type User = Database["public"]["Tables"]["users"]["Row"]
export type Course = Database["public"]["Tables"]["courses"]["Row"]
export type KitProduct = Database["public"]["Tables"]["kit_products"]["Row"]
export type Order = Database["public"]["Tables"]["orders"]["Row"]
export type Mission = Database["public"]["Tables"]["missions"]["Row"]
export type MissionProgress = Database["public"]["Tables"]["mission_progress"]["Row"]
export type LpTransaction = Database["public"]["Tables"]["lp_transactions"]["Row"]
export type Tier = Database["public"]["Tables"]["tiers"]["Row"]
export type CommunityPost = Database["public"]["Tables"]["community_posts"]["Row"]
export type CommunityLike = Database["public"]["Tables"]["community_likes"]["Row"]
export type CommunityComment = Database["public"]["Tables"]["community_comments"]["Row"]
export type Coupon = Database["public"]["Tables"]["coupons"]["Row"]
export type AffiliateLink = Database["public"]["Tables"]["affiliate_links"]["Row"]
export type AffiliateClick = Database["public"]["Tables"]["affiliate_clicks"]["Row"]
export type B2bOrder = Database["public"]["Tables"]["b2b_orders"]["Row"]
export type SubscriptionPlan = Database["public"]["Tables"]["subscription_plans"]["Row"]
export type UserSubscription = Database["public"]["Tables"]["user_subscriptions"]["Row"]
export type TravelPlan = Database["public"]["Tables"]["travel_plans"]["Row"]
export type PlanItem = Database["public"]["Tables"]["plan_items"]["Row"]
export type QuestParty = Database["public"]["Tables"]["quest_parties"]["Row"]
export type QuestPartyMember = Database["public"]["Tables"]["quest_party_members"]["Row"]
export type ParticipantReview = Database["public"]["Tables"]["participant_reviews"]["Row"]
export type UserReport = Database["public"]["Tables"]["user_reports"]["Row"]
export type Blacklist = Database["public"]["Tables"]["blacklist"]["Row"]

// Insert 타입
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"]
export type CourseInsert = Database["public"]["Tables"]["courses"]["Insert"]
export type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"]
export type MissionProgressInsert = Database["public"]["Tables"]["mission_progress"]["Insert"]
export type LpTransactionInsert = Database["public"]["Tables"]["lp_transactions"]["Insert"]
export type CommunityPostInsert = Database["public"]["Tables"]["community_posts"]["Insert"]
export type CouponInsert = Database["public"]["Tables"]["coupons"]["Insert"]

// Update 타입
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"]
export type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"]
export type MissionProgressUpdate = Database["public"]["Tables"]["mission_progress"]["Update"]

// ============================================================
// 도메인 복합 타입 (JOIN 결과용)
// ============================================================
export type CourseWithKits = Course & {
  kit_products: KitProduct[]
}

export type MissionWithProgress = Mission & {
  mission_progress?: MissionProgress | null
}

export type CommunityPostWithUser = CommunityPost & {
  users: Pick<User, "id" | "nickname" | "avatar_url" | "current_tier">
  courses: Pick<Course, "id" | "title"> | null
  isLiked?: boolean
}

export type OrderWithCourse = Order & {
  kit_products: KitProduct & {
    courses: Course
  } | null
}

// ============================================================
// 타입 안전 Supabase 클라이언트 생성 헬퍼
// ============================================================
import { createBrowserClient, createServerClient } from "@supabase/ssr"

export function createTypedBrowserClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
