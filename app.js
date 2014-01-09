var koa = require('koa')
    ,koaPg = require('koa-pg')
    ,session = require('koa-sess')
    ,redisStore = require('koa-redis')
    ,router = require('koa-router')
    ,serve = require('koa-static')
    ,views = require('koa-render')
    ,acl = require('./lib/acl')

var app = koa()
app.name = 'lod'
app.keys = ['hoge', 'hoge']

app.use(session({store:redisStore()}))
app.use(koaPg('postgres://postgres:postgres@localhost:5432/lod'))
app.use(serve(__dirname + '/static'))
app.use(acl({default: ['guest', 'user']}))
app.use(function *(next) {
  if(this.session.role) this.role = this.session.role
  else this.role = 'guest'
  yield next
})
app.use(views('./views'))
app.use(router(app))
require('./controllers/all')(app)

app.listen(3000)

