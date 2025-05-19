import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  BadRequestException,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MensagemService } from './mensagem.service';
import { Mensagem } from './mensagem.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Mensagens')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('mensagem')
export class MensagemController {
  constructor(private readonly mensagemService: MensagemService) {}

  @Post()
  @ApiOperation({ summary: 'Enviar mensagem' })
  @ApiResponse({ status: 201, description: 'Mensagem enviada com sucesso' })
  async enviar(
    @Request() req,
    @Body() mensagem: { conteudo: string; prioridade?: number },
  ): Promise<Mensagem> {
    const cliente = await this.mensagemService.buscarClientePorId(req.user.id);
    if (!cliente) throw new BadRequestException('Cliente não encontrado');
    return this.mensagemService.enviar({
      ...mensagem,
      cliente,
    });
  }

  @Get('pendentes')
  @ApiOperation({ summary: 'Listar mensagens pendentes' })
  @ApiResponse({ status: 200, description: 'Lista de mensagens pendentes' })
  async listarPendentes(): Promise<Mensagem[]> {
    return this.mensagemService.listarPendentes();
  }

  @Get('processadas')
  @ApiOperation({ summary: 'Listar mensagens processadas' })
  @ApiResponse({ status: 200, description: 'Lista de mensagens processadas' })
  async listarProcessadas(): Promise<Mensagem[]> {
    return this.mensagemService.listarProcessadas();
  }

  @Get('estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas da fila' })
  @ApiResponse({ status: 200, description: 'Estatísticas da fila' })
  async estatisticas() {
    return this.mensagemService.estatisticasFila();
  }

  @Get('cache/:clienteId')
  async ultimasMensagens(@Param('clienteId') clienteId: number) {
    return this.mensagemService.ultimasMensagensLidas(clienteId);
  }
}
