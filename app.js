var koa = require('koa')
    ,koaPg = require('koa-pg')
    ,session = require('koa-sess')
    ,redisStore = require('koa-redis')
    ,router = require('koa-router')
    ,serve = require('koa-static')
    ,views = require('koa-render')
    ,pathToRegexp = require('path-to-regexp')

var app = koa()
app.name = 'lod'
app.keys = ['hoge', 'hoge']

app.use(session({store:redisStore()}))
app.use(koaPg('postgres://postgres:postgres@localhost:5432/lod'))
app.use(serve(__dirname + '/static'))
app.use(views('./views'))
//role setting
app.use(function *(next) {
  if(!this.session.role) {
    this.role = 'guest'
  }
  else this.role = this.session.role
  yield next
})
//access control
app.use(function *(next) {
  var acls = require('./acl')
  var granted = false
  for(var i in acls[this.role]) {
    if(this.url.match(pathToRegexp(acls[this.role][i], []))) {
      granted = true
    }
  }
  if(!granted) this.redirect('/')
  yield next
})
app.use(router(app))
require('./controllers/all')(app)

app.listen(3000)

