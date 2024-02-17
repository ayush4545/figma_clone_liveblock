import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { Room } from "./Room";

const workSans = Work_Sans({ 
  subsets: ["latin"] ,
  weight:["400","600","700"],
  variable: "--font-work-sans"
});

export const metadata: Metadata = {
  title: "FigPro",
  description: "A minimalist figma clone using fabric.js and liveblocks for real time collaboration by Ayush Mishra",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${workSans.className} bg-primary-grey-200`}>
        <Room>
        {children}
        </Room>
        </body>
    </html>
  );
}
