import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1779541013055 implements MigrationInterface {
    name = 'AutoMigration1779541013055'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "owners" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "email" character varying(150) NOT NULL, "password_hash" character varying(255) NOT NULL, "phone" character varying(20), "shop_name" character varying(150) NOT NULL, "shop_address" text, "avatar_url" character varying(255), CONSTRAINT "UQ_df4ef717018c5dc7bd3f4ab0de5" UNIQUE ("email"), CONSTRAINT "PK_42838282f2e6b216301a70b02d6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(150) NOT NULL, "image_url" character varying(255), "barcode" character varying(100), "category_id" uuid, "brand_name" character varying(100), "generic_name" character varying(150), "batch_number" character varying(100), "expiry_date" date, "cost_price" numeric(10,2) NOT NULL, "selling_price" numeric(10,2) NOT NULL, "stock_quantity" integer NOT NULL DEFAULT '0', "min_stock_alert" integer NOT NULL DEFAULT '10', "unit_type" character varying(30) NOT NULL, "description" text, "deleted_at" TIMESTAMP, CONSTRAINT "UQ_adfc522baf9d9b19cd7d9461b7e" UNIQUE ("barcode"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stock_movements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "product_id" character varying NOT NULL, "movement_type" character varying(30) NOT NULL, "quantity" integer NOT NULL, "reference_id" character varying, "note" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_57a26b190618550d8e65fb860e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sales" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "invoice_number" character varying(30) NOT NULL, "sale_date" TIMESTAMP NOT NULL DEFAULT now(), "subtotal" numeric(10,2) NOT NULL, "discount_amount" numeric(10,2) NOT NULL DEFAULT '0', "tax_amount" numeric(10,2) NOT NULL DEFAULT '0', "total_amount" numeric(10,2) NOT NULL, "payment_method" character varying(20) NOT NULL, "payment_reference" character varying(100), "status" character varying(20) NOT NULL DEFAULT 'completed', "note" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_3f1da02a3f6f2c6bc753f859011" UNIQUE ("invoice_number"), CONSTRAINT "PK_4f0bc990ae81dba46da680895ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sale_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sale_id" character varying NOT NULL, "product_id" character varying NOT NULL, "product_name" character varying(150) NOT NULL, "quantity" integer NOT NULL, "cost_price" numeric(10,2) NOT NULL, "unit_price" numeric(10,2) NOT NULL, "discount_percent" numeric(5,2) NOT NULL DEFAULT '0', "line_total" numeric(10,2) NOT NULL, "profit" numeric(10,2) NOT NULL, CONSTRAINT "PK_5a7dc5b4562a9e590528b3e08ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sale_returns" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sale_id" character varying NOT NULL, "sale_item_id" character varying NOT NULL, "quantity_returned" integer NOT NULL, "refund_amount" numeric(10,2) NOT NULL, "reason" text, "return_date" TIMESTAMP NOT NULL DEFAULT now(), "restock" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_0dacb97f81ef1ca47f61409f844" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "expenses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "category" character varying(50) NOT NULL, "description" character varying(255) NOT NULL, "amount" numeric(10,2) NOT NULL, "expense_date" date NOT NULL, "note" text, "deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_94c3ceb17e3140abc9282c20610" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "suppliers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(150) NOT NULL, "contact_person" character varying(100), "phone" character varying(20), "email" character varying(150), "address" text, "note" text, "deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b70ac51766a9e3144f778cfe81e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "purchases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "supplier_id" character varying, "purchase_date" date NOT NULL, "invoice_ref" character varying(100), "total_cost" numeric(10,2) NOT NULL, "payment_status" character varying(20) NOT NULL DEFAULT 'paid', "amount_paid" numeric(10,2) NOT NULL DEFAULT '0', "note" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1d55032f37a34c6eceacbbca6b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "purchase_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "purchase_id" character varying NOT NULL, "product_id" character varying NOT NULL, "quantity" integer NOT NULL, "cost_per_unit" numeric(10,2) NOT NULL, "batch_number" character varying(100), "expiry_date" date, "line_total" numeric(10,2) NOT NULL, CONSTRAINT "PK_e3d9bea880baad86ff6de3290da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying(30) NOT NULL, "product_id" character varying, "message" text NOT NULL, "is_read" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activity_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "action" character varying(100) NOT NULL, "entity" character varying(50) NOT NULL, "entity_id" character varying, "details" jsonb, "ip_address" character varying(45), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f25287b6140c5ba18d38776a796" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_9a5f6868c96e0069e699f33e124" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_9a5f6868c96e0069e699f33e124"`);
        await queryRunner.query(`DROP TABLE "activity_logs"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TABLE "purchase_items"`);
        await queryRunner.query(`DROP TABLE "purchases"`);
        await queryRunner.query(`DROP TABLE "suppliers"`);
        await queryRunner.query(`DROP TABLE "expenses"`);
        await queryRunner.query(`DROP TABLE "sale_returns"`);
        await queryRunner.query(`DROP TABLE "sale_items"`);
        await queryRunner.query(`DROP TABLE "sales"`);
        await queryRunner.query(`DROP TABLE "stock_movements"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "owners"`);
    }

}
