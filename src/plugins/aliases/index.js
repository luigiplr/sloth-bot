import { _getUserAliases, Aliases } from '../../database'
import { findUser } from '../../slack.js'
import { capitalize } from 'lodash'

export const plugin_info = [{
  alias: ['alias'],
  command: 'alias',
  usage: 'alias [user] [set|view|delete] [service]'
}]

const validServices = ['steam', 'overwatch']

export function alias(sender, channel, input, ts, plugins, userLevel) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: alias [user] [set|view|delete] [service] [value] - Sets a users alias for a service (steam, overwatch)'})
    var [username, method, service, userAlias] = input.split(' ')
    var usernameIsNotName = username.match(/^(set|view|del|delete)$/)
    if (usernameIsNotName) {
      userAlias = service
      service = method
      method = username
    }
    service = service ? service.toLowerCase() : undefined
    var user = findUser(usernameIsNotName ? sender.id : username)
    if (!user && username.startsWith('@')) {
      username = username.slice(1)
      user = { name: username, id: username }
    } else if (!user) {
      return reject("Invalid username specified, `@name` is required")
    }
    if (service && !validServices.includes(service)) return reject(`Invalid service, valid services are ${validServices.join('|')}`)
    switch (method) {
      case 'set':
        if (sender.id !== user.id && userLevel !== 'superadmin') return reject("You can't edit other peoples aliases")
        if (!service) return reject("You need to specify a service (steam, overwatch, etc..)")
        if (!userAlias) return reject("You need to specify an alias")
        _getUserAliases(user.id, service).then(data => {
          var previousAlias
          if (data[0]) {
            previousAlias = data[0].alias
          }
          data = data[0] || new Aliases()
          data.user = user.id
          data.service = service
          data.alias = userAlias
          return data.Persist().then(() => {
            resolve({ type: 'channel', message: `Successfully set alias for ${user.name} for service \`${service}\` with the alias \`${userAlias}\`` + 
            (previousAlias ? `\n*Previous alias was* \`${previousAlias}\`` : '')})
          })
        }).catch(err => {
          console.error(err)
          return reject("Error: sumfin went wrong")
        })
        break
      case 'delete':
      case 'del':
        if (sender.id !== user.id && userLevel !== 'superadmin') return reject("You can't delete other peoples aliases")
        if (!service) return reject("You need to specify a service (steam, overwatch, etc..)")
        _getUserAliases(user.id, service).then(data => {
          if (!data[0]) return reject("User has no alias for this service")
          return data[0].Delete().then(() => {
            resolve({ type: 'channel', message: `Successfully removed users alias for \`${service}\``})
          })
        }).catch(err => {
          console.error(err)
          return reject("Error: sumfin went wrong")
        })
        break
      default:
      case 'view':
        _getUserAliases(user.id).then(data => {
          if (!data.length) return reject("User has no aliases set")
          return resolve({ type: 'channel', message: `*Aliases found for ${user.name}:*\n` + data.map(a => ` > ${capitalize(a.service)} - ${a.alias}`).join('\n')})
        }).catch(err => {
          console.error(err)
          return reject("Error: sumfin went wrong")
        })
        break
    }
      
  })
}