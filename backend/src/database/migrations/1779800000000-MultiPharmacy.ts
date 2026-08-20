import { MigrationInterface, QueryRunner } from 'typeorm';

export class MultiPharmacy1779800000000 implements MigrationInterface {
  name = 'MultiPharmacy1779800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "pharmacies" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "name" character varying(150) NOT NULL,
        "address" text,
        "status" character varying(20) NOT NULL DEFAULT 'active',
        CONSTRAINT "PK_pharmacies" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`ALTER TABLE "owners" ADD COLUMN IF NOT EXISTS "pharmacy_id" uuid`);
    await queryRunner.query(`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "pharmacy_id" uuid`);
    await queryRunner.query(`ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "pharmacy_id" uuid`);
    await queryRunner.query(`ALTER TABLE "suppliers" ADD COLUMN IF NOT EXISTS "pharmacy_id" uuid`);
    await queryRunner.query(`ALTER TABLE "sales" ADD COLUMN IF NOT EXISTS "pharmacy_id" uuid`);
    await queryRunner.query(`ALTER TABLE "purchases" ADD COLUMN IF NOT EXISTS "pharmacy_id" uuid`);
    await queryRunner.query(`ALTER TABLE "expenses" ADD COLUMN IF NOT EXISTS "pharmacy_id" uuid`);
    await queryRunner.query(`ALTER TABLE "notifications" ADD COLUMN IF NOT EXISTS "pharmacy_id" uuid`);
    await queryRunner.query(`ALTER TABLE "activity_logs" ADD COLUMN IF NOT EXISTS "pharmacy_id" uuid`);

    await queryRunner.query(`
      INSERT INTO "pharmacies" ("name", "address", "status")
      SELECT COALESCE(o."shop_name", 'Jantra Pharmacy'), o."shop_address", 'active'
      FROM "owners" o
      ORDER BY o."created_at" ASC
      LIMIT 1
    `).catch(() => undefined);

    await queryRunner.query(`
      INSERT INTO "pharmacies" ("name", "status")
      SELECT 'Jantra Pharmacy', 'active'
      WHERE NOT EXISTS (SELECT 1 FROM "pharmacies" LIMIT 1)
    `);

    const defaultPharmacy = await queryRunner.query(`SELECT "id" FROM "pharmacies" ORDER BY "created_at" ASC LIMIT 1`);
    const pid = defaultPharmacy[0]?.id;
    if (!pid) return;

    await queryRunner.query(`UPDATE "owners" SET "pharmacy_id" = $1 WHERE "pharmacy_id" IS NULL`, [pid]);
    await queryRunner.query(`UPDATE "products" SET "pharmacy_id" = $1 WHERE "pharmacy_id" IS NULL`, [pid]);
    await queryRunner.query(`UPDATE "categories" SET "pharmacy_id" = $1 WHERE "pharmacy_id" IS NULL`, [pid]);
    await queryRunner.query(`UPDATE "suppliers" SET "pharmacy_id" = $1 WHERE "pharmacy_id" IS NULL`, [pid]);
    await queryRunner.query(`UPDATE "sales" SET "pharmacy_id" = $1 WHERE "pharmacy_id" IS NULL`, [pid]);
    await queryRunner.query(`UPDATE "purchases" SET "pharmacy_id" = $1 WHERE "pharmacy_id" IS NULL`, [pid]);
    await queryRunner.query(`UPDATE "expenses" SET "pharmacy_id" = $1 WHERE "pharmacy_id" IS NULL`, [pid]);
    await queryRunner.query(`UPDATE "notifications" SET "pharmacy_id" = $1 WHERE "pharmacy_id" IS NULL`, [pid]);
    await queryRunner.query(`UPDATE "activity_logs" SET "pharmacy_id" = $1 WHERE "pharmacy_id" IS NULL`, [pid]);

    await queryRunner.query(`ALTER TABLE "owners" ALTER COLUMN "pharmacy_id" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "pharmacy_id" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "pharmacy_id" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "suppliers" ALTER COLUMN "pharmacy_id" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "sales" ALTER COLUMN "pharmacy_id" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "purchases" ALTER COLUMN "pharmacy_id" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "expenses" ALTER COLUMN "pharmacy_id" SET NOT NULL`);

    await queryRunner.query(`
      ALTER TABLE "owners"
      ADD CONSTRAINT "FK_owners_pharmacy" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies"("id") ON DELETE RESTRICT
    `).catch(() => undefined);

    await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "UQ_adfc522baf9d9b19cd7d9461b7e"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_adfc522baf9d9b19cd7d9461b7e"`);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_products_pharmacy_barcode"
      ON "products" ("pharmacy_id", "barcode")
      WHERE "barcode" IS NOT NULL AND "barcode" <> ''
    `);

    await queryRunner.query(`ALTER TABLE "sales" DROP CONSTRAINT IF EXISTS "UQ_sales_invoice"`);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_sales_pharmacy_invoice"
      ON "sales" ("pharmacy_id", "invoice_number")
    `);

    await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT IF EXISTS "UQ_categories_name"`);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_categories_pharmacy_name"
      ON "categories" ("pharmacy_id", "name")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_categories_pharmacy_name"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_sales_pharmacy_invoice"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_products_pharmacy_barcode"`);
    await queryRunner.query(`ALTER TABLE "owners" DROP CONSTRAINT IF EXISTS "FK_owners_pharmacy"`);
    for (const table of ['activity_logs', 'notifications', 'expenses', 'purchases', 'sales', 'suppliers', 'categories', 'products', 'owners']) {
      await queryRunner.query(`ALTER TABLE "${table}" DROP COLUMN IF EXISTS "pharmacy_id"`);
    }
    await queryRunner.query(`DROP TABLE IF EXISTS "pharmacies"`);
  }
}
