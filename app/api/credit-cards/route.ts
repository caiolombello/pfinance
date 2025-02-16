import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { CreditCard } from "@prisma/client"

export async function GET() {
  try {
    const creditCards = await prisma.creditCard.findMany({
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json({ creditCards })
  } catch (error) {
    console.error("Erro ao buscar cartões:", error)
    return NextResponse.json(
      { error: "Erro ao buscar cartões" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data: Omit<CreditCard, "id" | "currentSpending" | "createdAt" | "updatedAt"> = await request.json()
    const creditCard = await prisma.creditCard.create({
      data: {
        ...data,
        currentSpending: 0
      }
    })
    return NextResponse.json(creditCard)
  } catch (error) {
    console.error("Erro ao criar cartão:", error)
    return NextResponse.json(
      { error: "Erro ao criar cartão" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    
    // Verificar se existem despesas associadas
    const hasExpenses = await prisma.expense.findFirst({
      where: {
        creditCard: {
          id: Number(id)
        }
      }
    })

    if (hasExpenses) {
      return NextResponse.json(
        { error: "Não é possível excluir um cartão com despesas associadas" },
        { status: 400 }
      )
    }

    await prisma.creditCard.delete({
      where: { id: Number(id) }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir cartão:", error)
    return NextResponse.json(
      { error: "Erro ao excluir cartão" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const id = Number(data.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      )
    }

    const existingCard = await prisma.creditCard.findUnique({
      where: { id }
    })

    console.log("existingCard", existingCard)

    if (!existingCard) {
      console.log(`Cartão não encontrado: ${id}`)
      return NextResponse.json(
        { error: "Cartão não encontrado" },
        { status: 404 }
      )
    }

    const updatedCard = await prisma.creditCard.update({
      where: { id },
      data: {
        bank: data.bank,
        lastFour: data.lastFour,
        limit: Number(data.limit)
      }
    })

    return NextResponse.json(updatedCard)
  } catch (error) {
    console.error("Erro ao atualizar cartão:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar cartão" },
      { status: 500 }
    )
  }
} 