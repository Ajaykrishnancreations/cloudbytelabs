import { motion } from "framer-motion";
import {
  GraduationCap,
  Cloud,
  Code2,
  Database,
  ShoppingCart,
  Puzzle,
  Lightbulb,
} from "lucide-react";
export const services = [
  { icon: GraduationCap, title: "Training", tagline: "Build skills, build futures" },
  { icon: Cloud, title: "Cloud consulting", tagline: "Strategy to success" },
  { icon: Code2, title: "Software development", tagline: "Ideas into impact" },
  { icon: Database, title: "ERP solutions", tagline: "Smarter operations" },
  { icon: ShoppingCart, title: "Ecommerce applications", tagline: "Sell beyond boundaries" },
  { icon: Puzzle, title: "Integrations", tagline: "Connect everything" },
  { icon: Lightbulb, title: "And more", tagline: "Innovate together" },
];
export default function Services() {
  return (
    <section className="services-band" aria-labelledby="services-title">
      <div className="services-glow" aria-hidden="true" />
      <div className="container">
        <motion.div
          className="services-head"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
        >
          <p className="services-motto">
            People <i /> Technology <i /> Growth together
          </p>
          <h2 id="services-title">
            More than training. <span>A partner for what you build next.</span>
          </h2>
        </motion.div>
        <motion.ul
          className="services-grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        >
          {services.map(({ icon: Icon, title, tagline }) => (
            <motion.li
              key={title}
              variants={{
                hidden: { opacity: 0, y: 22, scale: 0.96 },
                show: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              whileHover={{ y: -6 }}
            >
              <span className="service-icon">
                <Icon size={26} strokeWidth={1.7} />
              </span>
              <h3>{title}</h3>
              <p>{tagline}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
