import { signIn as nextAuthSignIn } from "next-auth/react";
import { useState } from "react";

export const useSignIn = () => {
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    try {
      nextAuthSignIn("github", { callbackUrl: "/api/onboarding" });
    } catch {
      setLoading(false);
    }
  };

  return { signIn, loading };
};
