import Promise from 'bluebird';

export const plugin_info = [{
  alias: ['lod'],
  command: 'lod',
  usage: 'lod <person>'
}]

module.exports = {
  lod(user, channel, input = '') {
    return new Promise(resolve => {
      return resolve({
        type: 'channel',
        message: 'ಠ_ಠ ' + input
      });
    });
  }
};

