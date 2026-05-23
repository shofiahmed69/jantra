const { DataSource } = require('typeorm');
const { buildTypeOrmOptions } = require('../dist/src/database/typeorm.config');

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log('DATABASE_URL not set — skipping migrations.');
    return;
  }

  const dataSource = new DataSource({
    ...buildTypeOrmOptions(),
    migrations: ['dist/src/database/migrations/*.js'],
  });

  await dataSource.initialize();
  await dataSource.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  const ran = await dataSource.runMigrations();
  console.log(`Ran ${ran.length} migration(s).`);
  await dataSource.destroy();
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
