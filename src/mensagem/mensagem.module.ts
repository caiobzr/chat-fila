import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mensagem } from './mensagem.entity';
import { MensagemService } from './mensagem.service';
import { MensagemController } from './mensagem.controller';
import { ClienteModule } from '../cliente/cliente.module';
import { ArquivoService } from './arquivo.service';

@Module({
  imports: [TypeOrmModule.forFeature([Mensagem]), ClienteModule],
  providers: [MensagemService, ArquivoService],
  controllers: [MensagemController],
})
export class MensagemModule {}
