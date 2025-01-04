import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';

interface ITokenPayload {
  userId: string;
}

const isAuthorized = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders) {
    res.status(403).json({ error: 'Authorization header not found!' });
    return;
  }

  const token = authHeaders.split(' ')[1];
  if (!token) {
    res.status(403).json({ error: 'Authorization token missing!' });
    return;
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as ITokenPayload;
    const user: IUser | null = await User.findById(decodedToken.userId);

    if (!user) {
      res.status(403).json({ error: 'Not Authorized!' });
      return;
    }

    next();
  } catch (ex) {
    res.status(403).json({ error: 'Not Authorized!' });
  }
};

export default isAuthorized;