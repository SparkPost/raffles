exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('entries', function (table) {
      table.increments('id').primary()
      table.integer('raffle_id').references('id').inTable('raffles')
      table.string('source')
      table.string('email')
      table.string('name')
      table.unique(['raffle_id', 'source', 'email'])
      table.string('reply_to')
      table.json('data')
      table.timestamp('created_at').defaultTo(knex.fn.now())
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([knex.schema.dropTableIfExists('entries')])
}
