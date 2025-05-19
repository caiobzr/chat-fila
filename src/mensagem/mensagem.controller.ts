import { Controller, Post, Body, Get } from '@nestjs/common';
import { MensagemService } from './mensagem.service';
import { Mensagem } from './mensagem.entity';

@Controller('mensagens')
export class MensagemController {
  constructor(private readonly mensagemService: MensagemService) {}

  @Post()
  async enviar(@Body() mensagem: Partial<Mensagem>) {
    return this.mensagemService.enviar(mensagem);
  }

  @Get('processadas')
  async listarProcessadas() {
    return this.mensagemService.listarProcessadas();
  }

  @Get('pendentes')
  async listarPendentes() {
    return this.mensagemService.listarPendentes();
  }
}
