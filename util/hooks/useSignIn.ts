import { signIn as nextAuthSignIn } from "next-auth/react";
import { useState } from "react";

import { ButtonRef } from "../types";

export const useSignIn = () => {
  const [loadingRef, setLoadingRef] = useState<ButtonRef | null>(null);

  const signIn = async (buttonRef: ButtonRef) => {
    setLoadingRef(buttonRef);
    try {
      nextAuthSignIn("github", { callbackUrl: "/api/onboarding" });
    } catch {
      setLoadingRef(null);
    }
  };

  return { signIn, loadingRef };
};
