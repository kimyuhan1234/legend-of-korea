import { createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, locale } = body

    console.log("goods-notify request:", { email, locale })

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    // service role key 사용 — RLS bypass (anon 세션 없이도 INSERT 가능)
    const supabase = await createServiceClient()

    const { data, error } = await supabase
      .from("goods_notify_subscribers")
      .insert({ email: String(email).toLowerCase().trim(), locale: locale || "ko" })
      .select()

    console.log("supabase result:", { data, error })

    if (error) {
      // 23505 = unique_violation (이미 등록된 이메일)
      if (error.code === "23505") {
        return NextResponse.json({ duplicate: true })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.log("goods-notify exception:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
