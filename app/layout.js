import "./globals.css";
import { DemoProvider } from "@/components/demo-provider";
import { AppShell } from "@/components/app-shell";

export const metadata = {
  title: "TLRP | ER:LC Roleplay Community",
  description: "A custom TLRP landing page and operations portal built for ER:LC communities."
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
