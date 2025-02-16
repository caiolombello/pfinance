"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { useTheme } from "next-themes"
import type { Expense } from "@/app/types"

interface GastosPorCartaoProps {
  expenses: Expense[]
}

export function GastosPorCartao({ expenses }: GastosPorCartaoProps) {
  const { theme } = useTheme()

  const gastosPorCartao = expenses.reduce(
    (acc, expense) => {
      if (expense.bank && expense.cardLastFour) {
        const cartao = `${expense.bank} (${expense.cardLastFour})`
        acc[cartao] = (acc[cartao] || 0) + expense.amount
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const data = Object.entries(gastosPorCartao)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 shadow rounded">
          <p className="text-gray-900 dark:text-gray-100">{label}</p>
          <p className="text-gray-900 dark:text-gray-100">
            Total: R$ {payload[0].value.toFixed(2)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          type="number"
          tickFormatter={(value) => `R$${value}`}
        />
        <YAxis 
          dataKey="name" 
          type="category" 
          width={150}
        />
        <Tooltip 
          content={CustomTooltip}
          cursor={{ fill: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}
        />
        <Bar 
          dataKey="value" 
          fill={theme === "dark" ? "#82ca9d" : "#8884d8"}
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

