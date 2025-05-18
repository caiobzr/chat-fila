import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './cliente/cliente.entity';
import { Mensagem } from './mensagem/mensagem.entity';
import { ClienteService } from './cliente/cliente.service';
import { MensagemService } from './mensagem/mensagem.service';
import { ClienteController } from './cliente/cliente.controller';
import { MensagemController } from './mensagem/mensagem.controller';
import { ClienteIdMiddleware } from './middleware/cliente-id.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'senha',
      database: 'chat',
      entities: [Cliente, Mensagem],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Cliente, Mensagem]),
  ],
  controllers: [ClienteController, MensagemController],
  providers: [ClienteService, MensagemService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClienteIdMiddleware).forRoutes('mensagens');
  }
}
