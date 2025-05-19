import { Test, TestingModule } from '@nestjs/testing';
import { MensagemService } from './mensagem.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Mensagem, StatusMensagem } from './mensagem.entity';
import { Cliente } from '../cliente/cliente.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';

const mensagemArray: Mensagem[] = [];

describe('MensagemService', () => {
  let service: MensagemService;
  let repo: Repository<Mensagem>;
  let clienteRepo: Repository<Cliente>;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MensagemService,
        {
          provide: getRepositoryToken(Mensagem),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
            create: jest.fn().mockImplementation((msg) => msg),
            save: jest
              .fn()
              .mockImplementation((msg) => Promise.resolve({ ...msg, id: 1 })),
            count: jest.fn().mockResolvedValue(10),
          },
        },
        {
          provide: getRepositoryToken(Cliente),
          useValue: {
            findOne: jest
              .fn()
              .mockResolvedValue({ id: 1, nome: 'Cliente Teste' }),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MensagemService>(MensagemService);
    repo = module.get<Repository<Mensagem>>(getRepositoryToken(Mensagem));
    clienteRepo = module.get<Repository<Cliente>>(getRepositoryToken(Cliente));
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve enviar uma mensagem com sucesso', async () => {
    const resultado = await service.enviar({
      conteudo: 'teste',
      prioridade: 1,
      clienteId: 1,
    });
    expect(resultado).toHaveProperty('id');
    expect(resultado.status).toBe(StatusMensagem.PENDENTE);
  });

  it('deve retornar erro se clienteId nao for informado', async () => {
    const resultado = await service.enviar({
      conteudo: 'teste',
      prioridade: 1,
    });
    expect(resultado).toEqual({ erro: 'clienteId é obrigatório' });
  });

  it('deve retornar estatísticas da fila', async () => {
    const stats = await service.estatisticasFila();
    expect(stats).toHaveProperty('fila');
    expect(stats).toHaveProperty('totais');
    expect(stats.totais.total).toBe(10);
  });
});
