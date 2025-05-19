import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../cliente/cliente.entity';

@Injectable()
export class ClienteIdMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const cpfCnpj = req.headers['x-cpf-cnpj'] as string;
    if (!cpfCnpj) throw new UnauthorizedException('CPF/CNPJ não informado');

    const cliente = await this.clienteRepository.findOneBy({ cpfCnpj });
    if (!cliente) throw new UnauthorizedException('Cliente não encontrado');

    (req as any).cliente = cliente;
    next();
  }
}
