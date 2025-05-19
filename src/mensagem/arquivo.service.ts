import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mensagem, StatusMensagem } from './mensagem.entity';
import { ClienteService } from '../cliente/cliente.service';

@Injectable()
export class MensagemService {
  private readonly logger = new Logger(MensagemService.name);

  private filaUrgente: Mensagem[] = [];
  private filaNormal: Mensagem[] = [];

  constructor(
    @InjectRepository(Mensagem)
    private readonly mensagemRepository: Repository<Mensagem>,
    private readonly clienteService: ClienteService,
  ) {
    // Worker assíncrono rodando a cada segundo
    setInterval(() => this.processarMensagens(), 1000);
  }

  async enviar(mensagem: { conteudo: string; prioridade: number; clienteId: number }) {
    const cliente = await this.clienteService.findById(mensagem.clienteId);
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }

    const saldoDecrementado = await this.clienteService.decrementSaldo(mensagem.clienteId);
    if (!saldoDecrementado) {
      throw new Error('Saldo insuficiente');
    }

    const novaMensagem = this.mensagemRepository.create({
      conteudo: mensagem.conteudo,
      status: StatusMensagem.PENDENTE,
      cliente: cliente,
    });

    const mensagemSalva = await this.mensagemRepository.save(novaMensagem);

    if (mensagem.prioridade > 5) {
      this.filaUrgente.push(mensagemSalva);
    } else {
      this.filaNormal.push(mensagemSalva);
    }

    return mensagemSalva;
  }

  private async processarMensagens() {
    try {
      // Processa mensagens urgentes primeiro
      while (this.filaUrgente.length > 0) {
        const mensagem = this.filaUrgente.shift();
        if (mensagem) {
          await this.processarMensagem(mensagem);
        }
      }

      // Depois processa mensagens normais
      while (this.filaNormal.length > 0) {
        const mensagem = this.filaNormal.shift();
        if (mensagem) {
          await this.processarMensagem(mensagem);
        }
      }
    } catch (error) {
      this.logger.error('Erro ao processar mensagens:', error);
    }
  }

  private async processarMensagem(mensagem: Mensagem) {
    try {
      // Simula processamento
      await new Promise(resolve => setTimeout(resolve, 1000));

      mensagem.status = StatusMensagem.ENVIADA;
      await this.mensagemRepository.save(mensagem);
    } catch (error) {
      mensagem.status = StatusMensagem.FALHA;
      await this.mensagemRepository.save(mensagem);
      this.logger.error(`Erro ao processar mensagem ${mensagem.id}:`, error);
    }
  }

  async listarPendentes() {
    return this.mensagemRepository.find({
      where: { status: StatusMensagem.PENDENTE },
      relations: ['cliente'],
    });
  }

  async listarProcessadas() {
    return this.mensagemRepository.find({
      where: { status: StatusMensagem.ENVIADA },
      relations: ['cliente'],
    });
  }

  async estatisticas() {
    const [total, pendentes, enviadas, falhas] = await Promise.all([
      this.mensagemRepository.count(),
      this.mensagemRepository.count({ where: { status: StatusMensagem.PENDENTE } }),
      this.mensagemRepository.count({ where: { status: StatusMensagem.ENVIADA } }),
      this.mensagemRepository.count({ where: { status: StatusMensagem.FALHA } }),
    ]);

    return {
      total,
      pendentes,
      enviadas,
      falhas,
    };
  }
}
