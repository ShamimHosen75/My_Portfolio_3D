// "What clients say" slider.
// These are SAMPLE quotes so the layout can be seen. Replace each one with a real
// client's words, name and role (with their permission) before the site goes live.

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
    name: "Client Name",
    role: "Founder, Startup",
    rating: 5,
  },
  {
    quote:
      "Our WooCommerce store finally feels modern. Pages load quickly, checkout is smooth, and sales went up in the first month after launch.",
    name: "Client Name",
    role: "Owner, Online Store",
    rating: 5,
  },
  {
    quote:
      "He understood exactly what we needed from the CMS and made it simple for our team to update content without touching any code.",
    name: "Client Name",
    role: "Marketing Lead, Agency",
    rating: 5,
  },
  {
    quote:
      "Careful, reliable and great at testing. Shamim caught issues before our users ever saw them and fixed them quickly.",
    name: "Client Name",
    role: "Product Manager, SaaS",
    rating: 5,
  },
];
