-- Select database
\c pfinance;

-- CreateTable
CREATE TABLE "Expense" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "installmentAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "bank" TEXT,
    "cardLastFour" TEXT,
    "category" TEXT NOT NULL,
    "installments" INTEGER NOT NULL DEFAULT 1,
    "installmentNumber" INTEGER,
    "currentInstallment" INTEGER NOT NULL DEFAULT 1,
    "type" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creditCardId" INTEGER,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditCard" (
    "id" SERIAL NOT NULL,
    "bank" TEXT NOT NULL,
    "lastFour" TEXT NOT NULL,
    "limit" DOUBLE PRECISION NOT NULL,
    "currentSpending" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreditCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialGoal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "targetAmount" DOUBLE PRECISION NOT NULL,
    "currentAmount" DOUBLE PRECISION NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialGoal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CreditCard_bank_lastFour_key" ON "CreditCard"("bank", "lastFour");

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_creditCardId_fkey" FOREIGN KEY ("creditCardId") REFERENCES "CreditCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
