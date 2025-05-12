const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;
const DB_FILE = './events.json';

app.use(cors());
app.use(express.json());

// Carregar eventos
app.get('/events', (req, res) => {
  fs.readFile(DB_FILE, (err, data) => {
    if (err) return res.status(500).send('Erro ao ler dados.');
    res.json(JSON.parse(data));
  });
});

// Adicionar evento
app.post('/events', (req, res) => {
  const newEvent = req.body;
  fs.readFile(DB_FILE, (err, data) => {
    if (err) return res.status(500).send('Erro ao ler dados.');
    const events = JSON.parse(data);
    events.push(newEvent);
    fs.writeFile(DB_FILE, JSON.stringify(events, null, 2), err => {
      if (err) return res.status(500).send('Erro ao salvar evento.');
      res.status(201).send('Evento salvo com sucesso.');
    });
  });
});

// Excluir evento
app.delete('/events/:id', (req, res) => {
  const eventId = req.params.id;
  fs.readFile(DB_FILE, (err, data) => {
    if (err) return res.status(500).send('Erro ao ler dados.');
    let events = JSON.parse(data);
    events = events.filter(event => event.id !== eventId);
    fs.writeFile(DB_FILE, JSON.stringify(events, null, 2), err => {
      if (err) return res.status(500).send('Erro ao excluir evento.');
      res.send('Evento excluído.');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
