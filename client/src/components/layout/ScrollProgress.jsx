import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, position: "fixed", top: 0, left: 0, right: 0, height: 3, zIndex: 60, transformOrigin: "0 50%", background: "linear-gradient(90deg,#762d40,#c27a8b)" }}
    />
  );
}
