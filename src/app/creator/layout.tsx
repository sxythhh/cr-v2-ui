import localFont from "next/font/local";

const sfProRounded = localFont({
  src: "../../fonts/SFProRounded.ttf",
  variable: "--font-sf-pro-rounded",
  weight: "100 900",
  display: "swap",
});

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${sfProRounded.variable} font-sf-pro-rounded select-none overflow-x-hidden antialiased`}>
      {children}
    </div>
  );
}
