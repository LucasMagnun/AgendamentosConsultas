# Agendamentos de Consultas Médicas

Projeto desenvolvido para fins acadêmicos, com o objetivo de gerenciar agendamentos de consultas e exames médicos.  

## 🛠 Stack utilizada

**Frontend:**
- [React](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/UI](https://shadcn.dev/) (componentes UI)

**Backend:**
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/) (ORM)
- [PostgreSQL](https://www.postgresql.org/) (banco de dados)
- [Docker](https://www.docker.com/) (opcional, para containerização)

## ⚡ Funcionalidades

- Cadastro de pacientes automaticamente ao agendar consultas (caso ainda não existam no sistema).
- Listagem de especialidades médicas.
- Listagem de profissionais vinculados a cada especialidade.
- Listagem de consultas de um paciente através do CPF.
- Cancelamento de consultas diretamente pelo front-end.
- Disponibilidade de datas mostradas apenas para o mês atual, superiores à data atual e que ainda não possuem agendamento.
- Visualização dos detalhes do agendamento: paciente, médico, especialidade e status de cancelamento.
