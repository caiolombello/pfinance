import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest, context: unknown): Promise<NextResponse> {
  const { params } = context as { params: { id: string } }
  const { id } = params

  try {
    const data = await request.json()

    if (isNaN(Number(id))) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const existingCard = await prisma.creditCard.findUnique({
      where: { id: Number(id) }
    })

    if (!existingCard) {
      console.log(`Cartão não encontrado: ${id}`)
      return NextResponse.json({ error: "Cartão não encontrado" }, { status: 404 })
    }

    const updatedCard = await prisma.creditCard.update({
      where: { id: Number(id) },
      data: {
        bank: data.bank,
        lastFour: data.lastFour,
        limit: Number(data.limit),
        currentSpending: Number(data.currentSpending)
      }
    })

    return NextResponse.json(updatedCard)
  } catch (error) {
    console.error("Erro ao atualizar cartão:", error)
    return NextResponse.json({ error: "Erro ao atualizar cartão" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: unknown): Promise<NextResponse> {
  const { params } = context as { params: { id: string } }
  const { id } = params

  try {
    await prisma.creditCard.delete({
      where: { id: Number(id) }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir cartão:", error)
    return NextResponse.json({ error: "Erro ao excluir cartão" }, { status: 500 })
  }
}
