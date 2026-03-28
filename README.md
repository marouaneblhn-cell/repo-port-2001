# MRB2001 Portfolio — Deployment Guide

## Project Structure

```
mrb2001-portfolio/
├── index.html          ← Your portfolio (static)
├── api/
│   └── chat.js         ← Serverless proxy (keeps API key secure)
├── vercel.json         ← Vercel routing config
├── .env.example        ← Template for environment variables
├── .env.local          ← YOUR secrets (never commit this!)
└── .gitignore
```

---

## 1. Get Your Anthropic API Key

1. Go to https://console.anthropic.com/
2. Create an account or log in
3. Navigate to **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`)

---

## 2. Set Up Locally

```bash
# Clone / enter your project folder
cd mrb2001-portfolio

# Create your local env file
cp .env.example .env.local

# Edit .env.local and paste your key:
# ANTHROPIC_API_KEY=sk-ant-your-key-here
```

---

## 3. Install Vercel CLI & Deploy

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login
vercel login

# Deploy (from inside the project folder)
vercel

# Follow the prompts:
#   Set up and deploy? → Y
#   Which scope? → your username
#   Link to existing project? → N
#   Project name? → mrb2001-portfolio
#   Directory? → ./  (just press Enter)
```

---

## 4. Add Your API Key to Vercel

```bash
# Add the secret environment variable
vercel env add ANTHROPIC_API_KEY

# Paste your key when prompted
# Select: Production + Preview + Development
```

Or via the Vercel Dashboard:
1. Go to your project → **Settings** → **Environment Variables**
2. Add: `ANTHROPIC_API_KEY` = `sk-ant-your-key-here`
3. Scope: Production ✓ Preview ✓ Development ✓

---

## 5. Deploy to Production

```bash
vercel --prod
```

Your site will be live at: `https://mrb2001-portfolio.vercel.app`

---

## 6. Custom Domain (Optional)

```bash
vercel domains add yourdomain.com
```

Or set it in the Vercel Dashboard under **Domains**.

---

## How the Secure Proxy Works

```
Browser (visitor)
    │
    │  POST /api/chat  { message, history }
    ▼
Vercel Serverless Function (api/chat.js)
    │  — API key read from environment variable (NEVER sent to browser)
    │
    │  POST https://api.anthropic.com/v1/messages
    ▼
Claude AI (Anthropic)
    │
    │  { reply: "..." }
    ▼
Browser (visitor sees response)
```

The `ANTHROPIC_API_KEY` never leaves the server. Visitors cannot access it.

---

## Security Features

- API key stored as Vercel environment variable (server-side only)
- Message length capped at 1000 characters
- Conversation history capped at last 10 messages
- POST-only endpoint (GET/PUT/DELETE return 405)
- Input validation before forwarding to Anthropic

---

## Local Development

```bash
# Install Vercel dev server
npm install -g vercel

# Run locally (reads from .env.local automatically)
vercel dev
```

Visit `http://localhost:3000` — the chatbot will work with your local API key.
