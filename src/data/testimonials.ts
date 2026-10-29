// "What clients say" slider.
// These are realistic dummy names & roles for portfolio presentation.

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Shamim turned our rough idea into a fast, polished web app. He kept us updated every step of the way and delivered ahead of schedule.",
    name: "Alexander Wright",
    role: "Founder, Apex Labs",
    rating: 5,
  },
  {
    quote:
      "Our WooCommerce store finally feels modern. Pages load quickly, checkout is smooth, and sales went up in the first month after launch.",
    name: "Sophia Martinez",
    role: "Owner, Bella Vita Boutique",
    rating: 5,
  },
  {
    quote:
      "He understood exactly what we needed from the CMS and made it simple for our team to update content without touching any code.",
    name: "David Chen",
    role: "Marketing Lead, Horizon Media",
    rating: 5,
  },
  {
    quote:
      "Careful, reliable and great at testing. Shamim caught issues before our users ever saw them and fixed them quickly.",
    name: "Emily Harrison",
    role: "Product Manager, CloudPulse SaaS",
    rating: 5,
  },
];
