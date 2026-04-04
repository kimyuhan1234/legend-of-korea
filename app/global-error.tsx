'use client'

import { useEffect } from 'react'

export default function GlobalError({
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
    <html>
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <div style={{ fontSize: '5rem', marginBottom: '2rem' }}>👹</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            전설 속에서 문제가 발생했습니다
          </h1>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            도깨비가 장난을 쳤나 봅니다. 잠시 후 다시 시도해 주세요.
          </p>
          <button
            onClick={() => reset()}
            style={{ padding: '0.75rem 2rem', background: '#1B2A4A', color: 'white', border: 'none', borderRadius: '1rem', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  )
}
