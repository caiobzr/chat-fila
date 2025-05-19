import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mensagem } from './mensagem.entity';
import { MensagemService } from './mensagem.service';
import { MensagemController } from './mensagem.controller';
import { Cliente } from '../cliente/cliente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mensagem, Cliente])],
  providers: [MensagemService],
  controllers: [MensagemController],
  exports: [MensagemService],
})
export class MensagemModule {}
