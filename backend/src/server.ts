import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import connectDB from './config/db';
import generalRouter from './routes/generalRoutes'
import authRouter from './routes/authRoutes'
import forgotPasswordRoutes from './routes/forgotPassword';
import {rateLimiter} from './middlewares/rateLimiter'
import calendarController from './routes/calendarRoutes'
import authMiddleware from './middlewares/authMiddleware'
import errorMiddleware from './middlewares/errorHandler';
import webSocketConnect from './utils/webSocket'
import logger from './utils/logger'
import morgan from 'morgan';

dotenv.config();

const app = express();

// const corsOptions = {
//   origin: 'http://localhost:5173/',
// }

app.use(cors());
app.use(express.json({limit: '1kb'}));
app.use(helmet());
app.use(compression({ threshold: 0 }));

connectDB();
webSocketConnect();

app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));


// Routes
app.use('/api', rateLimiter, generalRouter);
app.use('/api/calendar', rateLimiter, calendarController);
app.use('/register', rateLimiter, authRouter);
app.use('/login', rateLimiter, authRouter);
// app.use('/api/forgot-password', rateLimiter, authMiddleware, forgotPasswordRoutes);

app.use(errorMiddleware)

// app.use((err, req, res, next) => {
//   logger.error('Error occurred: %s', err.message, { stack: err.stack });
//   res.status(500).json({ message: 'Internal Server Error' });
// });


const PORT = process.env.PORT || 5000;

// Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  logger.info(`Server running on http://localhost:${PORT}`);
});