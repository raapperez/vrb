'use strict';

const db = require('../services/memory-db');
const _ = require('lodash');
const provincesModel = require('./provinces');

const isInvalid = property => {
    const x = property.long;
    const y = property.lat;
    const {beds, baths, area} = property;

    if(!_.isInteger(x)  || x < 0 || x > 1400) {
        return 'Wrong longitude value';
    }

    if(!_.isInteger(y)  || y < 0 || y > 1000) {
        return 'Wrong latitude value';
    }

    if(!_.isInteger(beds) || beds < 1 || beds > 5) {
        return 'Wrong beds value';
    }

    if(!_.isInteger(baths) || baths < 1 || baths > 4) {
        return 'Wrong baths value';
    }

    if(!_.isInteger(area) || area < 20 || area > 240) {
        return 'Wrong area value';
    }

    return false;
};

const get = id => {
    return db.getProperty(id).then(property => {
        if(!property) {
            return null;
        }

        property.provinces = provincesModel.getLocationProvinces(property.long, property.lat);
        return property;
    });
};

const create = property => {
    return db.addProperty(property);
};

const list = (ax, ay, bx, by) => {
    return db.getProprtiesInBox(ax, ay, bx, by).map(property => {
        property.provinces = provincesModel.getLocationProvinces(property.long, property.lat);
        return property;
    });

};


module.exports.isInvalid = isInvalid;
module.exports.get = get;
module.exports.create = create;
module.exports.list = list;