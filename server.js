const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Message Schema
const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});
const Message = mongoose.model('Message', messageSchema);

// POST route — saves message to DB
app.post('/api/contact', async (req, res) => {
  console.log('📨 Received POST request:', req.body);
  const { name, email, message } = req.body;
  
  // Validate input
  if (!name || !email || !message) {
    console.log('❌ Missing fields:', { name, email, message });
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }
  
  try {
    console.log('💾 Saving message to database...');
    const newMessage = await Message.create({ name, email, message });
    console.log('✅ Message saved:', newMessage);
    res.status(201).json({ success: true, data: newMessage });
  } catch (err) {
    console.error('❌ Error saving message:', err.message);
    res.status(500).json({ error: err.message });
  }
});
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// GET route — lets you view all messages
app.get('/api/messages', async (req, res) => {
  try {
    console.log('📬 Fetching all messages...');
    const messages = await Message.find().sort({ createdAt: -1 });
    console.log(`✅ Found ${messages.length} messages`);
    res.json(messages);
  } catch (err) {
    console.error('❌ Error fetching messages:', err.message);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});