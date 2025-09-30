//modules
import { useEffect } from 'react';
//styles
import '../styles/page.css';
import { ToastContainer } from 'react-toastify';
//stackpress
import type { ServerPageProps } from 'stackpress/view/client';
import Layout from '../Layout.js';
//multiple section components
import {
  HeroSection,
  AboutSection,
  BenefitsSection,
  AudienceSection,
  PluginEcosystemSection,
  RealWorldExampleSection,
  AIDevelopmentWorkflowSection,
  FutureSection
} from '../components/landing-page/index.js';

export function Head(props: ServerPageProps) {
  const { styles = [] } = props;
  return (
    <>
      <title>Idea</title>
      <meta name="description" content="Idea" />
      <link rel="icon" type="image/x-icon" href="/icon.png" />
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />

      {/* Vanta.js Dependencies */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js"></script>

      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  )
}

export default function HomePage(props: ServerPageProps) {
  const { session, request, response } = props;
  
  //add useEffect to initialize Vanta
  useEffect(() => {
    //check if Vanta is available in the window object
    if (typeof window !== 'undefined' && (window as any).VANTA) {
      const effect = (window as any).VANTA.NET({
        el: "#vanta-bg", 
        mouseControls: false, 
        touchControls: true, 
        gyroControls: false, 
        minHeight: 500.00, 
        minWidth: 500.00, 
        scale: 1.00, 
        scaleMobile: 1.00, 
        color: 0xffc107, 
        backgroundColor: 0x121212,
        points: 10.00,
        maxDistance: 10.00,
        spacing: 15.00
      });
      
      //destroy the effect when the component unmounts
      return () => {
        if (effect) effect.destroy();
      };
    }
  }, []);

  return (
    <Layout session={session} request={request} response={response}>
      <main
        id="vanta-bg"
        className="theme-bg-bg0 theme-tx1 px-h-100-0 px-w-100-0 
        overflow-auto relative">
        {/* Hero Sections */}
        <HeroSection />

        {/* About Section */}
        <AboutSection />

        {/* Benefits Section */}
        <BenefitsSection />

        {/* Wrap the section with a background */}
        <section className='theme-bg-bg1'>
          <AudienceSection />
        </section>

        {/* Plugin Ecosystem Section */}
        <PluginEcosystemSection />

        {/* Wrap the section with a background */}
        <section className='theme-bg-bg1'>
          <RealWorldExampleSection />
        </section>

        {/* AI Development Workflow Section */}
        <AIDevelopmentWorkflowSection />

        {/* Wrap the section with a background */}
        <section className='theme-bg-bg1'>
          <FutureSection />
        </section>

        {/* Toast Container for notifications */}
        <ToastContainer />
      </main>
    </Layout>
  )
}