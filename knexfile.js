module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.PGHOST || 'db',
      port: process.env.PGPORT || 5432,
      user: process.env.PGUSER || 'demo', 
      password: process.env.PGPASSWORD || 'demo', 
      database: process.env.PGDATABASE || 'demo'
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
};