// seeds/simple_seed.js
export async function seed(knex) {
  // clear in order
  await knex('bookings').del();
  await knex('employees').del();

  // insert employees
  const [aliceId] = await knex('employees').insert(
    { name: 'Alice', email: 'alice@example.com' },
    ['id']
  );
  const [bobId] = await knex('employees').insert(
    { name: 'Bob', email: 'bob@example.com' },
    ['id']
  );
  const [caraId] = await knex('employees').insert(
    { name: 'Cara', email: 'cara@example.com' },
    ['id']
  );

  // insert bookings (map room → tableId, pick one date each)
  await knex('bookings').insert([
    { tableId: 101, date: '2025-09-20', employeeId: aliceId.id },
    { tableId: 102, date: '2025-09-21', employeeId: bobId.id },
    { tableId: 201, date: '2025-09-25', employeeId: caraId.id },
  ]);
}