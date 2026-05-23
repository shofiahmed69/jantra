import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoMigration1779541356628 implements MigrationInterface {
  name = 'AutoMigration1779541356628';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "stock_movements" ALTER COLUMN "product_id" TYPE uuid USING "product_id"::uuid`);
    await queryRunner.query(`ALTER TABLE "stock_movements" ALTER COLUMN "reference_id" TYPE uuid USING NULLIF("reference_id", '')::uuid`);
    await queryRunner.query(`ALTER TABLE "sale_items" ALTER COLUMN "sale_id" TYPE uuid USING "sale_id"::uuid`);
    await queryRunner.query(`ALTER TABLE "sale_items" ALTER COLUMN "product_id" TYPE uuid USING "product_id"::uuid`);
    await queryRunner.query(`ALTER TABLE "sale_returns" ALTER COLUMN "sale_id" TYPE uuid USING "sale_id"::uuid`);
    await queryRunner.query(`ALTER TABLE "sale_returns" ALTER COLUMN "sale_item_id" TYPE uuid USING "sale_item_id"::uuid`);
    await queryRunner.query(`ALTER TABLE "purchases" ALTER COLUMN "supplier_id" TYPE uuid USING NULLIF("supplier_id", '')::uuid`);
    await queryRunner.query(`ALTER TABLE "purchase_items" ALTER COLUMN "purchase_id" TYPE uuid USING "purchase_id"::uuid`);
    await queryRunner.query(`ALTER TABLE "purchase_items" ALTER COLUMN "product_id" TYPE uuid USING "product_id"::uuid`);
    await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "product_id" TYPE uuid USING NULLIF("product_id", '')::uuid`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "product_id" TYPE character varying`);
    await queryRunner.query(`ALTER TABLE "purchase_items" ALTER COLUMN "product_id" TYPE character varying`);
    await queryRunner.query(`ALTER TABLE "purchase_items" ALTER COLUMN "purchase_id" TYPE character varying`);
    await queryRunner.query(`ALTER TABLE "purchases" ALTER COLUMN "supplier_id" TYPE character varying`);
    await queryRunner.query(`ALTER TABLE "sale_returns" ALTER COLUMN "sale_item_id" TYPE character varying`);
    await queryRunner.query(`ALTER TABLE "sale_returns" ALTER COLUMN "sale_id" TYPE character varying`);
    await queryRunner.query(`ALTER TABLE "sale_items" ALTER COLUMN "product_id" TYPE character varying`);
    await queryRunner.query(`ALTER TABLE "sale_items" ALTER COLUMN "sale_id" TYPE character varying`);
    await queryRunner.query(`ALTER TABLE "stock_movements" ALTER COLUMN "reference_id" TYPE character varying`);
    await queryRunner.query(`ALTER TABLE "stock_movements" ALTER COLUMN "product_id" TYPE character varying`);
  }
}
