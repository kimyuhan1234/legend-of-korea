'use client'

export default function Loading() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fff',
      zIndex: 50,
    }}>
      <div style={{ position: 'relative', width: '6rem', height: '6rem' }}>
        <div style={{
          width: '6rem',
          height: '6rem',
          borderRadius: '50%',
          border: '4px solid #f3f4f6',
          borderTopColor: '#FF6B35',
          animation: 'spin 1s linear infinite',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
        }}>
          👹
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}