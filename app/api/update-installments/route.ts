import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Buscar todas as despesas parceladas que ainda não terminaram
    const parceledExpenses = await prisma.expense.findMany({
      where: {
        installments: { gt: 1 },
        currentInstallment: { lt: prisma.expense.fields.installments },
      },
    })

    // Atualizar cada despesa
    for (const expense of parceledExpenses) {
      // Incrementar a parcela atual
      await prisma.expense.update({
        where: { id: expense.id },
        data: {
          currentInstallment: {
            increment: 1,
          },
        },
      })

      // Se tiver cartão, manter o gasto atualizado
      if (expense.bank && expense.cardLastFour) {
        await prisma.creditCard.update({
          where: {
            bank_lastFour: {
              bank: expense.bank,
              lastFour: expense.cardLastFour,
            },
          },
          data: {
            currentSpending: {
              increment: expense.installmentAmount,
            },
          },
        })
      }
    }

    return NextResponse.json({ message: "Parcelas atualizadas com sucesso" })
  } catch (error) {
    console.error("Erro ao atualizar parcelas:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar parcelas" },
      { status: 500 }
    )
  }
} 