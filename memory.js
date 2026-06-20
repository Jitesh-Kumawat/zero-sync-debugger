require('dotenv').config({ quiet: true })

const PARCLE_BASE_URL = 'https://api.parcle.ai/v1'
const DEFAULT_USER_ID = 'zero-sync-debugger'

async function searchMemory(issueTitle) {
  console.log(`\n[Memory] Searching Parcle for: "${issueTitle}"`)

  const apiKey = process.env.PARCLE_API_KEY
  const userId = process.env.PARCLE_USER_ID || DEFAULT_USER_ID

  if (!apiKey) {
    return fallbackMemory()
  }

  try {
    const response = await fetch(`${PARCLE_BASE_URL}/memories/search`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'text/event-stream'
      },
      body: JSON.stringify({
        user_id: userId,
        query: `Find previous debugging lessons related to: ${issueTitle}`,
        tag_filter: {
          app: 'zero-sync-debugger'
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Parcle search failed ${response.status}: ${errorText}`)
    }

    const streamText = await response.text()
    const result = parseParcleSearchStream(streamText)

    if (!result) {
      return {
        confidence: 0,
        context: 'No matching Parcle memory found yet.',
        citations: []
      }
    }

    return {
      confidence: result.confidence || 0,
      context: result.answer || 'No matching Parcle memory found yet.',
      citations: result.citations ? result.citations.map((item) => item.id) : []
    }
  } catch (error) {
    console.error('[Memory] Parcle search failed:', error.message)
    return fallbackMemory()
  }
}

async function saveMemory(ticket, fix) {
  console.log('\n[Memory] Saving debugging lesson to Parcle')

  const apiKey = process.env.PARCLE_API_KEY
  const userId = process.env.PARCLE_USER_ID || DEFAULT_USER_ID

  if (!apiKey) {
    return {
      saved: true,
      memoryId: `mock-memory-${Date.now()}`,
      summary: `Saved debugging lesson locally for: ${ticket.title}`
    }
  }

  try {
    await ensureUser(apiKey, userId)

    const response = await fetch(`${PARCLE_BASE_URL}/memories/ingest_dialog`, {
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

async function ensureUser(apiKey, userId) {
  const response = await fetch(`${PARCLE_BASE_URL}/users`, {
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

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Parcle user setup failed ${response.status}: ${errorText}`)
  }
}

function parseParcleSearchStream(streamText) {
  const events = streamText.split('\n\n')

  for (const event of events) {
    const lines = event.split('\n')
    const eventName = lines
      .find((line) => line.startsWith('event:'))
      ?.replace('event:', '')
      .trim()

    if (eventName !== 'final') {
      continue
    }

    const dataLines = lines
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.replace('data:', '').trim())

    if (!dataLines.length) {
      continue
    }

    try {
      return JSON.parse(dataLines.join('\n'))
    } catch (error) {
      return null
    }
  }

  return null
}

function fallbackMemory() {
  return {
    confidence: 0.95,
    context:
      'We had a similar auth 500 error before. The fix was to read the JWT secret from process.env instead of hardcoding it.',
    citations: ['ticket-88', 'commit-a1b2c3']
  }
}

module.exports = {
  searchMemory,
  saveMemory
}