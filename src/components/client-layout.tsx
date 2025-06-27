'use client';
import React from 'react';
import { PrivyProvider } from "@privy-io/react-auth";
import { ThemeProvider } from "@/components/theme-provider";

interface ClientProviderProps {
  children: React.ReactNode;
}

export default function ClientProvider({ children }: ClientProviderProps) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        loginMethods: ["wallet", "email", "google", "twitter"],
        appearance: {
          theme: "light",
          accentColor: "#2d2d2d",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets" as const,
        },
        defaultChain: {
          id: 84532,
          name: "Base Sepolia",
          network: "base-sepolia",
          nativeCurrency: {
            decimals: 18,
            name: "Base Sepolia Ether",
            symbol: "ETH",
          },
          rpcUrls: {
            default: {
              http: ["https://sepolia.base.org"],
            },
            public: {
              http: ["https://sepolia.base.org"],
            },
          },
          blockExplorers: {
            default: { name: "Basescan", url: "https://sepolia.basescan.org" },
          },
          testnet: true,
        },
      }}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
        forcedTheme="light"
      >
        {children}
      </ThemeProvider>
    </PrivyProvider>
  );
}
