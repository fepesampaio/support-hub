-- Criar a tabela de chamados (tickets)
create table public.tickets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text not null,
  category text not null check (category in ('Técnico', 'Financeiro', 'Geral')),
  priority text not null check (priority in ('Baixa', 'Média', 'Alta')),
  status text not null default 'Aberto' check (status in ('Aberto', 'Em Atendimento', 'Resolvido')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ativar Row Level Security (RLS)
alter table public.tickets enable row level security;

-- Criar políticas de acesso (Row Level Security Policies)
create policy "Usuários podem visualizar seus próprios chamados"
  on public.tickets for select
  using (auth.uid() = user_id);

create policy "Usuários podem criar seus próprios chamados"
  on public.tickets for insert
  with check (auth.uid() = user_id);

create policy "Usuários podem atualizar seus próprios chamados"
  on public.tickets for update
  using (auth.uid() = user_id);

create policy "Usuários podem excluir seus próprios chamados"
  on public.tickets for delete
  using (auth.uid() = user_id);
