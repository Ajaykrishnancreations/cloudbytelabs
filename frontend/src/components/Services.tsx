import { useState } from "react";
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
import Tilt from "../motion/Tilt";
import { Backdrop3D, Strip3D } from "../three/Scenes";
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
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <section className="services-band" id="services" aria-labelledby="services-title">
      <div className="services-glow" aria-hidden="true" />
      <Backdrop3D variant="difference" className="services-backdrop" />
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
        <Strip3D kind="services" hovered={hovered} count={services.length} className="services-strip" />
        <motion.ul
          className="services-grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        >
          {services.map(({ icon: Icon, title, tagline }, i) => (
            <motion.li
              key={title}
              variants={{
                hidden: { opacity: 0, y: 22, scale: 0.96 },
                show: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <Tilt
                className="service-tilt"
                max={12}
                onHover={(on) => setHovered(on ? i : null)}
              >
                <span className="service-icon">
                  <Icon size={26} strokeWidth={1.7} />
                </span>
                <h3>{title}</h3>
                <p>{tagline}</p>
              </Tilt>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
