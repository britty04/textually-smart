
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, Clock } from "lucide-react";
import TextAnalysisSection from "@/components/TextAnalysisSection";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import ContactForm from "@/components/ContactForm";

const TrustBadge = ({ icon: Icon, text }: { icon: any; text: string }) => (
  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
    <Icon className="w-4 h-4 text-green-500" />
    <span>{text}</span>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            AI Detector & Humanizer – Make Your Text Sound More Authentic!
          </h1>
          <p className="text-xl text-muted-foreground">
            Detect AI-generated content, rephrase text, and check for plagiarism – all in one tool!
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 py-6">
            <TrustBadge icon={Shield} text="100% Free & Secure" />
            <TrustBadge icon={CheckCircle} text="No Login Required" />
            <TrustBadge icon={Clock} text="Instant AI Analysis" />
          </div>

          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 text-lg h-auto"
          >
            Start Free Analysis
          </Button>
        </div>
      </section>

      {/* Main Analysis Section */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Powerful Text Analysis Tools
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to perfect your content
            </p>
          </div>
          <TextAnalysisSection />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Trusted by Content Creators Worldwide
          </h2>
          <Testimonials />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <FAQ />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Get in Touch
          </h2>
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About Us</h3>
            <p className="text-sm text-gray-400">
              Advanced text analysis platform helping content creators worldwide.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>AI Detection</li>
              <li>Text Humanizer</li>
              <li>Plagiarism Check</li>
              <li>Rephrasing Tool</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Blog</li>
              <li>Guides</li>
              <li>FAQ</li>
              <li>Support</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cookie Policy</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Text Analysis Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
