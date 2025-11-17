import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableCategoryAttributeAttriValue1763240848204 implements MigrationInterface {
    name = 'AddTableCategoryAttributeAttriValue1763240848204'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "category"
                RENAME COLUMN "description" TO "is_enabled"
        `);
        await queryRunner.query(`
            CREATE TABLE "attribute-value" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "value" character varying NOT NULL,
                "displayOrder" integer NOT NULL,
                "attribute_id" uuid NOT NULL,
                "is_enabled" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_attribute_value_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."attribute_type_enum" AS ENUM(
                'string',
                'number',
                'boolean',
                'select',
                'multiselect'
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "attribute" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "type" "public"."attribute_type_enum" NOT NULL,
                "is_enabled" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_350fb4f7eb87e4c7d35c97a9828" UNIQUE ("name"),
                CONSTRAINT "PK_attribute_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "category_attribute" (
                "category_id" uuid NOT NULL,
                "attribute_id" uuid NOT NULL,
                CONSTRAINT "PK_41f760146d545567ff4e329710e" PRIMARY KEY ("category_id", "attribute_id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_e8145c8dfcb858b614ba1d7301" ON "category_attribute" ("category_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_0b0fc4dc2cc0e32c47d7b71f1a" ON "category_attribute" ("attribute_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "category" DROP COLUMN "is_enabled"
        `);
        await queryRunner.query(`
            ALTER TABLE "category"
            ADD "is_enabled" boolean NOT NULL DEFAULT true
        `);
        await queryRunner.query(`
            ALTER TABLE "attribute-value"
            ADD CONSTRAINT "FK_attribute_value_attribute" FOREIGN KEY ("attribute_id") REFERENCES "attribute"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "category_attribute"
            ADD CONSTRAINT "FK_e8145c8dfcb858b614ba1d73014" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "category_attribute"
            ADD CONSTRAINT "FK_0b0fc4dc2cc0e32c47d7b71f1a3" FOREIGN KEY ("attribute_id") REFERENCES "attribute"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "category_attribute" DROP CONSTRAINT "FK_0b0fc4dc2cc0e32c47d7b71f1a3"
        `);
        await queryRunner.query(`
            ALTER TABLE "category_attribute" DROP CONSTRAINT "FK_e8145c8dfcb858b614ba1d73014"
        `);
        await queryRunner.query(`
            ALTER TABLE "attribute-value" DROP CONSTRAINT "FK_attribute_value_attribute"
        `);
        await queryRunner.query(`
            ALTER TABLE "category" DROP COLUMN "is_enabled"
        `);
        await queryRunner.query(`
            ALTER TABLE "category"
            ADD "is_enabled" character varying NOT NULL DEFAULT ''
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_0b0fc4dc2cc0e32c47d7b71f1a"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_e8145c8dfcb858b614ba1d7301"
        `);
        await queryRunner.query(`
            DROP TABLE "category_attribute"
        `);
        await queryRunner.query(`
            DROP TABLE "attribute"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."attribute_type_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "attribute-value"
        `);
        await queryRunner.query(`
            ALTER TABLE "category"
                RENAME COLUMN "is_enabled" TO "description"
        `);
    }

}
