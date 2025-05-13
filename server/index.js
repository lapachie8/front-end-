import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Data file path
const dataFilePath = path.join(__dirname, 'data', 'items.json');

// Ensure data directory exists
const ensureDataDir = async () => {
  const dataDir = path.join(__dirname, 'data');
  try {
    await fs.access(dataDir);
  } catch (error) {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(dataFilePath, JSON.stringify([]));
  }
};

// Data operations
const readData = async () => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeData = async (data) => {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
};

// API Routes
// GET all items
app.get('/api/items', async (req, res) => {
  try {
    const items = await readData();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// GET single item
app.get('/api/items/:id', async (req, res) => {
  try {
    const items = await readData();
    const item = items.find(item => item.id === req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// POST new item
app.post('/api/items', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const items = await readData();
    const newItem = {
      id: Date.now().toString(),
      name,
      description: description || '',
      createdAt: new Date().toISOString()
    };
    
    items.push(newItem);
    await writeData(items);
    
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// PUT update item
app.put('/api/items/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    const items = await readData();
    const index = items.findIndex(item => item.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    items[index] = {
      ...items[index],
      name,
      description: description || items[index].description,
      updatedAt: new Date().toISOString()
    };
    
    await writeData(items);
    res.json(items[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// DELETE item
app.delete('/api/items/:id', async (req, res) => {
  try {
    const items = await readData();
    const filteredItems = items.filter(item => item.id !== req.params.id);
    
    if (filteredItems.length === items.length) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    await writeData(filteredItems);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Start server
app.listen(PORT, async () => {
  await ensureDataDir();
  console.log(`Server running on http://localhost:${PORT}`);
});