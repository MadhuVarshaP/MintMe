import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ClientProvider from "../components/client-layout";

const bricolageGrotesque = localFont({
  src: [
    {
      path: "../../public/fonts/BricolageGrotesque.ttf",
      style: "normal",
    },
  ],
  variable: "--font-bricolage-grotesque",
  display: "swap",
})

export const metadata: Metadata = {
  title: "MintMe - Web3 Resume Platform",
  description: "Connect your wallet, verify your GitHub, and mint your professional resume as an NFT",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={bricolageGrotesque.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                document.documentElement.classList.remove('dark');
                document.documentElement.style.colorScheme = 'light';
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${bricolageGrotesque.className} min-h-screen flex flex-col`}>
         <ClientProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
         </ClientProvider>
      </body>
    </html>
  )
}
