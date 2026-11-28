import Testimonials, { type Testimonial } from "@/components/ui/testimonials-13";

const samples: Testimonial[] = [
  { id: "1", name: "John Doe", role: "Software Engineer", company: "TechCorp", quote: "This product has completely transformed the way we work. The efficiency and ease of use are unmatched!", avatar: "https://cdn.21st.dev/assets/mirror/f7/f72a5321d9c055324b83d9aca5fa248af5f99213b63da015c188955f8b5f0223.jpg" },
  { id: "2", name: "Sophia Lee", role: "Data Analyst", company: "InsightTech", quote: "This tool has saved me hours of work! The analytics and reporting features are incredibly powerful.", avatar: "https://cdn.21st.dev/assets/mirror/57/57501d26f0a1500d35e3feb532be175cda3d4ad5d9ab7dd2ddbc346a81687641.jpg" },
  { id: "3", name: "Michael Johnson", role: "UX Designer", company: "DesignPro", quote: "An amazing tool that simplifies complex tasks. Highly recommended for professionals in the industry.", avatar: "https://cdn.21st.dev/assets/mirror/55/55053b4b68b2e6eb9cd8d3057617e989f97b0fccf54eb0d46ab3f2907d2c27bb.jpg" },
  { id: "4", name: "Emily Davis", role: "Marketing Specialist", company: "BrandBoost", quote: "I've seen a significant improvement in our team's productivity since we started using this service.", avatar: "https://cdn.21st.dev/assets/mirror/e1/e1e565477a93abaec6a4ffd6a6745e3620bba9e5c0c88418e4b7113667370d65.jpg" },
  { id: "5", name: "Daniel Martinez", role: "Full-Stack Developer", company: "CodeCrafters", quote: "The best investment we've made! The support team is also super responsive and helpful.", avatar: "https://cdn.21st.dev/assets/mirror/7d/7d79089c6788e8d582fe1b03158a3520f2bc805983362f52b8df1558f91577ad.jpg" },
  { id: "6", name: "Jane Smith", role: "Product Manager", company: "InnovateX", quote: "The user experience is top-notch! The interface is clean, intuitive, and easy to navigate.", avatar: "https://cdn.21st.dev/assets/mirror/9a/9a06193c1865e5fc792d78adc02dfec25f0473e69596efd694f24d29916b59e4.jpg" },
];

export default function TestimonialsDemo() {
  return <Testimonials items={samples.map((sample) => ({ ...sample, sample: true }))} />;
}
