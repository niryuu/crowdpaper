var crypto = require('crypto')
var UserService = function() {
  var hashPassword = function (password, salt) {
    return function (fn) {
      crypto.pbkdf2(password, salt, 100, 64, function(err, derivedKey) {
        if(err) {
          fn(err)
        } else {
          var crypted_password = Buffer(derivedKey, 'binary').toString('hex')
          fn(err, crypted_password)
        }
      })
    }
  }
  this.register = function *(client, username, password) {
    var salt = Math.round((new Date().valueOf() * Math.random())) + ''
    var hashed_password = yield hashPassword(password, salt)
    return yield client.query_({
      name: 'registeruser',
      text: 'INSERT INTO manager.user (username, password, salt, role) values ($1, $2, $3, $4)',
      values: [username, hashed_password, salt, 'user']
    })
  }
  this.auth = function *(client, username, password) {
    var userResult = yield client.query_({
      name: 'selectuser',
      text: 'SELECT * from manager.user where username = $1',
      values: [username]
    })
    if(userResult.rowCount === 0) throw new Error('User name is wrong')
    var hashed_password = yield hashPassword(password, userResult.rows[0].salt)
    if(hashed_password !== userResult.rows[0].password) throw new Error('Password is wrong')
    return userResult.rows[0]
  }
}
module.exports = new UserService()
