// Mock memory layer for now. Later we will replace this with real Parcle API calls.

//search Memory for past fixes related to the issue title
async function searchMemory(issueTitle) {
  console.log(`\n[Memory] Searching past fixes for: "${issueTitle}"`)

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        confidence: 0.95,
        context:
          'We had a similar auth 500 error before. The fix was to read the JWT secret from process.env instead of hardcoding it.',
        citations: ['ticket-88', 'commit-a1b2c3']
      })
    }, 1500)
  })
}

// save new memory lession for future reference
async function saveMemory(ticket, fix) {
  console.log('\n[Memory] Saving new debugging lesson to Parcle')

  const apiKey = process.env.PARCLE_API_KEY
  const userId = process.env.PARCLE_USER_ID || 'zero-sync-debugger'

  if (!apiKey) {
    return {
      saved: true,
      memoryId: `mock-memory-${Date.now()}`,
      summary: `Saved debugging lesson locally for: ${ticket.title}`
    }
  }

  try {
    const userResponse = await fetch('https://api.parcle.ai/v1/users', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: userId,
        name: 'Zero-Sync Debugger',
        timezone: 'Asia/Kolkata'
      })
    })

    if (!userResponse.ok) {
      const errorText = await userResponse.text()
      throw new Error(`Parcle user setup failed ${userResponse.status}: ${errorText}`)
    }

    const response = await fetch('https://api.parcle.ai/v1/memories/ingest_dialog', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: userId,
        messages: [
          {
            role: 'user',
            content: `Bug: ${ticket.title}\nDescription: ${ticket.description}`
          },
          {
            role: 'assistant',
            content: `Generated fix:\n${fix}`
          }
        ],
        tag: {
          app: 'zero-sync-debugger',
          type: 'bug_fix'
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Parcle save failed ${response.status}: ${errorText}`)
    }

    const data = await response.json()

    return {
      saved: true,
      memoryId: data.event_id || data.session_id || 'parcle-memory',
      summary: `Saved debugging lesson to Parcle for: ${ticket.title}`
    }
  } catch (error) {
    console.error('[Memory] Parcle save failed:', error.message)

    return {
      saved: false,
      memoryId: null,
      summary: 'Could not save lesson to Parcle'
    }
  }
}
module.exports = { searchMemory, saveMemory }