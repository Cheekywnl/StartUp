'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', padding: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Something went wrong</h2>
        <p style={{ marginBottom: '24px', maxWidth: '400px', textAlign: 'center', color: '#888' }}>{error.message}</p>
        <button
          onClick={reset}
          style={{ background: 'linear-gradient(135deg, #405de6, #833ab4, #c13584)', border: 'none', borderRadius: '12px', padding: '12px 24px', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
