import path from 'path'
import fs from 'fs'
import _ from 'lodash'
import config from '../config'

require('@babel/register')({
  only: '/plugins'
})

const disabledPlugins = config.disabledPlugins || []

const notDisabledFilter = plugin => !disabledPlugins.includes(plugin)
const getValidPlugins = dir => fs.readdirSync(dir).filter(file => fs.statSync(path.join(dir, file)).isDirectory())

let basePlugins = getValidPlugins('./src/plugins')
let customPlugins = fs.existsSync('./plugins') ? getValidPlugins('./plugins') : []

if (_.intersection(basePlugins, customPlugins).length > 0) {
  console.error('Duplicate plugin names detected in custom plugins! Duplicate names are not allowed!')
  process.exit()
}

basePlugins = basePlugins.filter(notDisabledFilter)
customPlugins = customPlugins.filter(notDisabledFilter)

export const loadedPlugins = {
  base: basePlugins,
  custom: customPlugins
}

export default [
  ...basePlugins.map(plugin => require(`./plugins/${plugin}`)),
  ...customPlugins.map(plugin => require(`../plugins/${plugin}`))
]
