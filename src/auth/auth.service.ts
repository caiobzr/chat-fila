import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClienteService } from '../cliente/cliente.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly clienteService: ClienteService,
    private readonly jwtService: JwtService,
  ) {}

  async validateCliente(cpfCnpj: string): Promise<any> {
    const cliente = await this.clienteService.findByCpfCnpj(cpfCnpj);
    if (!cliente) {
      throw new UnauthorizedException('Cliente não encontrado');
    }
    return cliente;
  }

  async login(cpfCnpj: string) {
    const cliente = await this.validateCliente(cpfCnpj);
    const payload = { sub: cliente.id, cpfCnpj: cliente.cpfCnpj };
    
    return {
      access_token: this.jwtService.sign(payload),
      cliente: {
        id: cliente.id,
        nome: cliente.nome,
        cpfCnpj: cliente.cpfCnpj,
      },
    };
  }
} 