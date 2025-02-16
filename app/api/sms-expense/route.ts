import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { categorizarDespesa } from "@/app/services/expense-categorization"

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Você é um assistente especializado em extrair informações de mensagens SMS de cartão de crédito.
            Retorne um JSON com os campos:
            - banco: string (BRADESCO, ITAU, SANTANDER, NUBANK ou INTER)
            - cardLastFour: string (4 dígitos)
            - date: string (YYYY-MM-DD)
            - time: string (HH:mm)
            - amount: number (positivo)
            - establishment: string
            - installments: number (mínimo 1)
            - category: string (alimentação, transporte, moradia, saúde, entretenimento, educação, serviços, outros)`
          },
          {
            role: "user",
            content: message
          }
        ],
        response_format: { type: "json_object" }
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const completion = await response.json()
    const content = completion.choices[0].message.content
    if (!content) throw new Error("Resposta vazia do GPT")
    
    console.log("Resposta da IA:", content)
    
    const parsedData = JSON.parse(content)

    // Categorizar a despesa
    const category = categorizarDespesa({
      description: parsedData.establishment,
      amount: parsedData.amount,
      installmentAmount: parsedData.amount / (parsedData.installments || 1),
      date: parsedData.date,
      bank: parsedData.banco,
      cardLastFour: parsedData.cardLastFour,
      installments: parsedData.installments || 1,
      currentInstallment: 1,
      installmentNumber: null,
      type: "CREDIT_CARD",
      createdAt: new Date(),
      updatedAt: new Date(),
      creditCardId: null
    })

    // Criar a despesa no banco de dados
    const expense = await prisma.expense.create({
      data: {
        description: parsedData.establishment,
        amount: parsedData.amount,
        installmentAmount: parsedData.amount / (parsedData.installments || 1),
        date: new Date(`${parsedData.date}T${parsedData.time}`),
        category,
        bank: parsedData.banco,
        cardLastFour: parsedData.cardLastFour,
        installments: parsedData.installments || 1,
        installmentNumber: parsedData.installments > 1 ? 1 : null
      }
    })

    // Se houver parcelas, criar as despesas futuras
    if (parsedData.installments > 1) {
      const installmentAmount = parsedData.amount / parsedData.installments
      
      for (let i = 1; i < parsedData.installments; i++) {
        const installmentDate = new Date(`${parsedData.date}T${parsedData.time}`)
        installmentDate.setMonth(installmentDate.getMonth() + i)

        await prisma.expense.create({
          data: {
            description: `${parsedData.establishment} (${i + 1}/${parsedData.installments})`,
            amount: installmentAmount,
            date: installmentDate,
            category,
            bank: parsedData.banco,
            cardLastFour: parsedData.cardLastFour,
            installments: parsedData.installments,
            installmentNumber: i + 1,
          }
        })
      }

      // Atualizar a primeira parcela com o número da parcela
      await prisma.expense.update({
        where: { id: expense.id },
        data: {
          description: `${parsedData.establishment} (1/${parsedData.installments})`,
          installmentNumber: 1
        }
      })
    }

    // Atualizar o gasto atual do cartão
    await prisma.creditCard.updateMany({
      where: {
        bank: parsedData.banco,
        lastFour: parsedData.cardLastFour
      },
      data: {
        currentSpending: {
          increment: parsedData.amount
        }
      }
    })

    return NextResponse.json({
      success: true,
      expense,
      parsedData
    })

  } catch (error) {
    console.error("Error processing SMS:", error)
    return NextResponse.json(
      { error: "Erro ao processar SMS" },
      { status: 500 }
    )
  }
} 