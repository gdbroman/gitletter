import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { FC } from "react";

import AccountMenu from "./AccountMenu";

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
  align-items: center;
  p {
    margin: 0;
  }
`;

type NavProps = {
  session: Session;
  status?: string;
};

const LeftNav = ({ session }: NavProps) => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  return (
    <Nav className="left">
      <Link href="/">
        <a data-active={isActive("/")}>
          <Typography>Home</Typography>
        </a>
      </Link>
      {session && (
        <>
          <Link href="/create">
            <a data-active={isActive("/create")}>
              <Typography>New post</Typography>
            </a>
          </Link>
          <Link href="/drafts">
            <a data-active={isActive("/drafts")}>
              <Typography>My drafts</Typography>
            </a>
          </Link>
        </>
      )}
    </Nav>
  );
};

export const RightNav = ({ session, status }: NavProps) => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  if (status === "loading") {
    return (
      <Nav className="right">
        <Typography>Validating session...</Typography>
      </Nav>
    );
  }

  if (session) {
    return (
      <Nav className="right">
        <AccountMenu session={session} />
      </Nav>
    );
  }

  return (
    <Nav className="right">
      <Link href="/api/auth/signin">
        <a data-active={isActive("/signup")}>Log in</a>
      </Link>
    </Nav>
  );
};

const Header: FC = () => {
  const { data: session, status } = useSession();

  return (
    <header>
      <LeftNav session={session} />
      <RightNav session={session} status={status} />
      <style jsx>{`
        header {
          display: flex;
          padding: 2rem;
          align-items: center;
          justify-content: space-between;
        }
      `}</style>
    </header>
  );
};

export default Header;