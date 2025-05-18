import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ClienteIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers['clienteid']) {
      throw new UnauthorizedException('clienteId é obrigatório');
    }
    req['clienteId'] = parseInt(req.headers['clienteid'] as string);
    next();
  }
}
