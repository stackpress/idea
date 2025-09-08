//styles
import '../styles/page.css';
import { ToastContainer } from 'react-toastify';
//stackpress
import type { ServerPageProps } from 'stackpress/view/client';
import Layout from '../Layout.js';
import HeroSection from './landingpage/HeroSection.js';
import AboutSection from './landingpage/AboutSection.js';
import BenefitsSection from './landingpage/BenefitsSection.js';
import AudienceSection from './landingpage/AudienceSection.js';
import PluginEcosystemSection from './landingpage/PluginEcosystemSection.js';
import RealWorldExampleSection from './landingpage/RealWorldExampleSection.js';
import AIDevelopmentWorkflowSection from './landingpage/AIDevelopmentWorkflowSection.js';
import FutureSection from './landingpage/FutureSection.js';

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

      <main className="theme-bg-bg0 theme-tx1 px-h-100-0 px-w-100-0 overflow-auto relative">
        <HeroSection />
        <AboutSection />
        <BenefitsSection />
        <AudienceSection />
        <PluginEcosystemSection />
        <RealWorldExampleSection />
        <AIDevelopmentWorkflowSection />
        <FutureSection />
        <ToastContainer />
      </main>

    </Layout>
  )
}