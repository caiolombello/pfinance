"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { useTheme } from "next-themes"
import { formatCurrency } from "../lib/utils"
import { TooltipProps } from "recharts"

interface OverviewProps {
  data: Array<{
    month: string
    expenses: number
  }>
  totalExpenses: number
  expenseChange: number
  topCategory: {
    name: string
    amount: number
  }
  creditCards: Array<{
    bank: string
    lastFour: string
    limit: number
    currentSpending: number
  }>
}

export function Overview({ data }: OverviewProps) {
  const { theme } = useTheme()

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload || !payload.length || payload[0].value === undefined) {
      return null
    }

    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 shadow rounded">
        <p className="text-gray-900 dark:text-gray-100">{label}</p>
        <p className="text-gray-900 dark:text-gray-100">
          Total: {formatCurrency(payload[0].value)}
        </p>
      </div>
    )
  }

  return (
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis 
            dataKey="month" 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatCurrency}
          />
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
          <Tooltip 
            content={CustomTooltip}
            cursor={{ fill: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}
          />
          <Bar 
            dataKey="expenses" 
            fill={theme === "dark" ? "#82ca9d" : "#8884d8"} 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
  )
}

