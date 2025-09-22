"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex h-screen items-center justify-center bg-gray-50">
      <div className="space-y-6 text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Sistema de Consultas Médicas
        </h1>
        <p className="text-gray-600">Escolha uma opção abaixo:</p>

        <div className="flex gap-6 justify-center">
          <Button
            onClick={() => router.push("/appointments")}
            className="px-8 py-6 text-lg rounded-2xl"
          >
            Minhas Consultas
          </Button>

          <Button
            onClick={() => router.push("/schedule")}
            variant="secondary"
            className="px-8 py-6 text-lg rounded-2xl"
          >
            Agendar Consulta
          </Button>
        </div>
      </div>
    </main>
  );
}
