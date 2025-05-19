import { Injectable } from '@nestjs/common';
import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class ArquivoService {
  private pasta = 'storage';

  salvarMensagem(clienteId: number, mensagem: any) {
    const path = join(this.pasta, `mensagens-${clienteId}.json`);
    const mensagens = this.obterMensagens(clienteId);
    mensagens.push(mensagem);
    writeFileSync(path, JSON.stringify(mensagens, null, 2));
  }

  obterMensagens(clienteId: number): any[] {
    const path = join(this.pasta, `mensagens-${clienteId}.json`);
    if (!existsSync(path)) return [];
    const data = readFileSync(path, 'utf-8');
    return JSON.parse(data);
  }
}
