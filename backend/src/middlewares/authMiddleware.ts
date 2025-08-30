const jwt = require("jsonwebtoken");
import dotenv from "dotenv";
import type {Request, Response, NextFunction} from 'express';

dotenv.config();

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  try {

    // const sampleToken = jwt.sign({payload: "hello"}, process.env.JWT_SECRET, { expiresIn: '1h' });
    // console.log('sampleToken => ', sampleToken)

    const authHeader = req?.headers?.authorization;

    if (!authHeader || !authHeader.includes("Bearer ")) {
      res.status(401).send({
        code: 401,
        status: "FAILURE",
        message: "Authorization token missing or malformed",
        data: {}
      });
      return;
    }

    const token = authHeader?.split(" ")[1];

    const decoded = jwt.verify(token, 'your-secret-key' as string);

    console.log('req?.headers +> ', decoded)

    if (!decoded) {
      res.status(401).send({ 
        code: 401,
        status: "FAILURE",
        message: "Invalid token payload" ,
        data: {}
      });
      return;
    }

    next();

  } catch (error) {

    res.status(401).send({ 
      code: 401,
      status: "FAILURE",
      message: "Unauthorized access", 
      data: error 
    });
    return;

  }
};

export default authMiddleware;