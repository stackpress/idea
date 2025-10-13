//modules
import { useEffect } from 'react';
import clsx from 'clsx';
import { ToastContainer } from 'react-toastify';
//local
import '../styles/page.css';
//stackpress
import type { ServerPageProps } from 'stackpress/view/client';
import Layout from '../Layout.js';
//multiple section components
import {
  AboutSection,
  AIDevelopmentWorkflowSection,
  AudienceSection,
  BenefitsSection,
  FutureSection,
  HeroSection,
  PluginEcosystemSection,
  RealWorldExampleSection
} from '../components/landing-page/index.js';

//styles
//----------------------------------------------------------------------

const mainStyle = clsx(
  'overflow-auto',
  'px-h-100-0',
  'px-w-100-0',
  'relative',
  'theme-bg-bg0',
  'theme-tx1',
);

//----------------------------------------------------------------------

export function Head(props: ServerPageProps) {
  const { styles = [] } = props;

  return (
    <>
      <title>Idea</title>
      <meta name="description" content="Idea" />
      <link rel="icon" type="image/x-icon" href="/icon.png" />
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />

      {/* Vanta.js Dependencies */}
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js">
      </script>
      <script
        src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js">
      </script>

      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  )
}

export default function HomePage(props: ServerPageProps) {
  //props
  const { session, request, response } = props;

  useEffect(() => {
    //check if Vanta is available in the window object
    if (typeof window !== 'undefined' && (window as any).VANTA) {
      const effect = (window as any).VANTA.NET({
        backgroundColor: '#121212',
        color: '#FFC107',
        el: '#vanta-bg',
        maxDistance: 15.00,
        minHeight: 500.00,
        minWidth: 500.00,
        mouseControls: true,
        opacity: 0.5,
        points: 10.00,
        scale: 1.00,
        scaleMobile: 1.00,
        showDots: false,
        spacing: 15.00,
        touchControls: true
      });

      //destroy the effect when the component unmounts
      return () => {
        if (effect) effect.destroy();
      };
    }
  }, []);

  return (
    <Layout session={session} request={request} response={response}>
      <main className={mainStyle}>
        {/* Hero Section */}
        <HeroSection />

        {/* About Section */}
        <AboutSection />

        {/* Benefits Section */}
        <BenefitsSection />

        {/* Audience Section */}
        <section className="theme-bg-bg1">
          <AudienceSection />
        </section>

        {/* Plugin Ecosystem Section */}
        <PluginEcosystemSection />

        {/* Real World Example Section */}
        <section className="theme-bg-bg1">
          <RealWorldExampleSection />
        </section>

        {/* AI Development Workflow Section */}
        <AIDevelopmentWorkflowSection />

        {/* Future Section */}
        <section className="theme-bg-bg1">
          <FutureSection />
        </section>

        {/* Toast Container for notifications */}
        <ToastContainer />
      </main>
    </Layout>
  )
}