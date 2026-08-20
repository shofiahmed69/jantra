import { MigrationInterface, QueryRunner } from 'typeorm';

/** Idempotent safety net if MultiPharmacy was skipped or partially applied. */
export class MultiPharmacyEnsure1779810000000 implements MigrationInterface {
  name = 'MultiPharmacyEnsure1779810000000';

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

    for (const table of [
      'owners',
      'products',
      'categories',
      'suppliers',
      'sales',
      'purchases',
      'expenses',
      'notifications',
      'activity_logs',
    ]) {
      await queryRunner.query(`ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "pharmacy_id" uuid`);
    }

    await queryRunner.query(`
      INSERT INTO "pharmacies" ("name", "status")
      SELECT 'Jantra Pharmacy', 'active'
      WHERE NOT EXISTS (SELECT 1 FROM "pharmacies" LIMIT 1)
    `);

    const defaultPharmacy = await queryRunner.query(`SELECT "id" FROM "pharmacies" ORDER BY "created_at" ASC LIMIT 1`);
    const pid = defaultPharmacy[0]?.id;
    if (!pid) return;

    for (const table of ['owners', 'products', 'categories', 'suppliers', 'sales', 'purchases', 'expenses', 'notifications', 'activity_logs']) {
      await queryRunner.query(`UPDATE "${table}" SET "pharmacy_id" = $1 WHERE "pharmacy_id" IS NULL`, [pid]);
    }

    for (const table of ['owners', 'products', 'categories', 'suppliers', 'sales', 'purchases', 'expenses']) {
      await queryRunner.query(`ALTER TABLE "${table}" ALTER COLUMN "pharmacy_id" SET NOT NULL`).catch(() => undefined);
    }
  }

  public async down(): Promise<void> {
    /* keep data on rollback */
  }
}
