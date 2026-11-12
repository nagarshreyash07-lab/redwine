import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollProgress from "./ScrollProgress";
import ScrollToHash from "./ScrollToHash";
import AnalyticsTracker from "./AnalyticsTracker";
import AnalyticsConsent from "./AnalyticsConsent";

export default function SiteLayout() {
  return (
    <>
      <a href="#main" className="sr-only">Skip to content</a>
      <ScrollProgress />
      <ScrollToHash />
      <AnalyticsTracker />
      <Navbar />
      <main id="main"><Outlet /></main>
      <Footer />
      <AnalyticsConsent />
    </>
  );
}
