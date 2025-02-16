import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const expense = await prisma.expense.update({
      where: { id: parseInt(params.id) },
      data: {
        description: body.description,
        amount: body.amount,
        date: new Date(body.date),
        bank: body.bank,
        cardLastFour: body.cardLastFour,
        category: body.category,
      },
    })

    return NextResponse.json(expense)
  } catch (error) {
    console.error("Error updating expense:", error)
    return NextResponse.json({ error: "Error updating expense" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.expense.delete({
      where: { id: parseInt(params.id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting expense:", error)
    return NextResponse.json({ error: "Error deleting expense" }, { status: 500 })
  }
} 