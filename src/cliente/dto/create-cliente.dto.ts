import { IsString, IsNotEmpty, Length, Matches, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClienteDto {
  @ApiProperty({ description: 'Nome do cliente' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  nome: string;

  @ApiProperty({ description: 'CPF ou CNPJ do cliente' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{11}$|^[0-9]{14}$/, {
    message: 'CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos',
  })
  cpfCnpj: string;

  @ApiProperty({ description: 'E-mail do cliente' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Senha do cliente' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  senha: string;
} 