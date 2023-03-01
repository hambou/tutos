const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/products');

exports.get_all = (req, res, next) => {
    Order
    .find()
    .select('_id product quantity')
    .populate('product', 'name')
    .exec()
    .then( docs => {
        res.status(200).json({
            count:docs.length,
            orders: docs.map( doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        description: 'Get more details about this order',
                        type: 'GET',
                        url: `http://localhost:3000/orders/${doc._id}`
                    }
                }
            })
        })
    } )
    .catch( err => {
        res.status(500).json({
            error: err
        })
    } )
};

exports.create_order = (req, res, next) => {
    Product.findById(req.body.productId)
    .then( product => {
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        })
        return order.save()
    })
    .then( result => {
        res.status(201).json({
            message: 'order stored',
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity:result.quantity
            },
            request: {
                description: 'Get more details about this order',
                type: 'GET',
                url: `http://localhost:3000/orders/${result._id}`
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'product not created',
            error: err
        })
    })
};

exports.get_one = (req, res, next) => {
    Order.findById(req.params.orderId)
    .select('_id product quantity')
    .exec()
    .then( order => {
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            })
        }
        res.status(200).json({
            order,
            request: {
                description: 'Get all order list',
                type: 'GET',
                url: `http://localhost:3000/orders/`
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}

exports.delete_one = (req, res, next) => {
    Order.remove({ _id: req.params.orderId})
    .exec()
    .then( result => {
        res.status(200).json({
            message: 'Order deleted',
            request: {
                description: 'Create order',
                type: 'POST',
                url: `http://localhost:3000/orders/`,
                data: { _id: 'Product id', quantity: 'Number' }
            }
        })
    })
    .catch( err => {
        res.status(500).json({
            error: err
        })
    })
}