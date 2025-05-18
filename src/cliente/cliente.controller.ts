import { Controller, Post, Body } from '@nestjs/common';
import { ClienteService } from './cliente.service';

@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  create(@Body() body) {
    return this.clienteService.create(body);
  }
}
