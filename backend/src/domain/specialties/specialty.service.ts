import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SpecialtyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string }) {
    return this.prisma.specialty.create({ data });
  }

  async findAll() {
    return this.prisma.specialty.findMany();
  }

  async findById(id: number) {
    const specialty = await this.prisma.specialty.findUnique({ where: { id } });
    if (!specialty) throw new NotFoundException(`Specialty with ID ${id} not found`);
    return specialty;
  }

  async update(id: number, data: { name?: string }) {
    await this.findById(id);
    return this.prisma.specialty.update({ where: { id }, data });
  }

  async delete(id: number) {
    await this.findById(id);
    return this.prisma.specialty.delete({ where: { id } });
  }
}
