import { Request } from 'express';

export interface AuthenticationRequest extends Request {
  user: string;
}
