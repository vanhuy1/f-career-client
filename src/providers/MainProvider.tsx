"use client";
import ReduxProvider from "@/providers/ReduxProvider";

const MainProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <ReduxProvider>{children}</ReduxProvider>;
};

export default MainProvider;
