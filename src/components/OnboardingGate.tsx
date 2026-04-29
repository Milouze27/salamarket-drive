import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { OnboardingFlow } from "@/components/OnboardingFlow";

export const OnboardingGate = () => {
  const { user } = useAuth();
  const [completed, setCompleted] = useState<boolean>(true);

  useEffect(() => {
    try {
      setCompleted(localStorage.getItem("onboarding_completed") === "true");
    } catch {
      setCompleted(true);
    }

    const handleCompleted = () => setCompleted(true);
    window.addEventListener("onboarding:completed", handleCompleted);
    return () => {
      window.removeEventListener("onboarding:completed", handleCompleted);
    };
  }, []);

  if (completed || user) return null;
  return <OnboardingFlow />;
};

export default OnboardingGate;
