import InfoPage from "@/components/InfoPage";
import SiteShell from "@/components/SiteShell";
import { infoPages } from "@/lib/pages";

export const metadata = {
  title: "Dampak Stunting",
};

export default function DampakPage() {
  return (
    <SiteShell>
      <InfoPage page={infoPages.dampak} />
    </SiteShell>
  );
}