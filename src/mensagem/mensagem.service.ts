import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mensagem, StatusMensagem } from './mensagem.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Cliente } from '../cliente/cliente.entity';

@Injectable()
export class MensagemService implements OnModuleInit {
  private readonly logger = new Logger(MensagemService.name);
  private filaUrgente: Mensagem[] = [];
  private filaNormal: Mensagem[] = [];
  private tentativas: Map<number, number> = new Map();
  private contadorUrgentes = 0;
  private readonly MAX_TENTATIVAS = 3;
  private readonly MAX_URGENTES_SEQUENCIA = 3;
  private readonly PROCESSAMENTO_INTERVALO = 1000;

  constructor(
    @InjectRepository(Mensagem)
    private readonly mensagemRepository: Repository<Mensagem>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  onModuleInit() {
    this.logger.log('Iniciando worker de processamento de mensagens');
    setInterval(() => this.workerProcessarFila(), this.PROCESSAMENTO_INTERVALO);
  }

  async enviar(mensagem: Partial<Mensagem>) {
    try {
      mensagem.status = StatusMensagem.PENDENTE;
      const nova = this.mensagemRepository.create(mensagem);
      const salva = await this.mensagemRepository.save(nova);

      if (mensagem.prioridade === 1) {
        this.filaUrgente.push(salva);
        this.logger.debug(`Mensagem urgente ${salva.id} adicionada à fila`);
      } else {
        this.filaNormal.push(salva);
        this.logger.debug(`Mensagem normal ${salva.id} adicionada à fila`);
      }

      await this.invalidarCacheEstatisticas();
      return salva;
    } catch (error) {
      this.logger.error(`Erro ao enviar mensagem: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async workerProcessarFila() {
    let fila: Mensagem[] | null = null;

    if (this.filaUrgente.length > 0 && this.contadorUrgentes < this.MAX_URGENTES_SEQUENCIA) {
      fila = this.filaUrgente;
      this.contadorUrgentes++;
    } else if (this.filaNormal.length > 0) {
      fila = this.filaNormal;
      this.contadorUrgentes = 0;
    }

    if (!fila || fila.length === 0) return;

    const msg = fila.shift();
    if (!msg) return;

    try {
      msg.status = StatusMensagem.PROCESSANDO;
      await this.mensagemRepository.save(msg);

      await this.simularEtapasEnvio(msg);
      await this.invalidarCacheEstatisticas();
    } catch (err) {
      this.logger.error(`Falha ao processar mensagem ${msg.id}: ${err.message}`, err.stack);
      const tentativas = this.tentativas.get(msg.id) ?? 0;

      if (tentativas < this.MAX_TENTATIVAS) {
        this.tentativas.set(msg.id, tentativas + 1);
        if (msg.prioridade === 1) this.filaUrgente.push(msg);
        else this.filaNormal.push(msg);
      } else {
        msg.status = StatusMensagem.FALHA;
        await this.mensagemRepository.save(msg);
        this.tentativas.delete(msg.id);
        this.logger.warn(`Mensagem ${msg.id} falhou após ${this.MAX_TENTATIVAS} tentativas`);
      }
    }
  }

  private async simularEtapasEnvio(msg: Mensagem) {
    try {
      msg.status = StatusMensagem.ENVIADA;
      msg.dataEnvio = new Date();
      await this.mensagemRepository.save(msg);
      await this.delay(1000);

      msg.status = StatusMensagem.ENTREGUE;
      await this.mensagemRepository.save(msg);
      await this.delay(1000);

      msg.status = StatusMensagem.LIDA;
      await this.mensagemRepository.save(msg);

      this.logger.log(`Mensagem ${msg.id} processada e lida com sucesso`);
    } catch (error) {
      this.logger.error(`Erro ao simular envio da mensagem ${msg.id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  private delay(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }

  async estatisticasFila() {
    const cacheKey = 'estatisticas_fila';
    const cachedStats = await this.cacheManager.get(cacheKey);
    
    if (cachedStats) {
      return cachedStats;
    }

    const stats = {
      fila: {
        urgentes: this.filaUrgente.length,
        normais: this.filaNormal.length,
      },
      totais: {
        total: await this.mensagemRepository.count(),
      },
    };

    await this.cacheManager.set(cacheKey, stats, 30000); // Cache por 30 segundos
    return stats;
  }

  private async invalidarCacheEstatisticas() {
    await this.cacheManager.del('estatisticas_fila');
  }

  async ultimasMensagensLidas(clienteId: number): Promise<Mensagem[]> {
    const cacheKey = `ultimas_mensagens_${clienteId}`;
    const cachedMessages = await this.cacheManager.get(cacheKey);
    
    if (cachedMessages) {
      return cachedMessages as Mensagem[];
    }

    const messages = await this.mensagemRepository.find({
      where: {
        cliente: { id: clienteId },
        status: StatusMensagem.LIDA,
      },
      order: {
        dataEnvio: 'DESC',
      },
      take: 10,
    });

    await this.cacheManager.set(cacheKey, messages, 60000); // Cache por 1 minuto
    return messages;
  }

  async listarPendentes(): Promise<Mensagem[]> {
    return this.mensagemRepository.find({
      where: { status: StatusMensagem.PENDENTE },
    });
  }

  async listarProcessadas(): Promise<Mensagem[]> {
    return this.mensagemRepository.find({
      where: { status: StatusMensagem.ENVIADA },
    });
  }

  async buscarClientePorId(id: number): Promise<Cliente | null> {
    return this.clienteRepository.findOneBy({ id });
  }
}
