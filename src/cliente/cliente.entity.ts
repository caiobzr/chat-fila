import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Mensagem } from '../mensagem/mensagem.entity';

@Entity()
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ unique: true })
  cpfCnpj: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  senha: string;

  @Column({ default: true })
  ativo: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataCriacao: Date;

  @Column({ default: 100 })
  saldo: number;

  @OneToMany(() => Mensagem, mensagem => mensagem.cliente)
  mensagens: Mensagem[];
}
