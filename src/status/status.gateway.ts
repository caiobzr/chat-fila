import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({ cors: true })
@Injectable()
export class StatusGateway {
  @WebSocketServer()
  server: Server;

  enviarStatus(id: number, status: string) {
    this.server.emit('status', { id, status });
  }
}
