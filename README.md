# Zero-Sync Debugger

Zero-Sync Debugger is a small debugging agent .

The idea is simple: when a bug report comes in, the agent checks previous debugging memory before suggesting a fix. Most coding agents start from zero every time, so this project uses Parcle as a memory layer for old fixes and decisions.


## Live Demo

- Enter Pro app: https://79b8ba9f20b649d0b07c4862024945ca.prod.enterapp.pro
- Demo video: https://youtu.be/vKtEUrgh5wM

The frontend is published with Enter Pro. The backend is deployed separately so Parcle and Gemini API keys can stay secure as environment variables.

## What It Does

- Takes a bug report from the dashboard.
- Searches Parcle memory for similar past debugging lessons.
- Sends the bug report and memory context to Gemini.
- Generates a root cause, fix plan, and suggested patch.
- Saves the new bug/fix lesson back into Parcle.
- Shows the full trace in the dashboard.

## Why This Matters

AI coding agents often forget past work. If the same kind of bug appears again, the agent may repeat the same investigation from scratch.

Zero-Sync Debugger keeps a memory loop:

```text
bug report -> memory search -> fix suggestion -> save new lesson
```

This makes the agent more useful over time because every solved bug becomes context for the next one.

## How It Works

The dashboard sends a bug report to the Express backend through the `/webhook` route.

The backend then runs this flow:

1. `searchMemory()` searches Parcle for previous debugging lessons related to the bug.
2. `generateFix()` sends the bug report and memory context to Gemini.
3. Gemini returns a root cause, fix plan, and suggested patch.
4. `saveMemory()` stores the new bug and generated fix back into Parcle.
5. The dashboard shows the full result step by step.

## Tech Stack

- Node.js
- Express
- Vanilla HTML, CSS, JavaScript
- Parcle Memory API
- Google Gemini API
- Enter Pro
- Render
- dotenv

## Why This Stack

- **Node.js + Express**: small backend server and webhook route.
- **Parcle Memory API**: persistent memory for previous fixes and new debugging lessons.
- **Gemini API**: generates the fix using the bug report plus memory context.
- **Enter Pro**: published frontend/share link for the hackathon demo.
- **Render**: hosts the backend securely with environment variables.
- **dotenv**: keeps local API keys outside the codebase.

## Project Structure

```text
zero-sync-debugger/
├── server.js
├── memory.js
├── aimodel.js
├── test.js
├── package.json
├── package-lock.json
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
└── .env
```

## File Overview

- `server.js`: main Express server and `/webhook` route.
- `memory.js`: Parcle search and save logic.
- `aimodel.js`: Gemini fix generation logic.
- `test.js`: sends a fake bug report to test the webhook.
- `public/index.html`: dashboard layout.
- `public/style.css`: dashboard styling.
- `public/app.js`: frontend logic that calls the backend.


## Run Locally

Install dependencies:

```bash
npm install
```

Start the server:

```bash
node server.js
```

Open:

```text
http://localhost:3000
```

Click **Run Agent** to test the flow.

## Test Webhook From Terminal

You can also test the backend without the dashboard:

```bash
node test.js
```

## Deployment

The project uses a split deployment:

```text
Enter Pro frontend -> Render backend -> Parcle + Gemini
```

- Enter Pro hosts the live dashboard.
- Render runs the Node.js/Express backend.
- Parcle and Gemini keys are stored only on the backend.

This keeps the frontend shareable while keeping API keys private.

## Sponsor Usage

### Parcle

Parcle is used as the persistent memory layer.

The backend searches Parcle for previous debugging lessons before generating a fix. After Gemini generates a new fix, the app saves the bug and fix back into Parcle so future runs can reuse that lesson.

### Enter Pro

Enter Pro is used to publish the live frontend/demo link for the project. The dashboard calls the deployed backend, which handles Parcle and Gemini securely.

### Gemini

Gemini is used as the reasoning layer. It receives the current bug report plus the Parcle memory context and generates a root cause, fix plan, and suggested patch.

## Demo Flow

Example bug:

```text
Dashboard blank after login
```

The agent:

1. Searches Parcle for previous dashboard/blank-page debugging lessons.
2. Retrieves relevant memory with confidence and citations.
3. Uses Gemini to generate a context-aware fix.
4. Saves the new debugging lesson back into Parcle.

A key demo moment is that after a bug is saved once, a similar bug later gets a stronger memory match. This shows the agent is learning from past fixes instead of starting from zero every time.

