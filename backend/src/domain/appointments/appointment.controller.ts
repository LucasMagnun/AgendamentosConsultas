import { Controller, Post, Get, Patch, Param, Body, ParseIntPipe } from '@nestjs/common';
import { AppointmentService } from './appointment.service';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly service: AppointmentService) {}

@Post()
create(
  @Body()
  body: { cpf: string; name: string; professionalId: number; date: string }
) {
  return this.service.create(body);
}


  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('patient/:cpf')
  findByPatientCpf(@Param('cpf') cpf: string) {
    return this.service.findByPatientCpf(cpf);
  }

  @Patch(':id/cancel')
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.service.cancel(id);
  }

    @Get('available/:professionalId')
  getAvailable(@Param('professionalId', ParseIntPipe) professionalId: number) {
    return this.service.getAvailableDates(professionalId);
  }
}
