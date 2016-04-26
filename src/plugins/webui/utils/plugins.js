import Promise from 'bluebird'
import _ from 'lodash'
import { getDetailPlugins as modules } from '../../../plugins'

let apis = {};
let pages = {};
let routes = {};

const retrievePlugins = () => {
  return new Promise(resolve => {
    _.forEach(modules, ({ dir, plugin }) => {
      _.forEach(plugin.plugin_info, info => {
        if (info.api)
          apis[info.api] = info
      })
      if (plugin.pages)
        _.forEach(plugin.pages, page => {
          let newPage = _.assignIn(page, ({ dir }))
          pages[page.url] = newPage
          if (page.index)
            routes[page.url] = {
              url: page.url,
              name: _.capitalize(dir)
            }
        })
    })
    return resolve({ apis, pages, routes })
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
