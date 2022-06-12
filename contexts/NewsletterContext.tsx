import { Newsletter } from "@prisma/client";
import { createContext, FC, useContext, useMemo, useState } from "react";

interface NewsletterContextValue {
  newsletter: Newsletter | null;
  setNewsletter: (n: Newsletter) => void;
}

const NewsletterContext = createContext<NewsletterContextValue>({} as any);

type NewsletterProviderProps = {
  children: React.ReactNode;
};

export const NewsletterProvider: FC<NewsletterProviderProps> = ({
  children,
}) => {
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);

  return (
    <NewsletterContext.Provider value={{ newsletter, setNewsletter }}>
      {useMemo(() => children, [children])}
    </NewsletterContext.Provider>
  );
};

export function useNewsletterContext(): NewsletterContextValue {
  return useContext(NewsletterContext);
}
