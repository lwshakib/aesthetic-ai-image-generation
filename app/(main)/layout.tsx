import { MainHeader } from "@/components/main-header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <MainHeader />
      <main className="flex-1 flex overflow-hidden">
        {children}
      </main>
    </div>
  );
}
