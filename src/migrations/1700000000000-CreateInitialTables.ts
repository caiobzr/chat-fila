import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1700000000000 implements MigrationInterface {
    name = 'CreateInitialTables1700000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`cliente\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`nome\` varchar(255) NOT NULL,
                \`email\` varchar(255) NOT NULL,
                \`senha\` varchar(255) NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                UNIQUE INDEX \`IDX_48c20742f7783158ed059eea3f\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);

        await queryRunner.query(`
            CREATE TABLE \`mensagem\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`conteudo\` text NOT NULL,
                \`status\` enum ('pendente', 'processada', 'erro') NOT NULL DEFAULT 'pendente',
                \`cliente_id\` int NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`),
                KEY \`FK_mensagem_cliente\` (\`cliente_id\`),
                CONSTRAINT \`FK_mensagem_cliente\` FOREIGN KEY (\`cliente_id\`) REFERENCES \`cliente\` (\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`mensagem\``);
        await queryRunner.query(`DROP TABLE \`cliente\``);
    }
} 