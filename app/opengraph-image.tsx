import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'James Duong - Software Engineer Portfolio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #000000, #111111)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '60px 80px',
            background: 'rgba(255, 255, 255, 0.05)',
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 'bold',
              letterSpacing: '-2px',
              marginBottom: 20,
              background: 'linear-gradient(90deg, #ffffff, #888888)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            James Duong
          </div>
          <div style={{ fontSize: 32, color: '#aaaaaa', fontWeight: 500 }}>
            Software Engineer
          </div>
          <div style={{ display: 'flex', marginTop: 40, gap: '20px' }}>
            <div style={{ fontSize: 24, color: '#666666' }}>jamesduong.dev</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
