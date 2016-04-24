import path from 'path'
import fs from 'fs'

const dir = './src/plugins'

export const getPlugins = fs.readdirSync(dir).map(file => fs.statSync(path.join(dir, file)).isDirectory() ? require(`./plugins/${file}`) : false).filter(Boolean)

export const getDetailPlugins = fs.readdirSync(dir).map(file => fs.statSync(path.join(dir, file)).isDirectory() ? {
  dir: file,
  plugin: require(`./plugins/${file}`)
} : false).filter(Boolean)
