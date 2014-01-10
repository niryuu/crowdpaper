var crypto = require('crypto')
var ProjectService = function() {
  var colToArray = function(cols) {
    var colArray = cols.split(',')
    var colString = JSON.stringify(colArray).replace(/\[/, '{').replace(/\]/, '}')
    return colString
  }
  this.new = function *(client, user_id, title, description, cols) {
    var colArray = colToArray(cols)
    var newResult = yield client.query_({
      name: 'newproject',
      text: 'INSERT INTO manager.project (user_id, title, description, schema) values ($1, $2, $3, $4)',
      values: [user_id, title, description, colArray]
    })
    console.log(newResult)
    var project_id_result = yield client.query_("SELECT currval('manager.project_id_seq') AS currval;")
    return project_id_result.rows[0].currval
  }
  this.fetchOne = function *(client, id) {
    var result = yield client.query_({
      name: 'projectfetchone',
      text: 'SELECT * FROM manager.project WHERE id = $1',
      values: [id]
    })
    return result.rows[0]
  }
}
module.exports = new ProjectService()
