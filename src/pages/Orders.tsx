import { AppHeader } from "@/components/AppHeader";

export default function Orders() {
  return (
    <div className="min-h-dvh bg-bg pb-20 md:pb-0">
      <AppHeader showBack title="Mes commandes" />
      <main className="max-w-md mx-auto px-4 py-10 text-center">
        <p className="text-muted-foreground">Mes commandes (à venir)</p>
      </main>
    </div>
  );
}
