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
    novaMensagem.status = 'ENVIADA';
    await this.repo.save(novaMensagem);

    this.fila.push(novaMensagem); // Adiciona à fila

    return novaMensagem;
  }

  async listar() {
    return this.repo.find({ where: { status: 'ENVIADA' } });
  }

  async listarProcessadas() {
    return this.repo.find({ where: { status: 'PROCESSADA' } });
  }

  async processarMensagem(mensagem: Mensagem) {
    // Simula tempo de envio da mensagem
    await new Promise((res) => setTimeout(res, 500));
    mensagem.status = 'PROCESSADA';
    await this.repo.save(mensagem);
  }

  async processarFila() {
    if (this.fila.length === 0) return;

    // Ordena fila por prioridade (alta > média > baixa)
    this.fila.sort((a, b) => {
      const prioridades = { alta: 3, media: 2, baixa: 1 };
      return prioridades[b.prioridade] - prioridades[a.prioridade];
    });

    const mensagem = this.fila.shift();
    if (mensagem) {
      await this.processarMensagem(mensagem);
    }
  }

  onModuleInit() {
    // Inicia o processamento da fila a cada 1 segundo
    setInterval(() => this.processarFila(), 1000);
  }
}
