import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mensagem } from './mensagem.entity';
import { ClienteService } from '../cliente/cliente.service';

@Injectable()
export class MensagemService implements OnModuleInit {
  private fila: Mensagem[] = [];

  constructor(
    @InjectRepository(Mensagem) private repo: Repository<Mensagem>,
    private clienteService: ClienteService,
  ) {}

  async enviar(mensagem: Partial<Mensagem>) {
    const podeEnviar = await this.clienteService.decrementSaldo(
      mensagem.clienteId,
    );

    if (!podeEnviar) return { erro: 'Saldo insuficiente' };

    const novaMensagem = this.repo.create(mensagem);
    novaMensagem.status = 'PENDENTE';

    await this.repo.save(novaMensagem);
    this.fila.push(novaMensagem); // Adiciona na fila FIFO

    return novaMensagem;
  }

  async listarProcessadas() {
    return this.repo.find({ where: { status: 'PROCESSADA' } });
  }

  async listarPendentes() {
    return this.repo.find({ where: { status: 'PENDENTE' } });
  }

  onModuleInit() {
    setInterval(() => this.processarFila(), 2000); // Executa a cada 2s
  }

  private async processarFila() {
    if (this.fila.length === 0) return;

    const mensagem = this.fila.shift(); // FIFO
    mensagem.status = 'PROCESSADA';
    await this.repo.save(mensagem);

    console.log(`Mensagem ${mensagem.id} processada.`);
  }
}
