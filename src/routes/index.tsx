import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Headset, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Entrar — Central de Chamados HelpDesk — Sistema de Suporte" },
      {
        name: "description",
        content:
          "Faça login na Central de Chamados para abrir, acompanhar e resolver chamados de suporte técnico, financeiro e geral.",
      },
      { property: "og:title", content: "Entrar — Central de Chamados HelpDesk — Sistema de Suporte" },
      {
        property: "og:description",
        content:
          "Faça login na Central de Chamados para abrir, acompanhar e resolver chamados de suporte técnico, financeiro e geral.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user, ready, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && user) navigate({ to: "/dashboard", replace: true });
  }, [ready, user, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.includes("@")) return setError("Informe um e-mail válido.");
    if (password.length < 6) return setError("A senha deve ter ao menos 6 caracteres.");
    setLoading(true);
    try {
      if (mode === "login") await signIn(email, password);
      else await signUp(email, password);
      navigate({ to: "/dashboard", replace: true });
    } catch (err: any) {
      console.error("Erro na autenticação:", err);
      setError(err?.message || "Não foi possível continuar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden">Reverta a última modificação.</div>
      <section className="hidden flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Headset className="h-6 w-6" />
          HelpDesk
        </div>
        <div className="max-w-md space-y-4">
          <h2 className="text-4xl font-semibold leading-tight">
            Suporte organizado, do primeiro contato à resolução.
          </h2>
          <p className="text-primary-foreground/75">
            Centralize chamados técnicos, financeiros e gerais em um único painel, com prioridades
            e status sempre visíveis para a sua equipe.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/60">Central de Chamados · 2026</p>
      </section>

      <section className="relative flex items-center justify-center px-6 py-16">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 text-primary lg:hidden">
            <Headset className="h-6 w-6" />
            <span className="text-lg font-semibold">HelpDesk</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "login" ? "Entrar na sua conta" : "Criar uma conta"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login"
              ? "Use seu e-mail corporativo para acessar os chamados."
              : "Cadastre-se para abrir e acompanhar chamados."}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="voce@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={72}
                required
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "login" ? "Entrar" : "Criar conta"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? "Ainda não tem conta?" : "Já possui uma conta?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError(null);
              }}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {mode === "login" ? "Criar conta" : "Entrar"}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
