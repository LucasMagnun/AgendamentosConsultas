import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AppointmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { patientId: number; professionalId: number; date: string }) {
    // Verifica se paciente existe
    await this.prisma.patient.findUnique({ where: { id: data.patientId } })
      || (() => { throw new NotFoundException(`Patient with ID ${data.patientId} not found`) })();

    // Verifica se profissional existe
    await this.prisma.professional.findUnique({ where: { id: data.professionalId } })
      || (() => { throw new NotFoundException(`Professional with ID ${data.professionalId} not found`) })();

    return this.prisma.appointment.create({
      data: {
        patientId: data.patientId,
        professionalId: data.professionalId,
        date: new Date(data.date),
      },
      include: { patient: true, professional: true },
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
      include: { professional: true },
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
}
