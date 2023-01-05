import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import type { NextPage } from "next/types";

import { FeedbackFooter } from "../src/components/FeedbackFooter";
import Layout from "../src/components/Layout";
import { useAppHref } from "../util/hooks/useAppHref";

const FourOhFourPage: NextPage = () => {
  const appHref = useAppHref();

  return (
    <Layout footer={<FeedbackFooter />}>
      <main>
        <Box mx="auto" my="64px" textAlign="center">
          <Typography variant="h1" fontWeight="bold" mb="32px">
            404 Not found
          </Typography>
          <Link href={appHref} passHref>
            <Button variant="contained" size="large">
              Return home
            </Button>
          </Link>
        </Box>
      </main>
    </Layout>
  );
};

export default FourOhFourPage;
