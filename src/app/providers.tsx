"use client";

import { SessionProvider } from "next-auth/react";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    return (
      <SessionProvider
        refetchInterval={0}
        refetchOnWindowFocus={false}
      >
        {children}
      </SessionProvider>
    );
  } catch (error) {
    console.error('Provider error:', error);
    // Return children without SessionProvider if there's an error
    return <>{children}</>;
  }
}
