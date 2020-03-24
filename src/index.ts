import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import route from './routes';
import Error from './error-handler';
import CustomError from './error-handler';

dotenv.config();

const { PORT } = process.env;

const app = express();

app.set('port', PORT);

app.use(express.urlencoded({
  extended: false,
}));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({
    message: 'Baobab begins...!!!',
  });
});

// API routes
app.use('/api/v1', route);

app.use((_req, _res, next) => {
  const error = Error.withDetails(404, 'Resource Not Found');
  next(error);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: CustomError, _req: Request, res: Response, _next: NextFunction) => {
  res.status(err.status || 500).json({
    error: err.content,
  });
});

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});

export default app;
