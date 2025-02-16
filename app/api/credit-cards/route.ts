import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { CreditCard } from "../types"

export async function GET() {
  try {
    const creditCards = await prisma.creditCard.findMany({
      orderBy: { createdAt: "desc" },
    })

    // Retorna um array vazio se não houver cartões, em vez de erro
    return NextResponse.json({ creditCards })
  } catch (error) {
    console.error("Error fetching credit cards:", error)
    // Retorna um array vazio em caso de erro, permitindo que a interface continue funcionando
    return NextResponse.json({ creditCards: [] })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const creditCard = await prisma.creditCard.create({
      data: {
        bank: body.bank,
        lastFour: body.lastFour,
        limit: body.limit,
        currentSpending: body.currentSpending || 0, // Valor padrão para gastos atuais
      },
    })

    return NextResponse.json(creditCard)
  } catch (error) {
    console.error("Error creating credit card:", error)
    return NextResponse.json(
      { error: "Erro ao criar cartão de crédito" },
      { status: 500 }
    )
  }
} 