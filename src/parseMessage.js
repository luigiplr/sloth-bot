import _ from 'lodash';
import path from 'path';
import Promise from 'bluebird';
import {
    init as database
}
from './database';
import {
    find as findPlugins
}
from './utils/plugins';

database();

var plugins = [];

findPlugins().forEach(plugin => {
    plugins.push(require('./plugins/' + plugin))
});

module.exports = {
    parse(user, channel, text) {

        let command = text.substr(1).split(' ')[0];

        console.log(command);


        return new Promise((resolve, reject) => {




        });




    },


};