'use client';

import { PrivyProvider } from "@privy-io/react-auth";
import { ThemeProvider } from "@/components/theme-provider";

export default function ClientProvider({ children }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
      config={{
        loginMethods: ["wallet", "email"],
        appearance: {
          theme: "light",
          accentColor: "#2d2d2d",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
          noPromptOnSignature: false,
        },
        defaultChain: {
          id: 11155111,
          name: "Sepolia",
          network: "sepolia",
          nativeCurrency: {
            decimals: 18,
            name: "Sepolia Ether",
            symbol: "ETH",
          },
          rpcUrls: {
            default: {
              http: ["https://ethereum-sepolia-rpc.publicnode.com"],
            },
            public: {
              http: ["https://ethereum-sepolia-rpc.publicnode.com"],
            },
          },
          blockExplorers: {
            default: { name: "Etherscan", url: "https://sepolia.etherscan.io" },
          },
          testnet: true,
        },
      }}
    >
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange forcedTheme="light">
        {children}
      </ThemeProvider>
    </PrivyProvider>
  );
}