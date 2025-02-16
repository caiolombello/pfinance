import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, TooltipProps } from "recharts"
import { useTheme } from "next-themes"
import type { Expense } from "@/app/types"
import { useMemo } from "react"
import { formatCurrency } from "../lib/utils"

interface GastosMensaisProps {
  expenses: Expense[]
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length || payload[0].value === undefined) {
    return null
  }

  return (
    <div className="bg-background border rounded p-2 shadow-lg">
      <p className="font-semibold">{label}</p>
      <p className="text-sm">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  )
}

export function GastosMensais({ expenses }: GastosMensaisProps) {
  const { theme } = useTheme()

  const gastosPorMes = expenses.reduce(
    (acc, expense) => {
      const date = new Date(expense.date)
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`
      acc[monthYear] = (acc[monthYear] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const data = useMemo(() => {
    return Object.entries(gastosPorMes).map(([name, value]) => ({
      name,
      value,
    }))
  }, [gastosPorMes])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={formatCurrency} />
        <Tooltip 
          content={CustomTooltip}
          cursor={{ fill: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}
        />
        <Bar 
          dataKey="value" 
          fill={theme === "dark" ? "#82ca9d" : "#8884d8"}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

