import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { AppDataSource } from './data-source';
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/auth/users.routes';
import forumApprovalsRoutes from './modules/forums/forum-approvals.routes';
import forumsRoutes, { userForumsRouter } from './modules/forums/forums.routes';
import commentsRoutes from './modules/forums/comments.routes';
import petitionsRoutes from './modules/petitions/petitions.routes';
import agentRoutes from './modules/agent/agent.routes';
import petitionApprovalsRoutes from './modules/petitions/petition-approvals.routes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for local development
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:5173', 'http://localhost:3000', 'http://localhost:4200'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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
app.use('/api/users', userForumsRouter); // Mount user forums routes at /api/users/forums
app.use('/api/forums', forumsRoutes);
app.use('/api/forums', forumApprovalsRoutes);
app.use('/api/forums', commentsRoutes);
app.use('/api/petitions', petitionsRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/petitions', petitionApprovalsRoutes);

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

