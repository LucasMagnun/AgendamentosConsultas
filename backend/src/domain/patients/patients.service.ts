import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PatientService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; cpf: string }) {
    return this.prisma.patient.create({ data });
  }

  async findAll() {
    return this.prisma.patient.findMany();
  }

  async findByCpf(cpf: string) {
    const patient = await this.prisma.patient.findUnique({ where: { cpf } });
    if (!patient) throw new NotFoundException(`Patient with CPF ${cpf} not found`);
    return patient;
  }

  async update(id: number, data: { name?: string; cpf?: string }) {
    await this.findById(id); // garante que exista
    return this.prisma.patient.update({ where: { id }, data });
  }

  async delete(id: number) {
    await this.findById(id); // garante que exista
    return this.prisma.patient.delete({ where: { id } });
  }

  private async findById(id: number) {
    const patient = await this.prisma.patient.findUnique({ where: { id } });
    if (!patient) throw new NotFoundException(`Patient with ID ${id} not found`);
    return patient;
  }
}
