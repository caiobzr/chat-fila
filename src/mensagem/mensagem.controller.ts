import { Controller, Get, Post, Body } from '@nestjs/common';
import { MensagemService } from './mensagem.service';
import { Mensagem } from './mensagem.entity';

@Controller('mensagens')
export class MensagemController {
  constructor(private readonly mensagemService: MensagemService) {}

  @Post()
  async enviar(@Body() mensagem: Partial<Mensagem>) {
    return this.mensagemService.enviar(mensagem);
  }

  @Get()
  async listarEnviadas() {
    return this.mensagemService.listar();
  }

  @Get('processadas')
  async listarProcessadas() {
    return this.mensagemService.listarProcessadas();
  }
}
