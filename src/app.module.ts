import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';

import { Cliente } from './cliente/cliente.entity';
import { Mensagem } from './mensagem/mensagem.entity';
import { ClienteService } from './cliente/cliente.service';
import { MensagemService } from './mensagem/mensagem.service';
import { ClienteController } from './cliente/cliente.controller';
import { MensagemController } from './mensagem/mensagem.controller';
import { ClienteIdMiddleware } from './middleware/cliente-id.middleware';

import { StatusGateway } from './status/status.gateway';
import { AuthModule } from './auth/auth.module';
import { MensagemModule } from './mensagem/mensagem.module';
import { ClienteModule } from './cliente/cliente.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'root',
      password: 'root',
      database: 'chat_fila',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),

    TypeOrmModule.forFeature([Cliente, Mensagem]),
    CacheModule.register({
      isGlobal: true,
      ttl: 60000, // 1 minuto
    }),
    AuthModule,
    ClienteModule,
    MensagemModule,
  ],
  controllers: [ClienteController, MensagemController],
  providers: [ClienteService, MensagemService, StatusGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClienteIdMiddleware).forRoutes('mensagem');
  }
}
