'use client'

export default function RootLoading() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
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
