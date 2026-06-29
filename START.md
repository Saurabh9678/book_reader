# How to Start Book Companion AI

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- An Azure OpenAI resource with a deployed model (e.g. gpt-4)

---

## Step 1 — Clone the repo

```bash
git clone https://github.com/saurabh9678/book_reader.git
cd book_reader
```

---

## Step 2 — Create your `.env` file

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
POSTGRES_USER=bookuser
POSTGRES_PASSWORD=bookpassword

AZURE_OPENAI_API_KEY=your-azure-openai-key
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_OPENAI_API_VERSION=2024-02-01
```

**Where to find the Azure values:**

| Variable | Where to find it |
|----------|-----------------|
| `AZURE_OPENAI_API_KEY` | Azure Portal → your OpenAI resource → **Keys and Endpoint** |
| `AZURE_OPENAI_ENDPOINT` | Azure Portal → your OpenAI resource → **Keys and Endpoint** |
| `AZURE_OPENAI_DEPLOYMENT_NAME` | Azure Portal → your OpenAI resource → **Model deployments** |
| `AZURE_OPENAI_API_VERSION` | Keep as `2024-02-01` unless you know otherwise |

The Postgres credentials are local — set them to anything you like.

---

## Step 3 — Start the app

```bash
docker compose up --build
```

This will:
1. Start a PostgreSQL database and create all tables automatically
2. Start the Node.js backend on port 4000
3. Start the Python AI service on port 8000
4. Start the Next.js frontend on port 3000

First run takes a few minutes to download and build all images.

---

## Step 4 — Open the app

```
http://localhost:3000
```

Upload any PDF book (up to 100MB) and start reading.

---

## Stopping the app

```bash
docker compose down
```

To also delete the database and uploaded files:

```bash
docker compose down -v
```

---

## Troubleshooting

**Port already in use**

Stop whatever is running on ports 3000, 4000, 5432, or 8000, then try again.

**Upload fails**

Check that the AI service is healthy:
```bash
docker compose logs ai_service
```

Make sure your Azure OpenAI key and endpoint are correct in `.env`.

**Database connection error**

Wait a few seconds and retry — PostgreSQL can take a moment to initialize on first start.

**Summaries never appear**

Chapter summaries are generated in the background after upload. If they never appear, check:
```bash
docker compose logs ai_service
```
