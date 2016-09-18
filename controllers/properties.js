'use strict';

const propertiesModel = require('../models/properties');
const _ = require('lodash');

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

    const id = parseInt(req.params.id);

    if(!_.isInteger(id)) {
        const error = new Error('Invalid id');
        error.status = 400;
        next(error);
        return;
    }

    propertiesModel.get(id).then(property => {
       
        if(!property) {
            res.status(404).end();
            return;
        }

        res.status(200).json(property);
    }).catch(err => {
        next(err);
    });
};


module.exports.list = (req, res, next) => {

    let {ax, ay, bx, by} = req.query;

    if(typeof ax === 'undefined' || typeof ay === 'undefined' || typeof bx === 'undefined' || typeof by === 'undefined') {
        const error = new Error('This method requires query params ax, ay, bx and by');
        error.status = 400;
        next(error);
        return;
    }

    ax = parseInt(ax);
    ay = parseInt(ay);
    bx = parseInt(bx);
    by = parseInt(by);

    if(ax > bx || ay < by) {
        const error = new Error('The query param "bx" must be greater or equal "ax" and "ay" must be greater or equal "by"');
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