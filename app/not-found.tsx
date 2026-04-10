'use client'

export default function GlobalNotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
      fontFamily: 'sans-serif',
      background: '#fff',
    }}>
      <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>👹</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#111' }}>
        404 - 페이지를 찾을 수 없습니다
      </h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        요청하신 페이지가 존재하지 않습니다.
      </p>
      <a
        href="/ko"
        style={{
          padding: '0.75rem 2rem',
          background: '#FF6B35',
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
