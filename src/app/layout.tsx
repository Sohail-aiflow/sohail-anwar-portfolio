import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

const bodyFont = localFont({
  src: "../../node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2",
  variable: "--font-body-face",
  display: "swap",
  weight: "100 1000",
});
const displayFont = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2",
      style: "normal",
      weight: "200 800",
    },
    {
      path: "../../node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-italic.woff2",
      style: "italic",
      weight: "200 800",
    },
  ],
  variable: "--font-display-face",
  display: "swap",
});
import "./globals.css";
import { EditorialHeader } from "@/components/layout/editorial-header";
import { Atmosphere } from "@/components/layout/atmosphere";
import { pageMetadata } from "@/lib/seo";
import { getPortfolioContent } from "@/lib/content/repository";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getPortfolioContent();
  return pageMetadata({
    title: `${profile.name} | ${profile.headline}`,
    description: profile.shortIntroduction,
    path: "/",
    name: profile.name,
  });
}
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { profile } = await getPortfolioContent();
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Atmosphere />
        <EditorialHeader identity={profile} />
        {children}
      </body>
    </html>
  );
}
