import type { Expense } from "../types"

// Sistema de categorização expandido com mais palavras-chave
const categoryKeywords: Record<string, string[]> = {
  Alimentação: [
    "restaurante", "supermercado", "lanchonete", "café", "ifood", "rappi", 
    "padaria", "mercado", "açougue", "food", "burger", "pizza"
  ],
  Transporte: [
    "uber", "taxi", "ônibus", "metrô", "combustível", "99", "cabify", 
    "posto", "estacionamento", "pedágio", "passagem"
  ],
  Moradia: [
    "aluguel", "condomínio", "luz", "água", "gás", "internet", "iptu", 
    "manutenção", "reforma", "móveis"
  ],
  Saúde: [
    "farmácia", "hospital", "médico", "dentista", "plano de saúde", 
    "academia", "psicólogo", "exames"
  ],
  Entretenimento: [
    "cinema", "teatro", "show", "streaming", "netflix", "spotify", "amazon", 
    "disney", "hbo", "jogos", "game", "steam", "playstation"
  ],
  Educação: [
    "escola", "faculdade", "curso", "livro", "udemy", "alura", 
    "coursera", "material escolar"
  ],
  Serviços: [
    "assinatura", "mensalidade", "serviço", "manutenção", 
    "limpeza", "lavanderia"
  ],
  Compras: [
    "shopping", "loja", "roupa", "calçado", "acessório", "eletrônico",
    "amazon", "mercadolivre", "magazine", "americanas"
  ]
}

export function categorizarDespesa(despesa: Omit<Expense, "id" | "category">): string {
  const descricaoLowerCase = despesa.description.toLowerCase()

  // Primeiro tenta categorizar pela descrição
  for (const [categoria, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => descricaoLowerCase.includes(keyword.toLowerCase()))) {
      return categoria
    }
  }

  return "Outros"
}

