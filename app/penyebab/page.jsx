import InfoPage from "@/components/InfoPage";
import SiteShell from "@/components/SiteShell";
import { infoPages } from "@/lib/pages";

export const metadata = {
  title: "Penyebab Stunting",
};

export default function PenyebabPage() {
  return (
    <SiteShell>
      <InfoPage page={infoPages.penyebab} />
    </SiteShell>
  );
}
