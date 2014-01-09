module.exports = function(opt) {
  var acls = {}
  for(var route in opt) {
    acls[route] = {}
    for(var i in opt[route]) {
      acls[route][opt[route][i]] = []
    }
  }
  return function *acl(next) {
    this.checkAcl = function(route) {
      if(!acls[route]) {
        if(acls.default[this.role]) {
          return true
        } else {
          return false
        }
      } else if(this.role in acls[route]) {
        return true
      } else {
        return false
      }
    }
    yield next
  }
}
