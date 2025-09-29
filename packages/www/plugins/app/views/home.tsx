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
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  )
}

export default function HomePage(props: ServerPageProps) {
  const { session, request, response } = props;

  return (
    <Layout session={session} request={request} response={response}>
      <main className="theme-bg-bg0 theme-tx1 px-h-100-0 px-w-100-0 
      overflow-auto relative">
        {/* Hero Sections */}
        <HeroSection />

        {/* About Section */}
        <AboutSection />

        {/* Benefits Section */}
        <BenefitsSection />

        {/* Wrap the section with a background */}
        <section className='theme-bg-bg2'>
          <AudienceSection />
        </section>

        {/* Plugin Ecosystem Section */}
        <PluginEcosystemSection />

        {/* Wrap the section with a background */}
        <section className='theme-bg-bg2'>
          <RealWorldExampleSection />
        </section>

        {/* AI Development Workflow Section */}
        <AIDevelopmentWorkflowSection />

        {/* Wrap the section with a background */}
        <section className='theme-bg-bg2'>
          <FutureSection />
        </section>

        {/* Toast Container for notifications */}
        <ToastContainer />
      </main>
    </Layout>
  )
}