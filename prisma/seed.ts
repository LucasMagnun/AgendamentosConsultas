import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // --- Especialidades ---
  const cardiologia = await prisma.specialty.create({
    data: { name: 'Cardiologia' },
  });
  const ortopedia = await prisma.specialty.create({
    data: { name: 'Ortopedia' },
  });
  const dermatologia = await prisma.specialty.create({
    data: { name: 'Dermatologia' },
  });

  // --- Profissionais ---
  const profissionais = await prisma.professional.createMany({
    data: [
      { name: 'Dr. João Cardoso', specialtyId: cardiologia.id },
      { name: 'Dra. Maria Coração', specialtyId: cardiologia.id },

      { name: 'Dr. Pedro Ossos', specialtyId: ortopedia.id },
      { name: 'Dra. Ana Coluna', specialtyId: ortopedia.id },

      { name: 'Dr. Carlos Pele', specialtyId: dermatologia.id },
      { name: 'Dra. Fernanda Derme', specialtyId: dermatologia.id },
    ],
  });

  const allProfessionals = await prisma.professional.findMany();

  // --- Pacientes + Agendamentos ---
  let cpfCounter = 10000000000; // só para gerar CPFs únicos
  for (const professional of allProfessionals) {
    for (let i = 1; i <= 3; i++) {
      cpfCounter++;

      const patient = await prisma.patient.create({
        data: {
          name: `Paciente ${i} de ${professional.name}`,
          cpf: cpfCounter.toString(),
        },
      });

      await prisma.appointment.create({
        data: {
          date: new Date(2025, 8, i + professional.id), // setembro 2025
          patientId: patient.id,
          professionalId: professional.id,
        },
      });
    }
  }

  console.log('✅ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
