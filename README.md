# 🔗 Encurtador de Links

## 📄 Descrição

Este projeto é um **encurtador de URLs completo**, construído com foco em desempenho, escalabilidade e facilidade de implantação. A aplicação permite criar links curtos, redirecioná-los de forma dinâmica e registrar métricas úteis de acesso — tudo isso orquestrado com **Docker**, usando o **Traefik** como _reverse proxy_ inteligente.

---

## 🎯 Funcionalidades

- ✂️ Encurtamento de links com geração automática de `short_codes`
- 🚀 Redirecionamento dinâmico baseado na URL encurtada
- 📊 Registro de métricas: IP, user-agent, origem, país, data e hora
- ⚙️ Gerenciamento de links com histórico
- 🌐 Identificação automática do domínio e roteamento via **Traefik**
- 🐳 Ambientes totalmente containerizados com **Docker Compose**

---

## 🧱 Arquitetura

- Roteamento automatizado por domínio com **Traefik**
- Redirecionamento por padrão (`example.com/abc123` → URL original)
- Back-end modular com validação robusta via **Zod**
- Banco de dados relacional com **PostgreSQL** e acesso via **Drizzle ORM**

---

## 🛠️ Tecnologias Utilizadas

| Camada         | Ferramenta                                  |
| -------------- | ------------------------------------------- |
| Back-end       | **Node.js**, **Fastify**                    |
| Banco de dados | **PostgreSQL** com **Drizzle ORM**          |
| Validação      | **Zod**                                     |
| DevOps         | **Docker**, **Docker Compose**, **Traefik** |
| Linguagem      | **TypeScript**                              |

---

## 📦 Objetivo do Projeto

Criar uma solução moderna de encurtamento de URLs que:

- 🔧 Possa ser facilmente implantada com Docker
- 🧩 Use Traefik para resolver rotas com base no domínio e `short_code`
- 🧠 Reforce boas práticas como separação de responsabilidades, tipagem segura e estrutura clean

---