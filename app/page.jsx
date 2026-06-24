import InfoPage from "@/components/InfoPage";
import SiteShell from "@/components/SiteShell";
import { infoPages } from "@/lib/pages";

export const metadata = {
  title: "Posyandu Girimulyo - Homepage",
};

export default function HomePage() {
  return (
    <SiteShell>
      <InfoPage page={infoPages.home} headingLevel="h1" />
    </SiteShell>
  );
}
