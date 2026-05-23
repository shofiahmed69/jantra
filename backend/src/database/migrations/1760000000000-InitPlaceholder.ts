import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitPlaceholder1760000000000 implements MigrationInterface {
  name = 'InitPlaceholder1760000000000';

  public async up(_: QueryRunner): Promise<void> {}
  public async down(_: QueryRunner): Promise<void> {}
}
