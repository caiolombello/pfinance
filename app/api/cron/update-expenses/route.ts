import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Buscar todas as despesas parceladas que ainda não foram completamente pagas
    const installmentExpenses = await prisma.expense.findMany({
      where: {
        installments: {
          gt: 1
        },
        currentInstallment: {
          lt: prisma.expense.fields.installments
        }
      }
    })

    // Atualizar cada despesa
    for (const expense of installmentExpenses) {
      await prisma.expense.update({
        where: {
          id: expense.id
        },
        data: {
          currentInstallment: {
            increment: 1
          }
        }
      })
    }

    return NextResponse.json({ 
      message: "Despesas parceladas atualizadas com sucesso",
      updatedExpenses: installmentExpenses.length
    })
  } catch (error) {
    console.error("Erro ao atualizar despesas parceladas:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar despesas parceladas" },
      { status: 500 }
    )
  }
} 