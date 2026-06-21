# Zero-Sync Debugger

Zero-Sync Debugger is a small debugging agent.

The idea is simple: when a bug report comes in, the agent checks previous debugging memory before suggesting a fix. Most coding agents start from zero every time, so this project uses Parcle as a memory layer for old fixes and decisions.


## What It Does

- Takes a bug report from the dashboard.
- Searches Parcle memory for similar past debugging lessons.
- Sends the bug report and memory context to Gemini.
- Generates a root cause, fix plan, and suggested patch.
- Saves the new bug/fix lesson back into Parcle.
- Shows the full trace in a simple dashboard.

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
- dotenv

## Why This Stack

- **Node.js + Express**: small backend server and webhook route.
- **Parcle Memory API**: persistent memory for previous fixes and new debugging lessons.
- **Gemini API**: generates the fix using the bug report plus memory context.
- **Vanilla HTML/CSS/JS**: simple dashboard frontend setup.
- **dotenv**: keeps API keys outside the codebase.

## Project Structure

```text
zero-sync-debugger/
├── server.js
├── memory.js
├── aimodel.js
├── test.js
├── package.json
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

## Sponsor Usage

### Parcle

Parcle is used as the persistent memory layer.

The app searches Parcle for previous debugging lessons before generating a fix, then saves the final bug/fix result back into Parcle so future runs can reuse it.

### Enter Pro

Enter Pro is part of the track setup and is the intended build/deployment environment for the project demo.

## Demo Flow

Example bug:

```text
Authentication throwing 500 error
```

The agent:

1. Searches Parcle for previous auth/JWT debugging lessons.
2. Uses Gemini to generate a fix.
3. Suggests replacing a hardcoded JWT secret with `process.env.JWT_SECRET`.
4. Saves the new debugging lesson back into Parcle.

