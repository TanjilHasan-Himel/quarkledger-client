import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract parameters
    const title = searchParams.get('title') || 'QUARK LEDGER';
    const category = searchParams.get('category') || 'WIRE DESK';
    const source = searchParams.get('source') || 'Editorial';
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    // Load custom fonts if needed (we'll rely on system serif/sans for simplicity, or provide URLs)
    // For V3 Grand Digital Ledger, a tactile parchment aesthetic is required.
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#F9F6F0', // Parchment color
            padding: '60px',
            fontFamily: 'serif',
            border: '16px solid #1c1917',
          }}
        >
          {/* Inner Double Rule Border styling using a div */}
          <div
            style={{
              position: 'absolute',
              top: '28px',
              left: '28px',
              right: '28px',
              bottom: '28px',
              border: '2px solid #1c1917',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              borderBottom: '4px solid #1c1917',
              paddingBottom: '20px',
            }}
          >
            <div
              style={{
                fontSize: 32,
                fontFamily: 'sans-serif',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: '#1c1917',
                textTransform: 'uppercase',
              }}
            >
              {category}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  backgroundColor: '#9F2B2B', // Royal Red Accent
                  color: 'white',
                  padding: '8px 16px',
                  fontSize: 24,
                  fontWeight: 'bold',
                  fontFamily: 'sans-serif',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                QUARK LEDGER
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flexGrow: 1,
              paddingTop: '40px',
              paddingBottom: '40px',
            }}
          >
            <h1
              style={{
                fontSize: 72,
                fontWeight: 900,
                color: '#1c1917',
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              {title}
            </h1>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '2px solid #1c1917',
              paddingTop: '20px',
              width: '100%',
            }}
          >
            <div
              style={{
                fontSize: 28,
                color: '#666055',
                fontFamily: 'sans-serif',
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}
            >
              Source: {source}
            </div>
            <div
              style={{
                fontSize: 28,
                color: '#666055',
                fontFamily: 'sans-serif',
              }}
            >
              {date}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error(e);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
