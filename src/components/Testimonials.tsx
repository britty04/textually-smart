
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Content Creator",
    content: "This tool has revolutionized my content creation process. The AI detection feature is incredibly accurate!",
    rating: 5,
  },
  {
    name: "David Chen",
    role: "Academic Researcher",
    content: "The plagiarism checker is invaluable for my research work. Highly recommend for academic purposes.",
    rating: 5,
  },
  {
    name: "Emily Williams",
    role: "Marketing Manager",
    content: "The text humanization feature helps make our AI-generated content feel more authentic and engaging.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {testimonials.map((testimonial, index) => (
        <Card
          key={index}
          className="p-6 glass card-shadow hover:scale-105 transition-transform duration-300"
        >
          <div className="flex mb-4">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 text-yellow-400 fill-yellow-400"
              />
            ))}
          </div>
          <p className="text-sm mb-4">{testimonial.content}</p>
          <div>
            <p className="font-semibold">{testimonial.name}</p>
            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Testimonials;
