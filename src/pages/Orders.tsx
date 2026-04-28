import { AppHeader } from "@/components/AppHeader";

export default function Orders() {
  return (
    <div className="min-h-screen bg-bg">
      <AppHeader showBack title="Mes commandes" />
      <main className="max-w-md mx-auto px-4 py-10 text-center">
        <p className="text-muted">
          Vous n'avez pas encore de commande.
        </p>
      </main>
    </div>
  );
}
