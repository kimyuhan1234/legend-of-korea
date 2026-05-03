'use client'

export default function NotFound() {
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
      <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>☁️</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#111' }}>
        404
      </h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        이 페이지를 찾을 수 없습니다.
      </p>
      <a
        href="/"
        style={{
          padding: '0.75rem 2rem',
          background: '#9DD8CE',
          color: 'white',
          borderRadius: '1rem',
          fontSize: '1rem',
          fontWeight: 'bold',
          textDecoration: 'none',
        }}
      >
        홈으로 돌아가기
      </a>
    </div>
  )
}