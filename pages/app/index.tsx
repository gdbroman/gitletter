import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { GithubIntegration, Issue, Newsletter } from "@prisma/client";
import { GetServerSideProps } from "next/types";
import { getSession } from "next-auth/react";
import { FC, useState } from "react";

import { Dropdown } from "../../components/Dropdown";
import Layout from "../../components/Layout";
import { ProtectedPage } from "../../components/ProtectedPage";
import prisma from "../../util/prisma";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { drafts: [] } };
  }

  const newsletter = await prisma.newsletter.findFirst({
    where: { author: { email: session.user.email } },
    include: {
      githubIntegration: true,
      issues: true,
    },
  });

  return {
    props: { newsletter },
  };
};

async function getRepos(githubInstallationId: string): Promise<any> {
  const res = await fetch(
    `${process.env.APP_URL}/api/github/${githubInstallationId}`,
    {
      method: "GET",
    }
  );
  const repos = await res.json();
  console.log(repos);
  return repos;
}

async function deleteIntegration(githubInstallationId: string): Promise<any> {
  await fetch(`${process.env.APP_URL}/api/github/${githubInstallationId}`, {
    method: "DELETE",
  });
}

type Props = {
  newsletter: Newsletter & {
    githubIntegration?: GithubIntegration;
    issues: Issue[];
  };
};

const Home: FC<Props> = ({ newsletter }) => {
  const { title, githubIntegration, issues } = newsletter;
  const [value, setValue] = useState(0);
  const repos = getRepos(githubIntegration?.installationId);
  console.log(repos);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <ProtectedPage>
      <Layout>
        <h1>{title ? title : "Your newsletter"}</h1>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Publish" {...a11yProps(0)} />
            <Tab label="Capture" {...a11yProps(1)} />
            <Tab label="Settings" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <main>
          <TabPanel value={value} index={0}>
            Publish
          </TabPanel>
          <TabPanel value={value} index={1}>
            Use this to capture email addresses from your newsletter.
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Typography variant="h6" mb={2}>
              Connect to GitHub
            </Typography>
            {githubIntegration?.installationId ? (
              <>
                <Dropdown />
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() =>
                    deleteIntegration(githubIntegration?.installationId)
                  }
                >
                  Disconnect
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                href={process.env.GITHUB_APP_URL}
              >
                Connect your repo
              </Button>
            )}
          </TabPanel>
        </main>
      </Layout>
    </ProtectedPage>
  );
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default Home;
