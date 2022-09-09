import { signIn as nextAuthSignIn } from "next-auth/react";

export const signIn = async () => {
  nextAuthSignIn("github", { callbackUrl: "/api/onboarding" });
};
