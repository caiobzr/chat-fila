import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { MensagemService } from './mensagem.service';

@Controller('mensagens')
export class MensagemController {
  constructor(private readonly mensagemService: MensagemService) {}

  @Post()
  enviar(@Req() req, @Body() body) {
    return this.mensagemService.enviar({
      ...body,
      clienteId: req['clienteId'],
    });
  }

  @Get()
  listar() {
    return this.mensagemService.listar();
  }
}
