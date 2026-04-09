'use client'

import { useEffect } from 'react'

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[LocaleError]', error)
  }, [error])

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
      fontFamily: 'sans-serif',
    }}>
      <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>👹</div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#111' }}>
        오류가 발생했습니다
      </h1>
      <p style={{ color: '#666', marginBottom: '2rem', maxWidth: '400px' }}>
        도깨비가 장난을 쳤나 봅니다. 잠시 후 다시 시도해 주세요.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => reset()}
          style={{
            padding: '0.75rem 2rem',
            background: '#FF6B35',
            color: 'white',
            border: 'none',
            borderRadius: '1rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          다시 시도
        </button>
        <a
          href="/"
          style={{
            padding: '0.75rem 2rem',
            background: '#f3f4f6',
            color: '#111',
            border: 'none',
            borderRadius: '1rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            textDecoration: 'none',
          }}
        >
          홈으로
        </a>
      </div>
    </div>
  )
}