const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, requried: true },
    price: { type: Number, required: true },
    productImage: {type: String, requried: true}
})

module.exports = mongoose.model('Product', productSchema);