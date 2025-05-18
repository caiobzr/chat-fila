import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './cliente.entity';

@Injectable()
export class ClienteService {
  constructor(@InjectRepository(Cliente) private repo: Repository<Cliente>) {}

  async create(data: Partial<Cliente>) {
    const planos = { BASICO: 100, PREMIUM: 1000 };
    data.saldo = planos[data.plano];
    return this.repo.save(data);
  }

  async findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async decrementSaldo(id: number) {
    const cliente = await this.findById(id);
    if (!cliente) return null;
    if (cliente.saldo <= 0) return false;
    cliente.saldo -= 1;
    await this.repo.save(cliente);
    return true;
  }
}
