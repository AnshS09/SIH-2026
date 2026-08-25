import type { Metadata } from 'next';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import GISPortalClient from './GISPortalClient';

export const metadata: Metadata = {
  title: 'AeroMetric | Integrated GIS Portal',
  description: 'Initialize geospatial reconstruction parameters or request clearance for custom drone telemetry gathering in restricted zones.',
};

export default function GISPortalPage() {
  return (
    <>
      <Header />
      <main className="w-full pt-16 min-h-screen">
        <GISPortalClient />
      </main>
      <Footer />
    </>
  );
}
