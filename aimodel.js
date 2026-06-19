// Mock AI layer. Later this can call Gemini, Claude, OpenAI, or Enter Pro.

async function generateFix(ticket, memory) {
  console.log('\n[AI] Building fix suggestion from issue + memory')

  return new Promise((resolve) => {
    setTimeout(() => {
      const patch = `
Root cause:
The auth flow is probably failing because the JWT secret is hardcoded or missing in the runtime environment.

Fix plan:
1. Move the JWT secret into an environment variable.
2. Add a fallback check so the server fails clearly if JWT_SECRET is missing.
3. Restart the server after updating the .env file.

Suggested patch:
- const JWT_SECRET = "super_secret_key_123"
+ const JWT_SECRET = process.env.JWT_SECRET

Memory used:
${memory.context}

References:
${memory.citations.join(', ')}
`

      resolve(patch.trim())
    }, 1500)
  })
}

module.exports = { generateFix }