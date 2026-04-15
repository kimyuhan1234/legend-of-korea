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
                    ? "bg-[#F0B8B8] text-[#111]"
                    : isActive
                    ? "bg-gradient-to-br from-mint to-blossom text-ink ring-4 ring-[#1F2937]/20"
                    : "bg-mist text-stone"
                }`}
              >
                {isDone ? "✓" : step}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  isActive ? "text-[#111]" : isDone ? "text-blossom-deep" : "text-stone"
                }`}
              >
                {label}
              </span>
            </div>

            {/* 연결선 */}
            {i < labels.length - 1 && (
              <div
                className={`w-12 sm:w-20 h-0.5 mx-1 -mt-5 transition-colors ${
                  step < currentStep ? "bg-[#F0B8B8]" : "bg-mist"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
