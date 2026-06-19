const express = require('express');
require('dotenv').config();

const{ searchMemory } = require('./memory');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Zero-Sync Debugger is running');
})

//Produck webhook listener
app.post('/webhook', async (req, res) => {
    const ticket = req.body

    //log the ticket first before connecting Parcle/LLM logic
    console.log('\nNew Produck issue received')
    console.log('Title:', ticket.title || 'Untitled issue')
    console.log('Description:', ticket.description || 'No description provided')

    try{
        const memory = await searchMemory(ticket.title || ticket.description || 'Unknown issue')

        console.log('\nMemory found')
        console.log('Context:', memory.context)
        console.log('Citations:', memory.citations)

    
    res.status(200).json({
        message : 'Ticket received and memory checked',
        received: true,
        ticket,
        memory
    })
}catch(error){
    console.log('Memory search failed:', error.message)

    res.status(500).json({
        message: 'Something went wrong while searching memory',
        received: true,
    })
}
})

app.listen(PORT, () => {
  console.log(`Zero-Sync Debugger listening on port ${PORT}`)
})
