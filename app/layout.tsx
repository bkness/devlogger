import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dev Logger",
  description: "A dev log app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            var s = localStorage.getItem('devlogger-settings');
            if (s) {
              var t = JSON.parse(s).appTheme;
              if (t) document.documentElement.classList.add(t);
            }
          } catch(e) {}
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
