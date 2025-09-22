"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SchedulePage() {
  const [cpf, setCpf] = useState("");
  const [name, setName] = useState("");
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedProfessional, setSelectedProfessional] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Carregar especialidades
  useEffect(() => {
    fetch(`${API_URL}/specialties`)
      .then((res) => res.json())
      .then((data) => setSpecialties(data))
      .catch((err) => console.error("Erro ao buscar especialidades:", err));
  }, [API_URL]);

  // Quando selecionar especialidade, buscar profissionais
  useEffect(() => {
    if (selectedSpecialty) {
      fetch(`${API_URL}/professionals/specialty/${selectedSpecialty}`)
        .then((res) => res.json())
        .then((data) => setProfessionals(data))
        .catch((err) => console.error("Erro ao buscar profissionais:", err));
    } else {
      setProfessionals([]);
    }
  }, [selectedSpecialty, API_URL]);

  // Quando selecionar profissional, buscar datas disponíveis
  useEffect(() => {
    if (selectedProfessional) {
      fetch(`${API_URL}/appointments/available/${selectedProfessional}`)
        .then((res) => res.json())
        .then((data: string[]) => {
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();

          // Filtra datas futuras do mês atual
          const filteredDates = data.filter((d) => {
            const date = new Date(d);
            return (
              date.getFullYear() === currentYear &&
              date.getMonth() === currentMonth &&
              date > now
            );
          });

          setDates(filteredDates);
        })
        .catch((err) =>
          console.error("Erro ao buscar datas disponíveis:", err)
        );
    } else {
      setDates([]);
    }
  }, [selectedProfessional, API_URL]);

  async function handleSchedule() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cpf,
          name,
          specialtyId: selectedSpecialty,
          professionalId: selectedProfessional,
          date: selectedDate,
        }),
      });

      if (!res.ok) throw new Error("Erro ao agendar consulta");

      alert("Consulta agendada com sucesso!");
      setCpf("");
      setName("");
      setSelectedSpecialty("");
      setSelectedProfessional("");
      setSelectedDate("");
    } catch (err) {
      console.error(err);
      alert("Falha ao agendar consulta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-10 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Agendar Consulta</h1>

      {/* CPF e Nome */}
      <div className="space-y-2">
        <Label htmlFor="cpf">CPF</Label>
        <Input
          id="cpf"
          placeholder="Digite seu CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          placeholder="Digite seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Especialidade */}
      <div className="space-y-2">
        <Label>Especialidade</Label>
        <Select onValueChange={setSelectedSpecialty} value={selectedSpecialty}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a especialidade" />
          </SelectTrigger>
          <SelectContent>
            {specialties.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Profissional */}
      {professionals.length > 0 && (
        <div className="space-y-2">
          <Label>Profissional</Label>
          <Select
            onValueChange={setSelectedProfessional}
            value={selectedProfessional}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o médico" />
            </SelectTrigger>
            <SelectContent>
              {professionals.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Datas */}
      {dates.length > 0 && (
        <div className="space-y-2">
          <Label>Data disponível</Label>
          <Select onValueChange={setSelectedDate} value={selectedDate}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a data" />
            </SelectTrigger>
            <SelectContent>
              {dates.map((d) => (
                <SelectItem key={d} value={d}>
                  {new Date(d).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Botão confirmar */}
      <Button
        onClick={handleSchedule}
        disabled={
          loading ||
          !cpf ||
          !name ||
          !selectedSpecialty ||
          !selectedProfessional ||
          !selectedDate
        }
        className="w-full"
      >
        {loading ? "Agendando..." : "Confirmar Agendamento"}
      </Button>
    </main>
  );
}
