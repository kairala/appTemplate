import React from "react";
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { AppSidebar } from "@/components/SideBar";
import { AppHeader } from "@/components/AppHeader";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider className="h-screen w-screen">
      <AppSidebar />

      <div className="w-full h-full max-w-full overflow-auto">
        <AppHeader />

        <main className="p-4">{children}</main>
      </div>
    </SidebarProvider>
  );
}
