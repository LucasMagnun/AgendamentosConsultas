import { Module } from '@nestjs/common';
import { PatientService } from './patients.service';
import { PatientController } from './patients.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PatientService],
  controllers: [PatientController],
})
export class PatientModule {}