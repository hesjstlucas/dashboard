import "./globals.css";
import { DemoProvider } from "@/components/demo-provider";
import { AppShell } from "@/components/app-shell";

export const metadata = {
  title: "Paralix | ER:LC Operations Portal",
  description: "A realistic ER:LC public website and operations dashboard for Paralix departments."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DemoProvider>
          <AppShell>{children}</AppShell>
        </DemoProvider>
      </body>
    </html>
  );
}
