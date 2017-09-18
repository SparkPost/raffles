
exports.up = function(knex, Promise) {
  return knex.schema.table('entries', function (table) {
    table.boolean('is_winner').defaultTo(false)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('entries', function (table) {
    table.dropColumn('is_winner')
  })
};
