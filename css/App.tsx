import { Component as HorizonHero } from '@/components/ui/horizon-hero-section'
import DimensionalSwitchSlider from '@/components/ui/dimensional-switch-slider'

export default function App() {
  return (
    <main style={{ background: '#000' }}>
      {/* Three.js WebGL Hero — HORIZON / COSMOS / INFINITY */}
      <HorizonHero />

      {/* Collection Slider */}
      <section
        style={{
          minHeight: '100vh',
          background: '#0a0a0a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '5rem 1rem',
        }}
      >
        <p
          style={{
            color: 'oklch(85% 0.03 260)',
            fontSize: '0.75rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          Curated Selection
        </p>
        <h2
          style={{
            color: '#fff',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 300,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '4rem',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          Collections
        </h2>
        <DimensionalSwitchSlider
          autoplay={true}
          autoplayDelay={2600}
          cardWidth={680}
          cardHeight={460}
          cardBorderRadius={16}
          textSize={84}
          infinite={true}
          direction="horizontal"
        />
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid oklch(30% 0 0)',
          padding: '3rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          background: '#000',
        }}
      >
        <span
          style={{
            color: '#fff',
            fontSize: '1.25rem',
            letterSpacing: '0.3em',
            fontWeight: 300,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          LUMIÈRE
        </span>
        <span
          style={{
            color: 'oklch(55% 0.02 260)',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          © {new Date().getFullYear()} LUMIÈRE Boutique. All rights reserved.
        </span>
      </footer>
    </main>
  )
}
