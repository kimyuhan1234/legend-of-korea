import { createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, locale } = body

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    const supabase = await createServiceClient()

    const { data, error } = await supabase
      .from("goods_notify_subscribers")
      .insert({ email: String(email).toLowerCase().trim(), locale: locale || "ko" })
      .select()

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ duplicate: true })
      }
      return NextResponse.json({ error: "등록에 실패했습니다." }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
