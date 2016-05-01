import Promise from 'bluebird'

export const plugin_info = [{
  alias: ['csi'],
  command: 'csi',
  usage: 'csi'
}]

export function csi() {
  return new Promise(resolve => resolve({ type: 'channel', message: _genMessage() }))
}

// Credit to http://mcpubba.net/techgen.html & https://github.com/DoctorMcKay/steam-irc-bot for this amazing code
const _getFunny = list => list[Math.floor(Math.random() * list.length)]
const _genMessage = () => _getFunny(start) + _getFunny(verb) + _getFunny(noun) + _getFunny(preposition) + _getFunny(noun) + '.'
const start = [
  'The first thing we need to do is ',
  'To fix your problem, we have to ',
  'The hackers are getting in! Quickly, ',
  'To get in to the government database we\'re going to ',
  'Quickly! We have to ',
  'We can get rid of the virus, don\'t worry. First we have to '
]
const verb = [
  'reroute',
  'splice',
  'compile',
  'reprocess',
  'log',
  'port',
  'decrypt',
  'encrypt',
  'recode',
  'refactor',
  'import',
  'export',
  'modify',
  'uninstall',
  'install',
  'upload',
  'download',
  'open',
  'decode',
  'push',
  'recompile',
  'decompile',
  'write a GUI to track',
  'trace',
  'troubleshoot'
]
const noun = [
  ' the VGA cable',
  ' the USB',
  ' the browser',
  ' the interface',
  ' the Internet',
  ' the IP address',
  ' the source code',
  ' the hard drive',
  ' the RAM',
  ' the CPU',
  ' the motherboard',
  ' the monitor',
  ' the shortcut',
  ' the LAN',
  ' the Wi-Fi',
  ' the CAT5',
  ' the Bluetooth',
  ' the program',
  ' the encryption',
  ' the compiler',
  ' the IDE',
  ' Linux',
  ' Microsoft Word',
  ' the Google',
  ' the traceroute',
  ' the stack',
  ' C++',
  ' Java',
  ' JavaScript',
  ' C',
  ' C#',
  ' Python',
  ' the programming language',
  ' the SATA cable',
  ' the subnet mask',
  ' the Ethernet',
  ' the Ethernet adapter',
  ' the GPU',
  ' the keyboard',
  ' Internet Explorer',
  ' Ubuntu',
  ' the command prompt',
  ' the command line',
  ' HTTPS',
  ' FTP',
  ' SSH',
  ' Visual Basic'
]
const preposition = [
  ' through',
  ' into',
  ' with',
  ' on'
]
