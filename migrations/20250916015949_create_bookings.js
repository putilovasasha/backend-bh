exports.up = function(knex) {
     return knex.schema.createTable('bookings', (table) => {
       table.increments('id').primary();
       table.integer('tableId').notNullable();
       table.date('date').notNullable();
       table.integer('employeeId').unsigned().references('employees.id').onDelete('CASCADE').notNullable();
       table.timestamp('created_at').defaultTo(knex.fn.now());
       table.unique(['tableId', 'date']);
     });
   };

   exports.down = function(knex) {
     return knex.schema.dropTable('bookings');
   };