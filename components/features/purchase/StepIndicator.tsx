"use client"

interface StepIndicatorProps {
  currentStep: number
  labels: string[]
}

export function StepIndicator({ currentStep, labels }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {labels.map((label, i) => {
        const step = i + 1
        const isDone = step < currentStep
        const isActive = step === currentStep

        return (
          <div key={step} className="flex items-center">
            {/* 스텝 원 */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black transition-colors ${
                  isDone
                    ? "bg-[#D4A843] text-[#111]"
                    : isActive
                    ? "bg-[#F5F3EF] text-white ring-4 ring-[#1B2A4A]/20"
                    : "bg-[#e8ddd0] text-[#7a6a58]"
                }`}
              >
                {isDone ? "✓" : step}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  isActive ? "text-[#111]" : isDone ? "text-[#D4A843]" : "text-[#7a6a58]"
                }`}
              >
                {label}
              </span>
            </div>

            {/* 연결선 */}
            {i < labels.length - 1 && (
              <div
                className={`w-12 sm:w-20 h-0.5 mx-1 -mt-5 transition-colors ${
                  step < currentStep ? "bg-[#D4A843]" : "bg-[#e8ddd0]"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
