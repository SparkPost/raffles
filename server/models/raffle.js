const { raw } = require('objection');
const Model = require('../utils/model')
const Entry = require('./entry')

class Raffle extends Model {
  static get tableName () {
    return 'raffles'
  }

  static findById (id) {
    return this.query()
      .where({ id })
      .first()
  }

  static findByLocalpart (localpart) {
    return this.query()
      .where({ localpart })
      .first()
  }

  update({ by, query }) {
    return this.$query().update({
      updated_by: by,
      updated_at: Raffle.knex().fn.now(),
    }).update(query || {})
  }

  start({ by, at }) {
    return this.$query().update({
      started_by: by,
      started_at: at ||  Raffle.knex().fn.now()
    })
  }

  end({ by, at }) {
    return this.$query().update({
      ended_by: by,
      ended_at: at ||  Raffle.knex().fn.now()
    })
  }

  pickWinner() {
    this.$relatedQuery('entries')
      .where({ is_winner: false })
      .orderBy(raw('random'))
      .first()
      .then(winner => {
        return winner.$query.update({
          is_winner: true
        } })
      });
  }
}

Raffle.relationMappings = {
  entries: {
    relation: Model.HasManyRelation,
    modelClass: Entry,
    join: {
      from: 'raffle.id',
      to: 'entry.raffle_id'
    }
  }
}

module.exports = Raffle
