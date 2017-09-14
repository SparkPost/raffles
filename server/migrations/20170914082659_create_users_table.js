exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('users', function (table) {
      table.increments('id').primary()
      table.string('google_id').unique()
      table.string('email').unique()
      table.string('first_name')
      table.string('last_name')
      table.timestamp('last_signin')
      table.timestamp('created_at').defaultTo(knex.fn.now())
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([knex.schema.dropTableIfExists('users')])
}
