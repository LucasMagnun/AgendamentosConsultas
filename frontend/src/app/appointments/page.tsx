"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AppointmentsPage() {
  const [cpf, setCpf] = useState("");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/patient/${cpf}`);
      console.log("Status da resposta:", res.status);

      if (res.status === 404) {
        alert("Nenhuma consulta encontrada para este CPF.");
        setAppointments([]);
        return;
      }

      if (!res.ok) throw new Error("Erro ao buscar consultas");

      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error(err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id: number) {
    if (!confirm("Deseja realmente cancelar esta consulta?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${id}/cancel`, {
        method: "PATCH",
      });

      if (!res.ok) throw new Error("Falha ao cancelar consulta");

      // Atualiza a lista removendo ou marcando como cancelado
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === id ? { ...appt, canceled: true } : appt
        )
      );

      alert("Consulta cancelada com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao cancelar consulta");
    }
  }

  return (
    <main className="p-10 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Minhas Consultas</h1>

      <div className="flex gap-4">
        <Input
          type="text"
          placeholder="Digite seu CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </Button>
      </div>

      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map((appt) => (
            <Card key={appt.id}>
              <CardContent className="p-4 space-y-2">
  <p>
    <span className="font-semibold">Data:</span>{" "}
    {new Date(appt.date).toLocaleString()}
  </p>
  <p>
    <span className="font-semibold">Médico:</span>{" "}
    {appt.professional?.name}
  </p>
  <p>
    <span className="font-semibold">Especialidade:</span>{" "}
    {appt.professional?.specialty?.name || "—"}
  </p>
  <p>
    <span className="font-semibold">Cancelado:</span>{" "}
    {appt.canceled ? "Sim" : "Não"}
  </p>
  {!appt.canceled && (
    <Button
      variant="destructive"
      size="sm"
      className="hover:bg-red-700 transition-colors" // hover
      onClick={() => handleCancel(appt.id)}
    >
      Cancelar
    </Button>
  )}
</CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">Nenhuma consulta encontrada.</p>
        )}
      </div>
    </main>
  );
}
