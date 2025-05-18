import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mensagem } from './mensagem.entity';
import { ClienteService } from '../cliente/cliente.service';

@Injectable()
export class MensagemService {
  private fila: Mensagem[] = [];

  constructor(
    @InjectRepository(Mensagem) private repo: Repository<Mensagem>,
    private clienteService: ClienteService,
  ) {}

  async enviar(mensagem: Partial<Mensagem>) {
  if (!mensagem.clienteId || !mensagem.conteudo) {
    return { erro: 'clienteId e conteudo são obrigatórios' };
  }

  const podeEnviar = await this.clienteService.decrementSaldo(mensagem.clienteId);
  if (!podeEnviar) return { erro: 'Saldo insuficiente' };

  const novaMensagem = this.repo.create({
    ...mensagem,
    status: 'ENVIADA',
  });

  await this.repo.save(novaMensagem);

  this.fila.push(novaMensagem); // apenas simula fila FIFO

  return novaMensagem;
}