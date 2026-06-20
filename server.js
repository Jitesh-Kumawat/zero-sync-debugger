const express = require('express');
require('dotenv').config({ quiet: true })

const { searchMemory } = require('./memory');
const { generateFix } = require('./aimodel');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send('Zero-Sync Debugger is running');
})

app.post('/webhook', async (req, res) => {
  const ticket = req.body;

  console.log('\nNew Produck issue received');
  console.log('Title:', ticket.title || 'Untitled issue');
  console.log('Description:', ticket.description || 'No description provided');

  try {
    const memory = await searchMemory(ticket.title || ticket.description || 'Unknown issue');
    const fix = await generateFix(ticket, memory);

    console.log('\nFix suggestion created');
    console.log(fix);

    res.status(200).json({
      message: 'Ticket analyzed and fix generated',
      received: true,
      ticket,
      memory,
      fix
    })
  } catch (error) {
    console.error('Debugger flow failed:', error.message);

    res.status(500).json({
      message: 'Something went wrong during analysis',
      received: false
    })
  }
})

app.listen(PORT, () => {
  console.log(`Zero-Sync Debugger listening on port ${PORT}`);
})