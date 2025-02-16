import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const goals = await prisma.financialGoal.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ goals })
  } catch (error) {
    console.error("Error fetching goals:", error)
    return NextResponse.json(
      { error: "Erro ao buscar metas" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const goal = await prisma.financialGoal.create({
      data: {
        name: data.name,
        targetAmount: data.targetAmount,
        currentAmount: data.currentAmount,
        deadline: new Date(data.deadline),
        category: data.category,
      },
    })
    return NextResponse.json(goal)
  } catch (error) {
    console.error("Error creating goal:", error)
    return NextResponse.json(
      { error: "Erro ao criar meta" },
      { status: 500 }
    )
  }
} 