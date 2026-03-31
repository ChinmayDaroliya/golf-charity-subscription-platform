import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Golf Charity Platform",
  description: "Support charities while playing golf",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}