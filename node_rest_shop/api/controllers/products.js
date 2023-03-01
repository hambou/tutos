const Product = require('../models/products');
const mongoose = require('mongoose');

exports.get_all = ( req, res, next ) => {
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map( doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    request: {
                        type: 'GET',
                        url: `http://localhost:3000/products/${doc._id}`
                    }
                }
            } )
        }
        res.status(200)
        .json(response);
    })
    .catch(err => {
        res.status()
        .json({error: err})
    })
};

exports.get_one = (req, res, next) => {
    Product.findById(req.params.productId)
    .select('name price _id productImage')
    .exec()
    .then( doc => {
        if (doc) 
            res.status(200).json({
                product: doc,
                request: {
                    description: 'GET all products',
                    type: 'GET',
                    url: `http://localhost:3000/products/`
                }
            });
        else
            res.status(404).json({
                message: 'invalid ID'
            })
    } )
    .catch( err => {
        res.status(500).json({
            error: err
        })
    })
};

exports.delete_one = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id})
    .exec()
    .then(( result => {
        res.status(202)
        .json({
            message: 'Product deleted',
            request: {
                description: 'Creating new products',
                type: 'POST',
                body: {name: 'String', price: 'Number'},
                url: `http://localhost:3000/products/`
            }
        })
    }))
    .catch( err => {
        res.status(204)
        .json({
            error: err
        })
    } )
};

exports.create_one = ( req, res, next ) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: `http://localhost:3000/${req.file.path}`
    });
    console.log(`product === ${product}`, `Product MAJ === ${Product}`)
    product.save()
    .then( (result) =>{
        return res.status(200).json({
            message: 'Product created successfully',
            createdProduct: {
                _id: result._id,
                name: result.name,
                price: result.price,
                productImage: `http://localhost:3000/${req.file.path}`,
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/products/${result._id}`
                }
            }
        })
    })
    .catch( err => {
        console.log(err)
        return res.status(500).json({
             error: err
        })
    } )
};

exports.update_one = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body )
    {
        updateOps[ops.propName] = ops.value;
    }
    Product.findOneAndUpdate({_id: id}, { $set: updateOps})
    .exec()
    .then( result => {
        res.status(200)
        .json({
            message: `product updated`,
            request: {
                description: 'Get product details',
                type: 'GET',
                url: `http://localhost:3000/products/${result._id}`
            }
        })
    })
    .catch( err => {
        res.status(500)
        .json({
            error: err
        })
    })
}