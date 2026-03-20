import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { SideNavProvider } from "@/components/sidebar/sidebar-context";
import { MainNav } from "@/components/sidebar/main-nav";
import { ToastProvider } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/theme-provider";
import { ChatWidget } from "@/components/chat-widget";
import { InteractiveDemoProvider } from "@/components/interactive-demo";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Brand Name | Content Rewards",
  icons: {
    icon: "/favicon.webp",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${GeistSans.variable} select-none overflow-x-hidden bg-page-outer-bg text-foreground antialiased`}>
        <ThemeProvider>
          <ToastProvider position="bottom-right">
            <SideNavProvider>
              <InteractiveDemoProvider>
                <MainNav>{children}</MainNav>
              </InteractiveDemoProvider>
              {/* <ChatWidget /> */}
            </SideNavProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
