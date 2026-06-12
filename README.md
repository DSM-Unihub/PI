# Resist

O **Resist** é uma aplicação voltada para a **detecção automática de discurso de ódio**, unindo um proxy de interceptação de tráfego (**MITMProxy**) com **modelos de Processamento de Linguagem Natural (PLN)** para classificação de conteúdo tóxico/ofensivo em tempo real.

A ideia central é interceptar o tráfego de navegação do usuário, extrair o conteúdo textual das páginas acessadas e enviá-lo a um classificador de PLN. Quando o conteúdo é identificado como ofensivo, o sistema registra a ocorrência e pode bloquear automaticamente a visualização ao conteúdo ofensivo, tarjando as frases na tela do usuário. Toda essa atividade é organizada e exposta através de uma API, um painel web e um aplicativo mobile, permitindo o acompanhamento de estatísticas, histórico de acessos e gerenciamento de usuários/bloqueios.

O sistema é composto por 4 módulos:

- **Resist-API-atualizado** — API REST (Node/Express + MongoDB), responsável por usuários, autenticação e listas de bloqueio
- **Resist-Web** — painel web (Next.js) para visualização de estatísticas, histórico e gerenciamento
- **Resist-Mobile-App** — aplicativo mobile (React Native / Expo) para acesso ao sistema
- **Resist-Modulos-Proxy** — proxy de interceptação (mitmproxy) + IA de classificação de discurso de ódio (Flask + PLN)

---

## Como executar o ambiente do sistema localmente

A seguir, o passo a passo para rodar cada módulo na sua máquina.

---

## ⚠️ Sobre os arquivos `.env`

**NUNCA** suba arquivos `.env` reais para o repositório (eles contêm segredos: `JWT_SECRET`, `API_SECRET_KEY`, senhas, chaves de criptografia, etc).

- Cada módulo possui um `.env.example` — copie-o para `.env` e preencha com seus próprios valores locais.
- Confirme que `.env` está listado no `.gitignore` de cada módulo (no `Resist-API-atualizado` atualmente existe um `.env` versionado — **remova-o do controle de versão** e gere novos segredos antes de tornar o repositório público).
- Nunca compartilhe `JWT_SECRET`, `API_SECRET_KEY`, `FILE_ENC_KEY`, `FILENAME_HMAC_SECRET` ou credenciais de e-mail/senha do sistema.

---

## 1. Resist-API-atualizado (Backend)

Requisitos: Node.js + MongoDB rodando localmente (ou Atlas).

```bash
cd Resist-API-atualizado
npm install
cp .env.example .env   # edite os valores
npm start
```

API sobe por padrão em `http://localhost:4000`.

### Variáveis de ambiente (`.env`)

| Variável | Descrição |
|---|---|
| `JWT_SECRET` | chave usada para assinar tokens JWT — gere uma própria, não use o valor de exemplo |
| `BLOQUEADOS_PATH` / `BLOQUEADOS_TOTAL_PATH` | caminhos para os arquivos de listas de bloqueio (default em `./data/`) |
| `mongoDBURI` | string de conexão do MongoDB, ex: `mongodb://localhost:27017/PI` |

---

## 2. Resist-Web (Painel Web)

Requisitos: Node.js. A API precisa estar rodando antes (ou apontar para uma API remota).

```bash
cd Resist-Web
npm install
cp .env.example .env.local   # edite NEXT_PUBLIC_API_URL
npm run dev
```

Acesse em `http://localhost:3000`.

### Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL base da API, ex: `http://localhost:4000/api` |

---

## 3. Resist-Mobile-App (App Mobile)

Requisitos: Node.js, Expo Go instalado no celular (Android/iOS).

```bash
cd Resist-Mobile-App
npm install
npx expo start
```

- Escaneie o QR Code exibido no terminal com o app **Expo Go**.
- Seu celular e o computador precisam estar na **mesma rede Wi-Fi**.

### Configurando a URL da API

O app não usa `.env` — a URL da API é definida diretamente em `services/url.js`:

```js
export const ipurl = "http://192.168.0.105:4000/api";
export const publicurl = "http://192.168.0.105:4000/public";
```

Troque `192.168.0.105` pelo **IP local da sua máquina** na rede (não use `localhost`, pois o celular é um dispositivo separado). Para descobrir seu IP:

- Windows: `ipconfig` (procure por "Endereço IPv4")
- Linux/Mac: `ifconfig` ou `ip a`

---

## 4. Resist-Modulos-Proxy (Proxy + IA de Classificação)

Requisitos: Python 3, mitmproxy, Flask, MongoDB.

```bash
cd Resist-Modulos-Proxy
pip install -r requirements.txt   # se não existir, instale manualmente: mitmproxy flask pymongo requests python-dotenv transformers
cp .env.example .env   # edite todos os valores (veja abaixo)
```

Este módulo precisa de **3 processos rodando em paralelo**:

```bash
# 1. Processador de IA (classificação de toxicidade)
python iaapi.py

# 2. Processador de logs
python main.py

# 3. Proxy mitm (intercepta o tráfego)
mitmdump -s log_flows_windows.py
```

### Configurando o proxy no dispositivo

1. Após iniciar o `mitmdump`, configure o proxy HTTP/HTTPS do seu computador ou celular para apontar para o IP/porta onde o mitmproxy está rodando (padrão: porta `8080`).
2. Acesse `http://mitm.it` pelo navegador do dispositivo configurado e **baixe/instale o certificado mitmproxy** (necessário para inspecionar tráfego HTTPS).
3. Com os 3 processos rodando, o sistema passa a identificar e bloquear automaticamente conteúdo ofensivo.

### Variáveis de ambiente (`.env`)

| Variável | Descrição |
|---|---|
| `HTML_DUMPS_DIR` | pasta onde os dumps HTML são salvos |
| `ARM_FILE_PATH` | caminho do arquivo `arm.txt` |
| `API_URL` | URL da API (ex: `http://localhost:4000/api`) |
| `SYSTEM_EMAIL` / `SYSTEM_PASSWORD` | credenciais de um usuário do sistema usadas pelo módulo para se autenticar na API |
| `BLOCKLIST_REFRESH_SEC` | intervalo (segundos) para recarregar a lista de bloqueio |
| `API_SECRET_KEY` | chave secreta compartilhada entre `main.py`/`log_flows_windows.py` e `iaapi.py` — **gere uma própria** |
| `FILE_ENC_KEY` | chave de 32 bytes (64 caracteres hex) para criptografar os dumps HTML |
| `FILENAME_HMAC_SECRET` | segredo HMAC para nomes de arquivo |
| `MONGODB_URI` | string de conexão MongoDB |

> ⚠️ Os caminhos de exemplo (`C:\Users\bruno\...`) são específicos do ambiente original — ajuste para o seu sistema (Windows/Linux/Mac).

---

## Ordem recomendada de inicialização

1. MongoDB (local ou Atlas)
2. `Resist-API-atualizado` (`npm start`)
3. `Resist-Web` (`npm run dev`) e/ou `Resist-Mobile-App` (`npx expo start`)
4. `Resist-Modulos-Proxy`: `iaapi.py` + `main.py` + `mitmdump`
