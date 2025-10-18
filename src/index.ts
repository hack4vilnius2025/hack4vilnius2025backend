import 'reflect-metadata';
import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { AppDataSource } from './data-source';
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/auth/users.routes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load OpenAPI specification
const openapiDocument = YAML.load(path.join(__dirname, '../openapi.yml'));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Register module routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database connection established');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error: Error) => {
    console.error('❌ Error during Data Source initialization:', error);
    process.exit(1);
  });

