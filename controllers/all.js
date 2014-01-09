module.exports = function (app){
  app.get('/', function *(next){
    this.body = yield this.render('index.ejs')
  })
  app.get('/signup', function *(next){
    this.body = yield this.render('index.ejs')
  })
  app.post('/signup', function *(next){
    this.body = yield this.render('index.ejs')
  })
  app.get('/login', function *(next){
    this.body = yield this.render('index.ejs')
  })
  app.post('/login', function *(next){
    this.body = yield this.render('index.ejs')
  })
  app.get('/project', function *(next){
    this.body = yield this.render('index.ejs')
  })
  app.get('/project/:id', function *(next){
    this.body = yield this.render('index.ejs')
  })
  app.get('/edit/:id', function *(next){
    this.body = yield this.render('index.ejs')
  })
  app.post('/edit/:id', function *(next){
    this.body = yield this.render('index.ejs')
  })
}
