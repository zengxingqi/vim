var mongoose = require('mongoose')
var kittySchema = mongoose.Schema({
  name: String
})

export {
  kittySchema
}
