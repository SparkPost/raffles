const Model = require('../utils/model')
const Raffle = require('./raffle')

class Entry extends Model {
  static get tableName () {
    return 'entries'
  }

  static findById (id) {
    return this.query()
      .where({ id })
      .first()
  }
}

Entry.relationMappings = {
  raffle: {
    relation: Model.BelongsToOneRelation,
    modelClass: Raffle,
    join: {
      from: 'entry.raffle_id',
      to: 'raffle.id'
    }
  }
}

module.exports = Entry
