import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './cliente.entity';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async create(cliente: Partial<Cliente>): Promise<Cliente> {
    const novoCliente = this.clienteRepository.create(cliente);
    return this.clienteRepository.save(novoCliente);
  }

  async findById(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({ where: { id } });
    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
    return cliente;
  }

  async findByCpfCnpj(cpfCnpj: string): Promise<Cliente | null> {
    return this.clienteRepository.findOne({ where: { cpfCnpj } });
  }

  async update(id: number, cliente: Partial<Cliente>): Promise<Cliente> {
    await this.findById(id); // Verifica se o cliente existe
    await this.clienteRepository.update(id, cliente);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    const cliente = await this.findById(id);
    await this.clienteRepository.remove(cliente);
  }

  async listarTodos(): Promise<Cliente[]> {
    return this.clienteRepository.find();
  }

  async decrementSaldo(id: number) {
    const cliente = await this.findById(id);
    if (!cliente) return null;
    if (cliente.saldo <= 0) return false;
    cliente.saldo -= 1;
    await this.clienteRepository.save(cliente);
    return true;
  }
}
