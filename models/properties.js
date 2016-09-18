'use strict';

const db = require('../services/memory-db');
const _ = require('lodash');
const provincesModel = require('./provinces');

const isInvalid = property => {
    const {title, description, price, x, y, beds, baths, squareMeters} = property;

    if(typeof title !== 'string') {
        return 'Wrong title value';
    }

    if(typeof description !== 'string') {
        return 'Wrong description value';
    }

    if (!_.isInteger(price) || price <= 0) {
        return 'Wrong price value';
    }

    if (!_.isInteger(x) || x < 0 || x > 1400) {
        return 'Wrong x value';
    }

    if (!_.isInteger(y) || y < 0 || y > 1000) {
        return 'Wrong y value';
    }

    if (!_.isInteger(beds) || beds < 1 || beds > 5) {
        return 'Wrong beds value';
    }

    if (!_.isInteger(baths) || baths < 1 || baths > 4) {
        return 'Wrong baths value';
    }

    if (!_.isInteger(squareMeters) || squareMeters < 20 || squareMeters > 240) {
        return 'Wrong squareMeters value';
    }

    return false;
};

const get = id => {
    return db.getProperty(id).then(property => {
        if (!property) {
            return null;
        }

        return provincesModel.getLocationProvinces(property.x, property.y).then(provinces => {
            property.provinces = provinces.map(province => province.name);
            return property;
        });
    });
};

const create = property => {
    return db.addProperty(property).then(property => {
        if (!property) {
            return null;
        }

        return provincesModel.getLocationProvinces(property.x, property.y).then(provinces => {
            property.provinces = provinces.map(province => province.name);
            return property;
        });
    });
};

const list = (ax, ay, bx, by) => {
    return db.getProprtiesInBox(ax, ay, bx, by).then(properties => {

        return Promise.all(properties.map(property => {
            return provincesModel.getLocationProvinces(property.x, property.y).then(provinces => {
                property.provinces = provinces.map(province => province.name);
                return property;
            });
        })).then(() => properties);

    });
};


module.exports.isInvalid = isInvalid;
module.exports.get = get;
module.exports.create = create;
module.exports.list = list;