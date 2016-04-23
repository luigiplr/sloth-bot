import Promise from 'bluebird'
import _ from 'lodash'
import { getPlugins as plugins } from '../../../plugins'

let apis = {};
let pages = {};

const retrievePlugins = () => {
  return new Promise(resolve => {
    _.forEach(plugins, plugin => {
      _.forEach(plugin.plugin_info, info => {
        if (info.api)
          apis[info.api] = info
      })
      if (plugin.pages)
        _.forEach(plugin.pages, page => pages[page.url] = page)

      return;
    })
    return resolve({ apis, pages })
  })
}

export function getPlugins() {
  return new Promise(resolve => {
    _.delay(() => {
      retrievePlugins().then(daPlugs => {
        return resolve(daPlugs)
      })
    }, 500)
  })
}
