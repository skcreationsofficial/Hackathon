import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
  statusCode?: number;
  details?: any;
}

const errorMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {

  // console.error(`[ERROR] ${req.method} ${req.url} - ${err.message}`);

  console.log('Error handler')

  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).send({
    code: status,
    status: "FAILURE",
    message: message,
    data: err.details ? { details: err.details } : {},
  });

};

export default errorMiddleware;