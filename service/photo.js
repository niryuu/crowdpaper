var PhotoService = function() {
  this.new = function *(client, project_id, photo_url, filename) {
    var newResult = yield client.query_({
      name: 'newphoto',
      text: 'INSERT INTO manager.photo (project_id, photo_url, name) values ($1, $2, $3)',
      values: [project_id, photo_url, filename]
    })
    if(newResult) {
      var photo_id_result = yield client.query_("SELECT currval('manager.photo_id_seq') AS currval;")
      return photo_id_result.rows[0].currval
    }
  }
  this.updateUrl = function *(client, photo_id, photo_url, filename) {
    var updateResult = yield client.query_({
      name: 'updatephoto',
      text: 'UPDATE manager.photo SET photo_url = $1, filename = $2 WHERE id = $3',
      values: [photo_url, filename, photo_id]
    })
    return updateResult
  }
  this.fetchOne = function *(client, id) {
    var result = yield client.query_({
      name: 'photofetchone',
      text: 'SELECT * FROM manager.photo WHERE id = $1',
      values: [id]
    })
    return result.rows[0]
  }
  this.fetchByProject = function *(client, project_id, opt) {
    opt = opt ? opt : {} 
    opt.offset = opt.offset ? opt.offset : 0
    var queryLimit = opt.limit ? ' LIMIT $2 OFFSET $3' : ''
    var params = opt.limit ? [project_id, opt.limit, opt.offset] : [project_id]
    var result = yield client.query_(
      'SELECT * FROM manager.photo WHERE project_id = $1 ORDER BY id' + queryLimit,
      params
    )
    return result.rows
  }
  this.fetchAll = function *(client, opt) {
    var result = yield client.query_('SELECT * FROM manager.photo;')
    return result.rows
  }
}
module.exports = new PhotoService()
