import { CtaSection } from "@/app/(static)/_components/cta-section";
import { DashboardSection } from "@/app/(static)/_components/dashboard-section";
import { DigitalClock } from "@/app/(static)/_components/digitalClock";
import { FeaturesSection } from "@/app/(static)/_components/features-section";
import { HeroSection } from "@/app/(static)/_components/hero-section";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#313338] overflow-x-hidden">
      <main className="w-full flex flex-col items-center">
        <HeroSection clock={<DigitalClock />} />

        <div className="w-full relative">
          <FeaturesSection />
          <DashboardSection />
        </div>

        <CtaSection />
      </main>
    </div>
  );
}
