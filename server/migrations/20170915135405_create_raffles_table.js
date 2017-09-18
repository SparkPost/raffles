exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('raffles', function (table) {
      table.increments('id').primary()
      table.string('name')
      table.string('localpart')
      table.string('campaign')
      table.json('email_data')
      table.text('description')
      table.integer('created_by').references('id').inTable('users')
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.integer('updated_by').references('id').inTable('users')
      table.timestamp('updated_at').defaultTo(knex.fn.now())
      table.integer('started_by').references('id').inTable('users')
      table.timestamp('started_at')
      table.integer('ended_by').references('id').inTable('users')
      table.timestamp('ended_at')
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([knex.schema.dropTableIfExists('raffles')])
}
