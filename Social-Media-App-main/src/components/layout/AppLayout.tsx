"use client";

import { usePathname } from "next/navigation";

import Navbar from "./Navbar";
import RealtimeProvider from "../common/RealtimeProvider";

type AppLayoutProps = {
  children: React.ReactNode;
};

const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

const AppLayout = ({ children }: AppLayoutProps) => {
  const pathname = usePathname();

  const isAuthPage = authRoutes.includes(pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <RealtimeProvider />

      <div className="w-full bg-white px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <Navbar />
      </div>

      <div className="bg-white px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        {children}
      </div>
    </>
  );
};

export default AppLayout;