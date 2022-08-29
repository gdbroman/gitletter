import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

import { newsletterService } from "../services/newsletterService";

interface INewsletterContext {
  newsletterId?: string;
}

const NewsletterContext = createContext<INewsletterContext>({});

export const NewsletterContextProvider = ({ children }) => {
  const router = useRouter();
  const { status, data } = useSession();

  const [newsletterId, setNewsletterId] = useState<string | undefined>();

  useEffect(() => {
    const getAndSetNewsletterId = async () => {
      // First check URL for newsletterId, fetch it from the database otherwise
      const urlNewsletterId = router.query.newsletterId as string;
      if (urlNewsletterId) {
        setNewsletterId(urlNewsletterId);
      } else {
        const userEmail = data?.user?.email;
        if (status === "authenticated" && userEmail) {
          const newsletterId = await newsletterService.getNewsletterByEmail(
            userEmail
          );
          setNewsletterId(newsletterId);
        }
      }
    };
    getAndSetNewsletterId();
  }, [status, data?.user?.email, router.query.newsletterId]);

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
