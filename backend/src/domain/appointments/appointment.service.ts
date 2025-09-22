import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AppointmentService {
  constructor(private readonly prisma: PrismaService) {}

async create(data: { cpf: string; name: string; professionalId: number; date: string }) {
  // Verifica se paciente existe pelo CPF
  let patient = await this.prisma.patient.findUnique({ where: { cpf: data.cpf } });

  // Se não existir, cria
  if (!patient) {
    patient = await this.prisma.patient.create({
      data: { cpf: data.cpf, name: data.name },
    });
  }

  // Verifica se profissional existe
  const professional = await this.prisma.professional.findUnique({
    where: { id: data.professionalId },
  });
  if (!professional) {
    throw new NotFoundException(`Professional with ID ${data.professionalId} not found`);
  }

  // Cria o agendamento
  return this.prisma.appointment.create({
    data: {
      patientId: patient.id,
      professionalId: professional.id,
      date: new Date(data.date),
    },
    include: {
      patient: true,
      professional: { include: { specialty: true } },
    },
  });
}


  async findAll() {
    return this.prisma.appointment.findMany({
      include: { patient: true, professional: true },
      orderBy: { date: 'asc' },
    });
  }

  async findByPatientCpf(cpf: string) {
    const patient = await this.prisma.patient.findUnique({ where: { cpf } });
    if (!patient) throw new NotFoundException(`Patient with CPF ${cpf} not found`);

    return this.prisma.appointment.findMany({
      where: { patientId: patient.id },
      include: {       professional: {
        include: {
          specialty: true, // Inclui a especialidade
        },
      }, },
      orderBy: { date: 'asc' },
    });
  }

  async cancel(id: number) {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appointment) throw new NotFoundException(`Appointment with ID ${id} not found`);

    return this.prisma.appointment.update({
      where: { id },
      data: { canceled: true },
    });
  }

  async getAvailableDates(professionalId: number) {
    const now = new Date();

    // Buscar todos os agendamentos futuros do profissional
    const bookedAppointments = await this.prisma.appointment.findMany({
      where: {
        professionalId,
        canceled: false,
        date: { gte: now },
      },
      select: { date: true },
    });

    const bookedDates = bookedAppointments.map(a => a.date.toISOString());

    // Criar lista de horários padrão (ex: 9h, 11h, 14h, 16h) do mês atual
    const availableSlots: Date[] = [];
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    for (let day = now.getDate(); day <= 31; day++) {
      const baseDate = new Date(currentYear, currentMonth, day);

      // Horários fixos
      [9, 11, 14, 16].forEach(hour => {
        const slot = new Date(baseDate);
        slot.setHours(hour, 0, 0, 0);

        // Se não estiver agendado e for futuro, adiciona
        if (!bookedDates.includes(slot.toISOString()) && slot > now) {
          availableSlots.push(slot);
        }
      });
    }

    return availableSlots.map(d => d.toISOString());
  }
}
