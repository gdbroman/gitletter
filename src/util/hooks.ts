import { signIn as nextAuthSignIn } from "next-auth/react";
import { useCallback, useMemo, useState } from "react";

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

export interface UseToggleHook {
  isOn: boolean;
  toggleOn(): void;
  toggleOff(): void;
  toggle(): void;
  setToggle(isOn: boolean): void;
}

export function useToggle(defaultIsOn: boolean = false): UseToggleHook {
  const [isOn, setToggle] = useState(defaultIsOn);
  const toggleOn = useCallback(() => setToggle(true), []);
  const toggleOff = useCallback(() => setToggle(false), []);
  const toggle = useCallback(() => setToggle((prevIsOn) => !prevIsOn), []);
  return useMemo(
    () => ({ isOn, toggleOn, toggleOff, toggle, setToggle }),
    [isOn, toggleOn, toggleOff, toggle, setToggle]
  );
}
