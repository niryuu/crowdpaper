var parse = require('co-body')
var parse_multipart = require('co-busboy')
var fs = require('fs')
var UserService = require('../service/user')
var ProjectService = require('../service/project')
var PhotoService = require('../service/photo')
module.exports = function (app){
  app.get('/', function *(next){
    this.body = yield this.render('index.jade', {role: this.role})
    yield next
  })
  app.get('/signup', function *(next){
    this.body = yield this.render('signup.jade', {role: this.role})
    yield next
  })
  app.post('/signup', function *(next){
    var postData = yield parse(this)
    if(!postData.username) this.throw(400, 'username required')
    if(!postData.password) this.throw(400, 'pasword required')
    try {
      var result = yield UserService.register(this.pg.db.client, postData.username, postData.password)
      if(result) this.redirect('/')
    } catch(e) {
      this.throw(400, e)
    }
    yield next
  })
  app.get('/login', function *(next){
    this.body = yield this.render('login.jade', {role: this.role})
    yield next
  })
  app.post('/login', function *(next){
    var postData = yield parse(this)
    if(!postData.username) this.throw(400, 'username required')
    if(!postData.password) this.throw(400, 'pasword required')
    try {
      var result = yield UserService.auth(this.pg.db.client, postData.username, postData.password)
      if(result) {
        this.session.user_id = result.id
        this.session.role = result.role
        this.redirect('/')
      }
    } catch(e) {
      this.throw(400, e)
    }
    this.redirect('/')
    yield next
  })
  app.get('/logout', function *(next){
    this.session = null
    this.redirect('/')
    yield next
  })
  app.get('/project', function *(next){
    var projects = yield ProjectService.fetchAll(this.pg.db.client)
    this.body = yield this.render('projects.jade', {role: this.role, projects: projects})
    yield next
  })
  app.get('/project/my', function *(next){
    var projects = yield ProjectService.fetchByUser(this.pg.db.client, this.session.user_id)
    this.body = yield this.render('project_my.jade', {role: this.role, projects: projects})
    yield next
  })
  app.get('/project/new', function *(next){
    this.body = yield this.render('project_new.jade', {role: this.role})
    yield next
  })
  app.get('/project/edit/:project_id', function *(next) {
    var project = yield ProjectService.fetchOne(this.pg.db.client, this.params.project_id)
    var photos = yield PhotoService.fetchByProject(this.pg.db.client, this.params.project_id, {limit: 10, offset: 0})
    this.body = yield this.render('project_edit.jade', {role: this.role, project: project, photos: photos})
  })
  app.post('/project/photoupload/:project_id', function *(next) {
    var photo_id = yield PhotoService.new(this.pg.db.client, this.params.project_id)
    var parts = parse_multipart(this);
    var part;
    while (part = yield parts) {
      var ext = part.filename.split('.')[1]
      var stream = fs.createWriteStream('./static/photo/' + photo_id + '.' + ext);
      yield PhotoService.updateUrl(this.pg.db.client, photo_id, '/photo/' + photo_id + '.' + ext, part.filename)
      part.pipe(stream);
    }
    this.body = '{status: "OK"}'
  })
  app.post('/project/new', function *(next){
    var postData = yield parse(this)
    if(!postData.title) this.throw(400, 'title required')
    if(!postData.cols) this.throw(400, 'some column required')
    var result = yield ProjectService.new(this.pg.db.client, this.session.user_id, postData.title, postData.description, postData.cols)
    this.redirect('/project/view/' + result)
    yield next
  })
  app.get('/project/view/:id', function *(next){
    var project = yield ProjectService.fetchOne(this.pg.db.client, this.params.id)
    var photos = yield PhotoService.fetchByProject(this.pg.db.client, this.params.id, {})
    this.body = yield this.render('project.jade', {role: this.role, project: project, photos: photos})
    yield next
  })
  app.get('/project/input/:id', function *(next){
    var photo = yield PhotoService.fetchOne(this.pg.db.client, this.params.id)
    var project = yield ProjectService.fetchOne(this.pg.db.client, photo.project_id)
    this.body = yield this.render('input.jade', {role: this.role, project: project, photo: photo})
    yield next
  })
  app.post('/project/input/:id', function *(next){
    this.body = yield this.render('edit.ejs', {role: this.role})
    yield next
  })
}
