import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from '../cliente/cliente.entity';

@Entity()
export class Mensagem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  conteudo: string;

  @Column()
  prioridade: number;

  @Column({ default: 'PENDENTE' })
  status: 'PENDENTE' | 'ENVIADA';

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'clienteId' })
  cliente: Cliente;

  @Column()
  clienteId: number;
}
