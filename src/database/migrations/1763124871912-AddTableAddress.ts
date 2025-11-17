import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTableAddress1763124871912 implements MigrationInterface {
  name = 'AddTableAddress1763124871912';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "post" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "description" character varying,
                "content" character varying,
                "user_id" uuid NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_post_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "address" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "receiver_name" character varying NOT NULL,
                "phone_number" character varying NOT NULL,
                "address" character varying NOT NULL,
                "province_id" character varying NOT NULL,
                "ward_id" character varying NOT NULL,
                "user_id" uuid NOT NULL,
                "is_default" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_address_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "category" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "slug" character varying NOT NULL,
                "description" character varying NOT NULL DEFAULT '',
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_category_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "post"
            ADD CONSTRAINT "FK_post_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "address"
            ADD CONSTRAINT "FK_address_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "address" DROP CONSTRAINT "FK_address_user"
        `);
    await queryRunner.query(`
            ALTER TABLE "post" DROP CONSTRAINT "FK_post_user_id"
        `);
    await queryRunner.query(`
            DROP TABLE "category"
        `);
    await queryRunner.query(`
            DROP TABLE "address"
        `);
    await queryRunner.query(`
            DROP TABLE "post"
        `);
  }
}
