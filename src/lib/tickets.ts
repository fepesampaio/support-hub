export const CATEGORIES = ["Técnico", "Financeiro", "Geral"] as const;
export const PRIORITIES = ["Baixa", "Média", "Alta"] as const;
export const STATUSES = ["Aberto", "Em Atendimento", "Resolvido"] as const;

export type Category = (typeof CATEGORIES)[number];
export type Priority = (typeof PRIORITIES)[number];
export type Status = (typeof STATUSES)[number];

export type Ticket = {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  status: Status;
  created_at: string;
};

export const priorityClass: Record<Priority, string> = {
  Baixa: "bg-muted text-muted-foreground",
  Média: "bg-warning/15 text-warning",
  Alta: "bg-destructive/15 text-destructive",
};

export const statusClass: Record<Status, string> = {
  Aberto: "bg-primary/12 text-primary",
  "Em Atendimento": "bg-warning/15 text-warning",
  Resolvido: "bg-success/15 text-success",
};

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
