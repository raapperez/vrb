'use strict';

const propertiesModel = require('../models/properties');

module.exports.create = (req, res, next) => {

    const property = req.body;
    const errorMessage = propertiesModel.isInvalid(property);
    
    if(errorMessage) {
        const error = new Error(errorMessage);
        error.status = 400;
        next(error);
        return;
    }

    propertiesModel.create(property).then(property => {
        res.status(201).json(property);
    }).catch(err => {
        next(err);
    });
};

module.exports.get = (req, res, next) => {

    const id = req.params.id;

    propertiesModel.get(id).then(property => {
       
        if(!property) {
            res.status(404).end();
        }

        res.status(200).json(property);
    }).catch(err => {
        next(err);
    });
};


module.exports.list = (req, res, next) => {

    const {ax, ay, bx, by} = req.query;

    if(typeof ax === undefined || typeof ay === undefined || typeof bx === undefined || typeof by === undefined) {
        const error = new Error('This method requires query params ax, ay, bx and by');
        error.status = 400;
        next(error);
        return;
    }

    propertiesModel.list(ax, ay, bx, by).then(properties => {
        res.status(200).json({
            foundProperties: properties.length,
            properties
        });

    });
};