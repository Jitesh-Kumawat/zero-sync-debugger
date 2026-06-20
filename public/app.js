const runBtn = document.getElementById('runBtn')
const resultPanel = document.getElementById('resultPanel')
const loader = document.getElementById('loader')
const output = document.getElementById('output')

runBtn.addEventListener('click', async () => {
  const title = document.getElementById('bugTitle').value
  const description = document.getElementById('bugDesc').value

  resultPanel.classList.remove('hidden')
  loader.classList.remove('hidden')
  output.innerHTML = ''

  try {
    const response = await fetch('/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description })
    })

    const data = await response.json()

    loader.classList.add('hidden')

    output.innerHTML = `
      <div class="step">
        <h3>1. Issue received</h3>
        <p><strong>${data.ticket.title}</strong></p>
        <p>${data.ticket.description}</p>
      </div>

      <div class="step">
        <h3>2. Memory checked</h3>
        <p><strong>Confidence:</strong> ${data.memory.confidence * 100}%</p>
        <p><strong>References:</strong> ${data.memory.citations.join(', ')}</p>
        <p>${data.memory.context}</p>
      </div>

      <div class="step">
        <h3>3. Suggested fix</h3>
        <pre>${data.fix}</pre>
      </div>
    `
  } catch (error) {
    loader.classList.add('hidden')
    output.innerHTML = `
      <div class="step">
        <h3>Something broke</h3>
        <p>Could not connect to the backend server. Make sure <code>node server.js</code> is running.</p>
      </div>
    `
  }
})