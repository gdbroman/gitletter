import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

import { newsletterService } from "../src/services/newsletterService";

interface INewsletterContext {
  newsletterId?: string;
}

const NewsletterContext = createContext<INewsletterContext>({});

export const NewsletterContextProvider = ({ children }) => {
  const { status, data } = useSession();
  const [newsletterId, setNewsletterId] = useState<string | undefined>();

  useEffect(() => {
    const getAndSetNewsletterId = async () => {
      const userEmail = data?.user?.email;
      if (status === "authenticated" && userEmail) {
        const newsletterId = await newsletterService.getNewsletterByEmail(
          userEmail
        );
        setNewsletterId(newsletterId);
      }
    };
    getAndSetNewsletterId();
  }, [status, data?.user?.email]);

  return (
    <NewsletterContext.Provider
      value={{
        newsletterId,
      }}
    >
      {children}
    </NewsletterContext.Provider>
  );
};

export const useNewsletterContext = () => useContext(NewsletterContext);
