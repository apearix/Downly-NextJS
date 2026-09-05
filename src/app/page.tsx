import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FAQ } from "@/components/home/FAQ";
import { CTA } from "@/components/home/CTA";
import {
  getSoftwareApplicationSchema,
  getWebSiteSchema,
  getOrganizationSchema,
  getHowToSchema,
  getFAQSchema,
} from "@/lib/seo/schema";

export default function Home() {
  const jsonLdSchemas = [
    getSoftwareApplicationSchema(),
    getWebSiteSchema(),
    getOrganizationSchema(),
    getHowToSchema(),
    getFAQSchema(),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-body selection:bg-primary selection:text-brand-black">
      {/* Schema.org Structured Data Graph for AI Search Engines & Google Rich Results */}
      {jsonLdSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <Header />

      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <FAQ />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}