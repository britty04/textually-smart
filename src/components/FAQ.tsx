
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How accurate is the AI detection?",
    answer: "Our AI detection system uses advanced algorithms to provide highly accurate results, typically achieving over 95% accuracy in identifying AI-generated content.",
  },
  {
    question: "What makes the text humanization feature unique?",
    answer: "Our text humanization feature uses context-aware processing to maintain the original meaning while adding natural language patterns and variations typical of human writing.",
  },
  {
    question: "How does the plagiarism checker work?",
    answer: "The plagiarism checker compares your text against a vast database of published content, academic papers, and web pages to identify potential matches and similarities.",
  },
  {
    question: "Is my content safe and private?",
    answer: "Yes, we take privacy seriously. All submitted content is encrypted, processed securely, and automatically deleted after analysis. We never store or share your text.",
  },
];

const FAQ = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQ;
