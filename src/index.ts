import 'reflect-metadata';
import express, { Application } from 'express';
import { AppDataSource } from './data-source';
import authRoutes from './modules/auth/auth.routes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Register module routes
app.use('/api/auth', authRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database connection established');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error('❌ Error during Data Source initialization:', error);
    process.exit(1);
  });

