import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableShop1763026150418 implements MigrationInterface {
    name = 'AddTableShop1763026150418'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."shop_status_enum" AS ENUM('UNVERIFIED', 'VERIFIED', 'SUSPENDED')
        `);
        await queryRunner.query(`
            CREATE TABLE "shop" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(100) NOT NULL,
                "description" character varying(200) NOT NULL,
                "address" character varying NOT NULL,
                "phone_number" character varying NOT NULL,
                "email" character varying NOT NULL,
                "avatar" character varying NOT NULL DEFAULT '',
                "banner" character varying NOT NULL DEFAULT '',
                "status" "public"."shop_status_enum" NOT NULL DEFAULT 'UNVERIFIED',
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "user_id" uuid NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_shop_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_shop_name" ON "shop" ("name")
            WHERE "deleted_at" IS NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "image"
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "full_name" character varying(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "phone_number" character varying NOT NULL DEFAULT ''
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "avatar" character varying NOT NULL DEFAULT ''
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."user_role_enum" AS ENUM('USER', 'ADMIN')
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "role" "public"."user_role_enum" NOT NULL DEFAULT 'USER'
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."user_status_enum" AS ENUM('UNVERIFIED', 'VERIFIED', 'BANNED')
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "status" "public"."user_status_enum" NOT NULL DEFAULT 'UNVERIFIED'
        `);
        await queryRunner.query(`
            ALTER TABLE "shop"
            ADD CONSTRAINT "FK_shop_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "shop" DROP CONSTRAINT "FK_shop_user"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "status"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."user_status_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "role"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."user_role_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "avatar"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "phone_number"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "full_name"
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "image" character varying NOT NULL DEFAULT ''
        `);
        await queryRunner.query(`
            DROP INDEX "public"."UQ_shop_name"
        `);
        await queryRunner.query(`
            DROP TABLE "shop"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."shop_status_enum"
        `);
    }

}
