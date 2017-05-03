import path from 'path'
import fs from 'fs'
import config from '../config'

const dir = './src/plugins'
const disabled = config.disabledPlugins || []

export const getPlugins = fs.readdirSync(dir)
                          .map(file => (fs.statSync(path.join(dir, file)).isDirectory() && !disabled.includes(file)) ? require(`./plugins/${file}`) : false)
                          .filter(Boolean)
