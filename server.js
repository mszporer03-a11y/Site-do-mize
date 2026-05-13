// ============================================================
// Mize Landing — server.js
// Servidor Express para deploy no Railway
// ============================================================
const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

// ===== Health check para Railway =====
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', ts: Date.now() });
});

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// ===== /api/leads — captura de leads (placeholder) =====
// Por enquanto apenas loga o payload. Integre com seu CRM,
// banco de dados ou serviço de e-mail quando estiver pronto.
app.post('/api/leads', (req, res) => {
  const { nome, restaurante, cidade, tamanho, whatsapp, origem, timestamp } = req.body;

  // Validação mínima de entrada
  if (!nome || !whatsapp) {
    return res.status(400).json({ error: 'Nome e WhatsApp são obrigatórios.' });
  }

  console.log('[Mize Lead]', {
    nome,
    restaurante,
    cidade,
    tamanho,
    whatsapp,
    origem:    origem    || 'desconhecido',
    timestamp: timestamp || new Date().toISOString(),
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
  });

  res.json({ ok: true, message: 'Lead recebido com sucesso.' });
});

// SPA fallback — rotas não encontradas retornam 404.html ou index.html
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Mize Landing rodando na porta ${PORT}`);
});
