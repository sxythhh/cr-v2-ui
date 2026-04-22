import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans, Outfit, Space_Grotesk, Bebas_Neue, Fjalla_One, Antonio, Jost, Urbanist, Manrope, Red_Hat_Display, Saira, Bricolage_Grotesque, Tektur } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import localFont from "next/font/local";

import "./globals.css";
import { SideNavProvider } from "@/components/sidebar/sidebar-context";
import { MainNav } from "@/components/sidebar/main-nav";
import { ToastProvider } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { ChatWidget } from "@/components/chat-widget";
import { InteractiveDemoProvider } from "@/components/interactive-demo";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// Local display fonts
const clashDisplay = localFont({ src: "../../public/fonts/clash-display.ttf", variable: "--font-clash-display", display: "swap" });
const cabinetGrotesk = localFont({ src: "../../public/fonts/cabinet-grotesk.ttf", variable: "--font-cabinet-grotesk", display: "swap" });
const satoshi = localFont({ src: "../../public/fonts/satoshi.ttf", variable: "--font-satoshi", display: "swap" });
const generalSans = localFont({ src: "../../public/fonts/general-sans.ttf", variable: "--font-general-sans", display: "swap" });
const monaSans = localFont({ src: "../../public/fonts/mona-sans.woff2", variable: "--font-mona-sans", display: "swap" });
const hubotSans = localFont({ src: "../../public/fonts/hubot-sans.ttf", variable: "--font-hubot-sans", display: "swap" });
const panchang = localFont({ src: "../../public/fonts/panchang.ttf", variable: "--font-panchang", display: "swap" });
const bespokeSans = localFont({ src: "../../public/fonts/bespoke-sans.ttf", variable: "--font-bespoke-sans", display: "swap" });
const chillax = localFont({ src: "../../public/fonts/chillax.ttf", variable: "--font-chillax", display: "swap" });
// Google display fonts
const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas-neue", display: "swap" });
const fjallaOne = Fjalla_One({ weight: "400", subsets: ["latin"], variable: "--font-fjalla-one", display: "swap" });
const antonio = Antonio({ subsets: ["latin"], variable: "--font-antonio", display: "swap" });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-plus-jakarta", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });
const jost = Jost({ subsets: ["latin"], variable: "--font-jost", display: "swap" });
const urbanist = Urbanist({ subsets: ["latin"], variable: "--font-urbanist", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const redHatDisplay = Red_Hat_Display({ subsets: ["latin"], variable: "--font-red-hat-display", display: "swap" });
const saira = Saira({ subsets: ["latin"], variable: "--font-saira", display: "swap" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const tektur = Tektur({ subsets: ["latin"], variable: "--font-tektur", display: "swap" });

export const metadata: Metadata = {
  title: "Brand Name | Content Rewards",
  icons: {
    icon: "/favicon.webp",
  },
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(location.pathname.startsWith("/forms-demo/embed"))return;var t=localStorage.getItem("theme");if(t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme:dark)").matches)||location.pathname.startsWith("/admin"))document.documentElement.classList.add("dark")}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${inter.className} ${inter.variable} ${GeistSans.variable} ${clashDisplay.variable} ${cabinetGrotesk.variable} ${satoshi.variable} ${generalSans.variable} ${monaSans.variable} ${hubotSans.variable} ${panchang.variable} ${bespokeSans.variable} ${chillax.variable} ${bebasNeue.variable} ${fjallaOne.variable} ${antonio.variable} ${plusJakarta.variable} ${outfit.variable} ${spaceGrotesk.variable} ${jost.variable} ${urbanist.variable} ${manrope.variable} ${redHatDisplay.variable} ${saira.variable} ${bricolage.variable} ${tektur.variable} select-none overflow-x-hidden bg-page-outer-bg text-foreground antialiased`}>
        <ThemeProvider>
          <ToastProvider position="bottom-right">
            <SideNavProvider>
              <InteractiveDemoProvider>
                <MainNav>{children}</MainNav>
              </InteractiveDemoProvider>
              {/* <ChatWidget /> */}
            </SideNavProvider>
          </ToastProvider>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
