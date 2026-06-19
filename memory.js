// Mock memory layer for now. Later we will replace this with real Parcle API calls.

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

module.exports = { searchMemory }