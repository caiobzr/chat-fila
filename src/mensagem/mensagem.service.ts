import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mensagem } from './mensagem.entity';
import { ClienteService } from '../cliente/cliente.service';
import { ArquivoService } from './arquivo.service';

@Injectable()
export class MensagemService implements OnModuleInit {
  private fila: Mensagem[] = [];

  constructor(
    @InjectRepository(Mensagem) private repo: Repository<Mensagem>,
    private clienteService: ClienteService,
    private arquivoService: ArquivoService,
  ) {}

  async enviar(mensagem: Partial<Mensagem>) {
    const podeEnviar = await this.clienteService.decrementSaldo(
      mensagem.clienteId,
    );
    if (!podeEnviar) return { erro: 'Saldo insuficiente' };

    const novaMensagem = this.repo.create(mensagem);
    novaMensagem.status = 'PENDENTE';
    await this.repo.save(novaMensagem);

    this.arquivoService.salvarMensagem(novaMensagem.clienteId, novaMensagem);

    this.fila.push(novaMensagem);

    return novaMensagem;
  }

  async listarProcessadas() {
    return this.repo.find({ where: { status: 'PROCESSADA' } });
  }

  async listarPendentes() {
    return this.repo.find({ where: { status: 'PENDENTE' } });
  }

  async processarMensagens() {
    if (this.fila.length === 0) return;

    const msg = this.fila.shift();
    msg.status = 'PROCESSADA';
    await this.repo.save(msg);

    console.log(`Mensagem ${msg.id} processada.`);
  }
}
