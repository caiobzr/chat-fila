import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ unique: true })
  cpf_cnpj: string;

  @Column()
  plano: 'BASICO' | 'PREMIUM';

  @Column({ default: 0 })
  saldo: number;
}
