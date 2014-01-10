var parse = require('co-body')
var UserService = require('../service/user')
//var ProjectService = require('../service/project')
//var DataService = require('../service/data')
module.exports = function (app){
  app.get('/', function *(next){
    this.body = yield this.render('index.ejs', {role: this.role})
    yield next
  })
  app.get('/signup', function *(next){
    this.body = yield this.render('signup.ejs', {role: this.role})
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
    this.body = yield this.render('login.ejs', {role: this.role})
    yield next
  })
  app.post('/login', function *(next){
    var postData = yield parse(this)
    if(!postData.username) this.throw(400, 'username required')
    if(!postData.password) this.throw(400, 'pasword required')
    try {
      var result = yield *UserService.auth(this.pg.db.client, postData.username, postData.password)
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
    this.body = yield this.render('projects.ejs', {role: this.role})
    yield next
  })
  app.get('/project/new', function *(next){
    this.body = yield this.render('project_new.ejs', {role: this.role})
    yield next
  })
  app.post('/project/new', function *(next){
    this.body = yield this.render('project.ejs', {role: this.role})
    yield next
  })
  app.get('/project/view/:id', function *(next){
    this.body = yield this.render('project.ejs', {role: this.role})
    yield next
  })
  app.get('/edit/:id', function *(next){
    this.body = yield this.render('edit.ejs', {role: this.role})
    yield next
  })
  app.post('/edit/:id', function *(next){
    this.body = yield this.render('edit.ejs', {role: this.role})
    yield next
  })
}
