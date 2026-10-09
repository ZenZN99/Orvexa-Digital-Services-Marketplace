import Hero from "./shared/components/Hero";
import AnnouncementBar from "./shared/components/AnnouncementBar";
import CookieConsent from "./shared/components/CookieConsent";
import StatsMarquee from "./shared/components/StatsMarquee";
import About from "./shared/components/About";
import Services from "./shared/components/Services";
import RecommendedServices from "./shared/components/RecommendedServices";
import ClientReviews from "./shared/components/ClientReviews";
import CTA from "./shared/components/CTA";

export default function Home() {
  return (
    <div>
      <AnnouncementBar />
      <Hero />
      <CookieConsent />
      <StatsMarquee />
      <About />
      <Services />
      <RecommendedServices />
      <ClientReviews />
      <CTA />
    </div>
  );
}
