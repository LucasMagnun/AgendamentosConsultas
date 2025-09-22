import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProfessionalService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; specialtyId: number }) {
    // verifica se a especialidade existe
    await this.prisma.specialty.findUnique({ where: { id: data.specialtyId } }) 
      || (() => { throw new NotFoundException(`Specialty with ID ${data.specialtyId} not found`) })();
    return this.prisma.professional.create({ data });
  }

  async findAll() {
    return this.prisma.professional.findMany({
      include: { specialty: true },
    });
  }

  async findById(id: number) {
    const professional = await this.prisma.professional.findUnique({
      where: { id },
      include: { specialty: true },
    });
    if (!professional) throw new NotFoundException(`Professional with ID ${id} not found`);
    return professional;
  }

  async findBySpecialty(specialtyId: number) {
    return this.prisma.professional.findMany({
      where: { specialtyId },
      include: { specialty: true },
    });
  }

  async update(id: number, data: { name?: string; specialtyId?: number }) {
    await this.findById(id);
    if (data.specialtyId) {
      await this.prisma.specialty.findUnique({ where: { id: data.specialtyId } })
        || (() => { throw new NotFoundException(`Specialty with ID ${data.specialtyId} not found`) })();
    }
    return this.prisma.professional.update({ where: { id }, data });
  }

  async delete(id: number) {
    await this.findById(id);
    return this.prisma.professional.delete({ where: { id } });
  }
}
