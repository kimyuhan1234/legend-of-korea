'use client'

import { useEffect } from 'react'

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>☁️</div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#111' }}>
        문제가 발생했습니다
      </h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
      </p>
      <button
        onClick={() => reset()}
        style={{ padding: '0.75rem 2rem', background: '#FF6B35', color: 'white', border: 'none', borderRadius: '1rem', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
      >
        다시 시도
      </button>
    </div>
  )
}