const Model = require('../utils/model')
// const Entry = require('./entry')
const path = require('path')

class Raffle extends Model {
  static get tableName () {
    return 'raffles'
  }

  static findById (id) {
    return this.query()
      .where({ id })
      .first()
      .eager('entries')
  }

  static findByLocalpart (localpart) {
    return this.query()
      .where({ localpart })
      .whereNotNull('started_at')
      .where('started_at', '<', Raffle.knex().fn.now())
      .where(function () {
        this.whereNull('ended_at').orWhere(
          'ended_at',
          '>',
          Raffle.knex().fn.now()
        )
      })
      .first()
      .then(raffle => {
        if (!raffle) {
          throw new Error('RAFFLE_NOT_FOUND')
        }
        return raffle
      })
  }

  static findByStatus (status) {
    status = status.toLowerCase()
    if (status === 'active') {
      return this.query()
        .whereNotNull('started_at')
        .where('started_at', '<', Raffle.knex().fn.now())
        .where(function () {
          this.whereNull('ended_at').orWhere(
            'ended_at',
            '>',
            Raffle.knex().fn.now()
          )
        })
    } else if (status === 'inactive') {
      return this.query()
        .where('ended_at', '<', Raffle.knex().fn.now())
        .orWhereNull('started_at')
        .orWhere('started_at', '>', Raffle.knex().fn.now())
    }
  }

  update ({ by, query }) {
    query = query || {}
    query.updated_by = by
    query.updated_at = Raffle.knex().fn.now()
    return this.$query().updateAndFetchById(this.id, query)
  }

  start ({ by, at }) {
    return this.$query().update({
      started_by: by,
      started_at: at || Raffle.knex().fn.now()
    })
  }

  end ({ by, at }) {
    return this.$query().update({
      ended_by: by,
      ended_at: at || Raffle.knex().fn.now()
    })
  }

  addEmailEntry ({ email, reply_to, name, data }) {
    return this.$relatedQuery('entries')
      .where({ email })
      .then(entries => {
        if (entries.length) {
          // Dup Entry
          throw new Error('DUPLICATE_ENTRY')
        }
        return this.$relatedQuery('entries').insert({
          email,
          reply_to,
          name,
          data,
          raffle_id: this.id,
          source: 'email'
        })
        .eager('raffle')
      })
  }

  pickWinner () {
    return this.$relatedQuery('entries')
      .where({ is_winner: false })
      .orderByRaw('RANDOM()')
      .first()
      .then(winner => {
        return winner.update({
          is_winner: true
        })
      })
  }
}

Raffle.relationMappings = {
  entries: {
    relation: Model.HasManyRelation,
    modelClass: path.join(__dirname, '/entry'),
    join: {
      from: 'raffles.id',
      to: 'entries.raffle_id'
    }
  }
}

module.exports = Raffle
