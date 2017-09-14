const Model = require('../utils/model')

class User extends Model {
  static get tableName () {
    return 'users'
  }

  static findById (id) {
    return this.query()
      .where({ id })
      .first()
  }

  static findByGoogleId (googleId) {
    return this.query()
      .where({ google_id: googleId })
      .first()
  }
}

module.exports = User
