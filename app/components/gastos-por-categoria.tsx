import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, TooltipProps, Legend } from "recharts"
import { useTheme } from "next-themes"
import type { Expense } from "@/app/types"
import { formatCurrency } from "../lib/utils"

interface GastosPorCategoriaProps {
  expenses: Expense[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1']

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length || payload[0].value === undefined) {
    return null
  }

  const data = payload[0]
  const value = data.value as number
  const percent = data.payload.percent as number

  return (
    <div className="bg-background border rounded p-2 shadow-lg">
      <p className="font-semibold">{data.name}</p>
      <p className="text-sm">
        {formatCurrency(value)}
      </p>
      <p className="text-xs text-muted-foreground">
        {percent.toFixed(1)}% do total
      </p>
    </div>
  )
}

export function GastosPorCategoria({ expenses }: GastosPorCategoriaProps) {
  const { theme } = useTheme()

  const gastosPorCategoria = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>
  )

  const total = Object.values(gastosPorCategoria).reduce((sum, value) => sum + value, 0)

  const data = Object.entries(gastosPorCategoria)
    .map(([name, value]) => ({
      name,
      value,
      percent: (value / total) * 100
    }))
    .sort((a, b) => b.value - a.value)

  if (data.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        Nenhum gasto registrado
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill={theme === "dark" ? "#82ca9d" : "#8884d8"}
          label={({ name, percent }) => `${name} (${percent.toFixed(1)}%)`}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={CustomTooltip} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

