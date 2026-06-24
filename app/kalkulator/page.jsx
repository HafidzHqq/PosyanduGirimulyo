import { cookies } from "next/headers";
import LoginForm from "@/components/LoginForm";
import LogoutButton from "@/components/LogoutButton";
import NutritionCalculator from "@/components/NutritionCalculator";
import SiteShell from "@/components/SiteShell";
import { isAuthenticated } from "@/lib/auth";

export const metadata = {
  title: "Kalkulator Gizi Z-Score",
};

export default function KalkulatorPage() {
  const authenticated = isAuthenticated(cookies());

  return (
    <SiteShell>
      {authenticated ? (
        <>
          <div className="mt-4 flex justify-end sm:mt-6">
            <LogoutButton />
          </div>
          <NutritionCalculator />
        </>
      ) : (
        <LoginForm />
      )}
    </SiteShell>
  );
}
