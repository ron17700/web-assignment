import express, { Express } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import swaggerSetup from './swagger';
import routes from './routes/index';

dotenv.config({ path: path.join(__dirname, './.env') });
process.env.rootDir = __dirname;

const PORT = process.env.PORT || 3001;
const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', routes);

// Swagger documentation setup
swaggerSetup(app);

export const startServer = async (): Promise<ReturnType<Express['listen']> | null> => {
  try {
    console.log('\nTrying to connect to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('MongoDB connected successfully');
  } catch (exception: any) {
    console.error(exception.message);
    console.error(exception.stack);
    throw exception;
  }

  return app.listen(PORT, () => {
    console.log(`\nServer is listening on port: ${PORT} \n`);
    console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
  });
};

if (require.main === module) {
  console.log('Starting server from index.ts');
  startServer();
}

export default app;
