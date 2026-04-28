"use client"

import { useEffect, useRef } from "react"

/**
 * 모달 / lightbox 접근성 통합 hook (WCAG 2.2 AA).
 *
 * 적용 효과 (isOpen=true 일 때):
 *   1. ESC 키 → onClose() 호출 (capture phase 로 부모 핸들러보다 우선)
 *   2. Focus trap — Tab / Shift+Tab 이 모달 내부 focusable 요소 사이만 순환
 *   3. 모달 열릴 때 첫 focusable 요소로 focus 이동
 *   4. 모달 닫힐 때 직전 active element 로 focus 복원
 *
 * 사용:
 *   const modalRef = useModalA11y<HTMLDivElement>(isOpen, onClose)
 *   return isOpen ? <div ref={modalRef} role="dialog" aria-modal="true">...</div> : null
 *
 * 본 hook 은 강제 인증 모달 (ReauthBirthDateModal 처럼 ESC 차단) 에는 사용 X —
 * 그쪽은 ESC 핸들러를 자체적으로 stop 처리해야 한다.
 */
export function useModalA11y<T extends HTMLElement = HTMLDivElement>(
  isOpen: boolean,
  onClose: () => void,
): React.RefObject<T> {
  const modalRef = useRef<T>(null)

  // onClose 가 inline arrow 일 때 부모 re-render 마다 effect 재실행되며
  // focus 가 깜빡이는 문제를 ref 로 우회 — deps 는 [isOpen] 하나만 둔다.
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return

    const previousActive = document.activeElement as HTMLElement | null
    const modal = modalRef.current

    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

    if (modal) {
      const first = modal.querySelector<HTMLElement>(focusableSelector)
      first?.focus()
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation()
        onCloseRef.current()
        return
      }

      if (e.key !== "Tab" || !modal) return

      const focusables = modal.querySelectorAll<HTMLElement>(focusableSelector)
      if (focusables.length === 0) return

      const firstEl = focusables[0]
      const lastEl = focusables[focusables.length - 1]

      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        firstEl.focus()
      }
    }

    // capture phase — 모달 내부 input 의 onKeyDown 보다 먼저 수신
    document.addEventListener("keydown", handleKey, true)

    return () => {
      document.removeEventListener("keydown", handleKey, true)
      previousActive?.focus()
    }
  }, [isOpen])

  return modalRef
}
