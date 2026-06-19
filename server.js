const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Zero-Sync Debugger is running');
})
//Produck webhook listener
app.post('/webhook', (req, res) => {
    const ticket = req.body

    //log the ticket first before connecting Parcle/LLM logic
    console.log('\nNew Produck issue recieved')
    console.log('Title:', ticket.title || 'Untitled issue')
    console.log('Description:', ticket.description || 'No description provided')

    res.status(200).json({
        message : 'Ticket recieved by Zero-Sync Debugger',
        recieved: true
    })
})

app.listen(PORT, () => {
  console.log(`Zero-Sync Debugger listening on port ${PORT}`)
})
