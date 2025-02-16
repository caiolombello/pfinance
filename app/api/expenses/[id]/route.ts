import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import type { Expense } from "@/app/types"

export async function PUT(request: NextRequest, context: unknown): Promise<NextResponse> {
  const { params } = context as { params: { id: string | string[] } }
  const idParam = Array.isArray(params.id) ? params.id[0] : params.id
  const expenseId = parseInt(idParam)
  if (isNaN(expenseId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 })
  }
  try {
    const data: Partial<Omit<Expense, "id">> = await request.json()
    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId },
      data,
    })
    return NextResponse.json(updatedExpense)
  } catch (error) {
    console.error("Erro ao atualizar despesa:", error)
    return NextResponse.json({ error: "Erro ao atualizar despesa" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: unknown): Promise<NextResponse> {
  const { params } = context as { params: { id: string | string[] } }
  const idParam = Array.isArray(params.id) ? params.id[0] : params.id
  const expenseId = parseInt(idParam)
  if (isNaN(expenseId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 })
  }
  try {
    await prisma.expense.delete({ where: { id: expenseId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting expense:", error)
    return NextResponse.json({ error: "Error deleting expense" }, { status: 500 })
  }
}
