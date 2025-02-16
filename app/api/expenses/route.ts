import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { date: "desc" }
    })
    return NextResponse.json({ expenses })
  } catch (error) {
    console.error("Erro ao buscar despesas:", error)
    return NextResponse.json(
      { error: "Erro ao buscar despesas" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Create the expense without cardId
    const expense = await prisma.expense.create({
      data: {
        description: data.description,
        amount: data.amount,
        installmentAmount: data.installmentAmount,
        date: new Date(data.date),
        bank: data.bank,
        cardLastFour: data.cardLastFour,
        category: data.category,
        installments: data.installments,
        currentInstallment: data.currentInstallment,
        installmentNumber: data.installmentNumber,
        type: data.type,
        createdAt: new Date(),
        updatedAt: new Date(),
        creditCard: data.creditCardId ? {
          connect: { id: data.creditCardId }
        } : undefined
      }
    })

    // If the expense is associated with a card, update the card's currentSpending
    if (data.bank && data.cardLastFour) {
      await prisma.creditCard.updateMany({
        where: {
          bank: data.bank,
          lastFour: data.cardLastFour
        },
        data: {
          currentSpending: {
            increment: data.amount
          }
        }
      })
    }

    return NextResponse.json(expense)
  } catch (error) {
    console.error("Erro ao criar despesa:", error)
    return NextResponse.json(
      { error: "Erro ao criar despesa" },
      { status: 500 }
    )
  }
}

// Adicionar rota DELETE para atualizar o currentSpending quando uma despesa for excluída
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    
    // Buscar a despesa antes de excluir para ter acesso aos dados do cartão
    const expense = await prisma.expense.findUnique({
      where: { id }
    })

    if (!expense) {
      return NextResponse.json(
        { error: "Despesa não encontrada" },
        { status: 404 }
      )
    }

    // Se a despesa estava em um cartão, atualizar o currentSpending
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
            decrement: expense.installmentAmount, // Decrementa o valor da parcela
          },
        },
      })
    }

    // Excluir a despesa
    await prisma.expense.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir despesa:", error)
    return NextResponse.json(
      { error: "Erro ao excluir despesa" },
      { status: 500 }
    )
  }
} 