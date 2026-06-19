//this file is testing of sendinf fake bug

const ticketData= {
    title: 'Authentication throwing 500 error',
    description: 'When a user tries to login , the server crashes . Need a immediate fix.'
}

fetch('http://localhost:3000/webhook', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(ticketData)
})
.then((response) => response.json())
.then((data) => {console.log('Response from Zero-Sync Debugger:', data)})
.catch((error) => {console.error('Could not connect to Zero-Sync Debugger:', error.message)})