//im bored so i pushed anything
import express from 'express';
import cors from 'cors';
import analyzeRoutes from './routes/analyze.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api', analyzeRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`OSS Onboard backend running on http://localhost:${PORT}`);
});
