import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { NextSeo } from "next-seo";
import { FC } from "react";

import Layout from "../../src/components/Layout";
import { ProtectedPage } from "../../src/components/ProtectedPage";

type Props = {};

const New: FC<Props> = () => {
  return (
    <ProtectedPage>
      <Layout>
        <NextSeo title="Compose" />
        <main>
          <Typography variant="h1" fontWeight="bold">
            New issue
          </Typography>
          <TextField placeholder="write something here" />
        </main>
      </Layout>
    </ProtectedPage>
  );
};

export default New;
