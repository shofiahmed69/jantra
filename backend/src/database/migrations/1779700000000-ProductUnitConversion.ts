import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductUnitConversion1779700000000 implements MigrationInterface {
  name = 'ProductUnitConversion1779700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "pieces_per_strip" integer NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "strips_per_box" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN IF EXISTS "strips_per_box"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN IF EXISTS "pieces_per_strip"`);
  }
}
