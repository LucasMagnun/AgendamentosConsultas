import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PatientModule } from './domain/patients/patients.module';
import { SpecialtyModule } from './domain/specialties/specialty.module';
import { ProfessionalModule } from './domain/professionals/professional.module';
import { AppointmentModule } from './domain/appointments/appointment.module';

@Module({
  imports: [
    PrismaModule,
    PatientModule,
    SpecialtyModule,
    ProfessionalModule,
    AppointmentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
