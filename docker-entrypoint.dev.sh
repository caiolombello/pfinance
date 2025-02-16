#!/bin/sh

# Aguardar o banco de dados estar pronto
echo "Waiting for database to be ready..."
while ! nc -z db 5432; do
  sleep 1
done

# Gerar Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# Forçar a aplicação das migrações
echo "Running database migrations..."
npx prisma migrate reset --force

# Iniciar a aplicação
echo "Starting application..."
npm run dev 