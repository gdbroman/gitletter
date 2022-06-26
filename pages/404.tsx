import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { FC } from "react";

import Layout from "../src/components/Layout";

const FourOhFour: FC = () => (
  <Layout>
    <main>
      <Box mx="auto" my="64px" textAlign="center">
        <Typography variant="h1" fontWeight="bold" mb="32px">
          404 Not found
        </Typography>
        <Link href="/" passHref>
          <Button variant="contained" size="large">
            Return home
          </Button>
        </Link>
      </Box>
    </main>
  </Layout>
);

export default FourOhFour;
