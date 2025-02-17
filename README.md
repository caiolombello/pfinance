# pFinance - Gerenciador Financeiro Pessoal

Um gerenciador financeiro pessoal moderno que utiliza IA para automatizar o registro de despesas através de SMS bancários.

## Características Principais

### 🤖 Automação Inteligente de Despesas
- Processamento automático de SMS de gastos do cartão de crédito usando IA (GPT-4)
- Extração inteligente de informações como:
  - Valor da compra
  - Estabelecimento
  - Data e hora
  - Número de parcelas
  - Banco e últimos 4 dígitos do cartão
- Categorização automática de despesas baseada no estabelecimento
- Suporte para principais bancos brasileiros (Bradesco, Itaú, Santander, Nubank, Inter)

### 📊 Dashboard Completo
- Visão geral dos gastos mensais
- Análise de gastos por categoria
- Acompanhamento de cartões de crédito
- Histórico de despesas
- Gráficos e relatórios

### 💳 Gestão de Cartões
- Controle de múltiplos cartões de crédito
- Acompanhamento de limites e gastos
- Gestão de faturas
- Controle de parcelas

## Tecnologias

- Next.js 14 (App Router)
- TypeScript
- Prisma (ORM)
- Supabase (Autenticação)
- Tailwind CSS
- OpenAI GPT-4

## Configuração

### Variáveis de Ambiente

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# OpenAI
OPENAI_API_KEY=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# API Key para SMS
SMS_API_KEY=

# Database
DATABASE_URL=
```

### Instalação

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Rodar migrações
npx prisma migrate dev

# Iniciar em desenvolvimento
npm run dev
```

## Estrutura de Pastas


## API de SMS

A API de SMS permite automatizar o registro de despesas através de mensagens de texto recebidas dos bancos.

### Endpoint

```
POST /api/sms-expense
```

### Headers

```
x-api-key: seu_token_aqui
```

### Body

```json
{
  "message": "Compra aprovada no cartão final 1234 - Mercado Livre R$ 150,00"
}
```

### Fluxo de Processamento
1. Recebimento do SMS via API
2. Processamento do texto usando GPT-4o-mini
3. Extração de informações relevantes
4. Categorização automática da despesa
5. Registro no banco de dados
6. Atualização do saldo do cartão

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a MIT License.