exports.up = function(knex) {
     return knex.schema.createTable('employees', (table) => {
       table.increments('id').primary();
       table.string('name', 255).notNullable();
       table.string('email', 255).notNullable().unique();
       table.timestamp('created_at').defaultTo(knex.fn.now());
     });
   };

   exports.down = function(knex) {
     return knex.schema.dropTable('employees');
   };