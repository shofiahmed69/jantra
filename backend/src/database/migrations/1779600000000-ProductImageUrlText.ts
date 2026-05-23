import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductImageUrlText1779600000000 implements MigrationInterface {
  name = 'ProductImageUrlText1779600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "image_url" TYPE text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "image_url" TYPE character varying(255)`);
  }
}
