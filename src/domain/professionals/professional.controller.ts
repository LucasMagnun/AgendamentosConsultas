import { Controller, Post, Get, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ProfessionalService } from './professional.service';

@Controller('professionals')
export class ProfessionalController {
  constructor(private readonly service: ProfessionalService) {}

  @Post()
  create(@Body() body: { name: string; specialtyId: number }) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Get('specialty/:specialtyId')
  findBySpecialty(@Param('specialtyId', ParseIntPipe) specialtyId: number) {
    return this.service.findBySpecialty(specialtyId);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: { name?: string; specialtyId?: number }) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
