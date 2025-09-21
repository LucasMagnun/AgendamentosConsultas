import { Controller, Post, Get, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { PatientService } from './patients.service';

@Controller('patients')
export class PatientController {
  constructor(private readonly service: PatientService) {}

  @Post()
  create(@Body() body: { name: string; cpf: string }) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('cpf/:cpf')
  findByCpf(@Param('cpf') cpf: string) {
    return this.service.findByCpf(cpf);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: { name?: string; cpf?: string }) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
