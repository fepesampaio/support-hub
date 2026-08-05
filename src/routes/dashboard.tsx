import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Headset, Inbox, LogOut, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import {
  CATEGORIES,
  PRIORITIES,
  formatDate,
  priorityClass,
  statusClass,
  type Category,
  type Priority,
  type Ticket,
} from "@/lib/tickets";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Meus chamados — Central de Chamados HelpDesk" },
      {
        name: "description",
        content:
          "Painel para abrir chamados, acompanhar prioridade e status, resolver e excluir solicitações de suporte.",
      },
      { property: "og:title", content: "Meus chamados — Central de Chamados HelpDesk" },
      {
        property: "og:description",
        content: "Acompanhe prioridade, status e histórico de todos os seus chamados de suporte.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, ready, signOut } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (ready && !user) navigate({ to: "/", replace: true });
  }, [ready, user, navigate]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Carregando…
      </div>
    );
  }

  const openCount = tickets.filter((t) => t.status !== "Resolvido").length;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 font-semibold text-primary">
            <Headset className="h-5 w-5" />
            <span>HelpDesk</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await signOut();
                navigate({ to: "/", replace: true });
              }}
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Meus chamados</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {tickets.length === 0
                ? "Nenhum chamado registrado até o momento."
                : `${tickets.length} chamado(s) · ${openCount} em aberto`}
            </p>
          </div>
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" />
            Novo Chamado
          </Button>
        </div>

        <section className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
          {tickets.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-20 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                <Inbox className="h-6 w-6" />
              </div>
              <h2 className="text-base font-medium">Você ainda não abriu chamados</h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                Clique em “Novo Chamado” para registrar sua primeira solicitação de suporte.
              </p>
              <Button variant="outline" onClick={() => setOpen(true)}>
                <Plus className="h-4 w-4" />
                Novo Chamado
              </Button>
            </div>
          ) : (
            <>
              <table className="hidden w-full text-sm md:table">
                <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Título</th>
                    <th className="px-4 py-3 font-medium">Categoria</th>
                    <th className="px-4 py-3 font-medium">Prioridade</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Criado em</th>
                    <th className="px-4 py-3 text-right font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr key={t.id} className="border-t border-border">
                      <td className="px-4 py-3">
                        <div className="font-medium">{t.title}</div>
                        <div className="line-clamp-1 text-xs text-muted-foreground">
                          {t.description}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{t.category}</td>
                      <td className="px-4 py-3">
                        <Pill className={priorityClass[t.priority]}>{t.priority}</Pill>
                      </td>
                      <td className="px-4 py-3">
                        <Pill className={statusClass[t.status]}>{t.status}</Pill>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(t.created_at)}</td>
                      <td className="px-4 py-3">
                        <TicketActions
                          ticket={t}
                          onResolve={() => resolve(t.id, setTickets)}
                          onDelete={() => remove(t.id, setTickets)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <ul className="divide-y divide-border md:hidden">
                {tickets.map((t) => (
                  <li key={t.id} className="space-y-3 p-4">
                    <div>
                      <p className="font-medium">{t.title}</p>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{t.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Pill className="bg-secondary text-secondary-foreground">{t.category}</Pill>
                      <Pill className={priorityClass[t.priority]}>{t.priority}</Pill>
                      <Pill className={statusClass[t.status]}>{t.status}</Pill>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(t.created_at)}
                      </span>
                      <TicketActions
                        ticket={t}
                        onResolve={() => resolve(t.id, setTickets)}
                        onDelete={() => remove(t.id, setTickets)}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </main>

      <NewTicketDialog
        open={open}
        onOpenChange={setOpen}
        onCreate={(ticket) => setTickets((prev) => [ticket, ...prev])}
      />
    </div>
  );
}

function resolve(id: string, set: React.Dispatch<React.SetStateAction<Ticket[]>>) {
  set((prev) => prev.map((t) => (t.id === id ? { ...t, status: "Resolvido" } : t)));
}

function remove(id: string, set: React.Dispatch<React.SetStateAction<Ticket[]>>) {
  set((prev) => prev.filter((t) => t.id !== id));
}

function Pill({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className ?? ""}`}
    >
      {children}
    </span>
  );
}

function TicketActions({
  ticket,
  onResolve,
  onDelete,
}: {
  ticket: Ticket;
  onResolve: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={onResolve}
        disabled={ticket.status === "Resolvido"}
        aria-label={`Marcar ${ticket.title} como resolvido`}
      >
        <CheckCircle2 className="h-4 w-4" />
        <span className="hidden sm:inline">Resolver</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="text-destructive hover:text-destructive"
        aria-label={`Excluir ${ticket.title}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

function NewTicketDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (t: Ticket) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("Técnico");
  const [priority, setPriority] = useState<Priority>("Média");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Preencha título e descrição.");
      return;
    }
    onCreate({
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status: "Aberto",
      created_at: new Date().toISOString(),
    });
    setTitle("");
    setDescription("");
    setCategory("Técnico");
    setPriority("Média");
    setError(null);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo chamado</DialogTitle>
          <DialogDescription>
            Descreva sua solicitação para que o time de suporte possa atender.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              placeholder="Ex.: Notebook não liga"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              rows={4}
              placeholder="Explique o que aconteceu e desde quando."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Criar chamado</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
