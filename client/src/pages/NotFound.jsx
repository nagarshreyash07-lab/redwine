import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ParticleField from "../components/graphics/ParticleField";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <section style={{ position: "relative", minHeight: "100svh", display: "grid", placeItems: "center", textAlign: "center", padding: "120px 24px", background: "radial-gradient(ellipse at 50% 50%, #34202a, #11100f 70%)", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.6 }}><ParticleField /></div>
      <motion.div style={{ position: "relative" }} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <p style={{ letterSpacing: ".18em", fontSize: ".7rem", color: "#a7a09a", margin: 0 }}>ERROR 404</p>
        <h1 style={{ font: "600 clamp(4rem,14vw,10rem)/1 var(--font-display)", letterSpacing: "-.08em", margin: "16px 0" }}>Lost in <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "#c27a8b" }}>space.</span></h1>
        <p style={{ color: "#b8b0aa", margin: "0 0 32px" }}>The page you're looking for doesn't exist — but curiosity brought you here.</p>
        <Button as={Link} to="/">Back to home</Button>
      </motion.div>
    </section>
  );
}
