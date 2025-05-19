import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCpfCnpjToCliente1747685851760 implements MigrationInterface {
    name = 'AddCpfCnpjToCliente1747685851760'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mensagem\` DROP FOREIGN KEY \`FK_mensagem_cliente\``);
        await queryRunner.query(`DROP INDEX \`IDX_48c20742f7783158ed059eea3f\` ON \`cliente\``);
        await queryRunner.query(`ALTER TABLE \`cliente\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`cliente\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`cliente\` DROP COLUMN \`senha\``);
        await queryRunner.query(`ALTER TABLE \`cliente\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`mensagem\` DROP COLUMN \`cliente_id\``);
        await queryRunner.query(`ALTER TABLE \`mensagem\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`mensagem\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`cliente\` ADD \`cpfCnpj\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cliente\` ADD UNIQUE INDEX \`IDX_73e7831e0b3ffcfff5297a3746\` (\`cpfCnpj\`)`);
        await queryRunner.query(`ALTER TABLE \`cliente\` ADD \`ativo\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`cliente\` ADD \`dataCriacao\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`cliente\` ADD \`saldo\` int NOT NULL DEFAULT '100'`);
        await queryRunner.query(`ALTER TABLE \`mensagem\` ADD \`prioridade\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`mensagem\` ADD \`dataCriacao\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`mensagem\` ADD \`dataEnvio\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`mensagem\` ADD \`clienteId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`mensagem\` DROP COLUMN \`conteudo\``);
        await queryRunner.query(`ALTER TABLE \`mensagem\` ADD \`conteudo\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`mensagem\` CHANGE \`status\` \`status\` enum ('PENDENTE', 'PROCESSANDO', 'ENVIADA', 'ENTREGUE', 'LIDA', 'FALHA') NOT NULL DEFAULT 'PENDENTE'`);
        await queryRunner.query(`ALTER TABLE \`mensagem\` ADD CONSTRAINT \`FK_355013492ec37834705cdbd8771\` FOREIGN KEY (\`clienteId\`) REFERENCES \`cliente\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mensagem\` DROP FOREIGN KEY \`FK_355013492ec37834705cdbd8771\``);
        await queryRunner.query(`ALTER TABLE \`mensagem\` CHANGE \`status\` \`status\` enum ('pendente', 'processada', 'erro') NOT NULL DEFAULT 'pendente'`);
        await queryRunner.query(`ALTER TABLE \`mensagem\` DROP COLUMN \`conteudo\``);
        await queryRunner.query(`ALTER TABLE \`mensagem\` ADD \`conteudo\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`mensagem\` DROP COLUMN \`clienteId\``);
        await queryRunner.query(`ALTER TABLE \`mensagem\` DROP COLUMN \`dataEnvio\``);
        await queryRunner.query(`ALTER TABLE \`mensagem\` DROP COLUMN \`dataCriacao\``);
        await queryRunner.query(`ALTER TABLE \`mensagem\` DROP COLUMN \`prioridade\``);
        await queryRunner.query(`ALTER TABLE \`cliente\` DROP COLUMN \`saldo\``);
        await queryRunner.query(`ALTER TABLE \`cliente\` DROP COLUMN \`dataCriacao\``);
        await queryRunner.query(`ALTER TABLE \`cliente\` DROP COLUMN \`ativo\``);
        await queryRunner.query(`ALTER TABLE \`cliente\` DROP INDEX \`IDX_73e7831e0b3ffcfff5297a3746\``);
        await queryRunner.query(`ALTER TABLE \`cliente\` DROP COLUMN \`cpfCnpj\``);
        await queryRunner.query(`ALTER TABLE \`mensagem\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`mensagem\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`mensagem\` ADD \`cliente_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cliente\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`cliente\` ADD \`senha\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cliente\` ADD \`email\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cliente\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_48c20742f7783158ed059eea3f\` ON \`cliente\` (\`email\`)`);
        await queryRunner.query(`ALTER TABLE \`mensagem\` ADD CONSTRAINT \`FK_mensagem_cliente\` FOREIGN KEY (\`cliente_id\`) REFERENCES \`cliente\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
