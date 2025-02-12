
import TextAnalysisSection from "@/components/TextAnalysisSection";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import ContactForm from "@/components/ContactForm";

const Index = () => {
  return (
    <div className="min-h-screen py-12 px-4 space-y-20 bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
        <h1 className="text-4xl font-bold mb-4">
          Advanced Text Analysis Platform
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Detect AI content, humanize text, check for plagiarism, and rephrase
          your content with our powerful suite of tools.
        </p>
      </div>

      {/* Main Analysis Section */}
      <section className="max-w-6xl mx-auto px-4">
        <TextAnalysisSection />
      </section>

      {/* Testimonials Section */}
      <section className="py-12 px-4">
        <h2 className="text-2xl font-semibold text-center mb-8">
          What Our Users Say
        </h2>
        <Testimonials />
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-4 bg-gray-50">
        <FAQ />
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4">
        <ContactForm />
      </section>
    </div>
  );
};

export default Index;
