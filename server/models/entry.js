const Model = require('../utils/model')
// const Raffle = require('./raffle')
const path = require('path')

class Entry extends Model {
  static get tableName () {
    return 'entries'
  }

  static findById (id) {
    return this.query()
      .where({ id })
      .first()
  }

  update (query) {
    query = query || {}
    return this.$query().updateAndFetchById(this.id, query)
  }

  static get relationMappings () {
    return {
      raffle: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, '/raffle'),
        join: {
          from: 'entries.raffle_id',
          to: 'raffles.id'
        }
      }
    }
  }
}

module.exports = Entry
