const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ quiet: true });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateFix(ticket, memory) {
  console.log('\n[AI] Building fix suggestion with Gemini');

  if (!process.env.GEMINI_API_KEY) {
    return `Root cause:
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
            ${memory.citations.join(', ')}`
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash'
    })

    const prompt = `
    You are helping with a quackathon project called Zero-Sync Debugger.

    A bug report came in and the agent already checked memory for similar past fixes.
    Use the bug report and memory context to suggest a practical fix.

    Bug title:
    ${ticket.title || 'Unknown issue'}

    Bug description:
    ${ticket.description || 'No description provided'}

    Memory context:
    ${memory.context || 'No memory found'}

    Memory citations:
    ${memory.citations?.join(', ') || 'No citations'}

    Return the answer in this exact format:

    Root cause:
    [short explanation]

    Fix plan:
    1. [first step]
    2. [second step]
    3. [third step]

    Suggested patch:
    [small code patch or config change]

    Memory used:
  [briefly mention which memory helped]
`

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text().trim();
  } catch (error) {
    console.error('[AI] Gemini failed:', error.message);

    return `Root cause:
The AI service failed, so this is a fallback fix based on memory.

Fix plan:
1. Check whether JWT_SECRET is present in the environment.
2. Replace hardcoded secrets with process.env.JWT_SECRET.
3. Restart the server after updating .env.

Suggested patch:
- const JWT_SECRET = "super_secret_key_123"
+ const JWT_SECRET = process.env.JWT_SECRET

Memory used:
${memory.context}`
  }
}

module.exports = { generateFix }