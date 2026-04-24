"use client"

import {
  useToast,
} from "@/components/ui/use-toast"
import { CheckCircle2, AlertCircle } from "lucide-react"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  // open:false 인 토스트는 숨김 (DISMISS 직후 REMOVE 전 짧은 전환 구간에서도 사라지도록)
  const visibleToasts = toasts.filter((t) => (t as { open?: boolean }).open !== false)

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {visibleToasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <div
            key={id}
            className={`group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-2xl border p-6 pr-12 shadow-2xl transition-all animate-in slide-in-from-bottom-5 duration-300 mb-2 ${
              variant === "destructive"
                ? "bg-destructive text-destructive-foreground border-destructive/50"
                : "bg-white/90 backdrop-blur-md border-primary/10 text-foreground"
            }`}
            {...props}
          >
            <div className="grid gap-1">
              {title && (
                <div className="text-sm font-bold flex items-center gap-2">
                  {variant === "destructive" ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  )}
                  {title}
                </div>
              )}
              {description && (
                <div className="text-xs opacity-90 line-clamp-2">{description}</div>
              )}
            </div>
            {action}
            <button
              type="button"
              onClick={() => dismiss(id)}
              aria-label="Close"
              className="absolute right-2 top-2 rounded-md p-2 text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <span className="sr-only">Close</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )
      })}
    </div>
  )
}
