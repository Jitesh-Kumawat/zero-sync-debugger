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
async function saveMemory(ticket, fix){
  console.log('\n[Memory] Saving new lession from this bug')

  return new Promise((resolve) =>{
    setTimeout(() => {
      resolve({
        saved: true,
        memoryId: `memory-${Date.now()}`,
        summary: `Saved debugging lesson for :${ticket.title}`
  })
},700)
})
}
module.exports = { searchMemory, saveMemory }