import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from '../cliente/cliente.entity';

export enum StatusMensagem {
  PENDENTE = 'PENDENTE',
  PROCESSANDO = 'PROCESSANDO',
  ENVIADA = 'ENVIADA',
  ENTREGUE = 'ENTREGUE',
  LIDA = 'LIDA',
  FALHA = 'FALHA', // importante incluir se for usar no tratamento de erro
}

@Entity()
export class Mensagem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  conteudo: string;

  @Column({
    type: 'enum',
    enum: StatusMensagem,
    default: StatusMensagem.PENDENTE,
  })
  status: StatusMensagem;

  @Column({ default: 0 })
  prioridade: number;

  @Column({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)' })
  dataCriacao: Date;

  @Column({ name: 'updated_at', type: 'datetime', nullable: true, onUpdate: 'CURRENT_TIMESTAMP(6)' })
  dataEnvio: Date;

  @ManyToOne(() => Cliente, cliente => cliente.mensagens)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;
}
