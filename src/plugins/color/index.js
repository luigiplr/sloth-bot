import Color from 'color'

export const plugin_info = [{
  alias: ['color'],
  command: 'colors',
  usage: 'color <color> - returns color info'
}]

export async function colors(user, channel, input) {
  if (!input) return { type: 'dm', message: 'Usage: color <color> - Returns color info, can enter most valid color types, hex/rgb/hsl/basic css colors' }

  try {
    const colorData = Color(input)

    return {
      type: 'channel',
      message: [
        `*Color Data for ${input} _(${colorData.hex().toString()})_*`,
        '```',
        `  HEX: ${colorData.hex().toString()}`,
        `  RGB: ${colorData.rgb().toString()}`,
        `LUMEN: ${colorData.luminosity().toFixed(4)}`,
        `LIGHT: ${colorData.lightness().toFixed(4)}`,
        '```'
      ].join('\n')
    }
  } catch (e) {
    throw 'Unable to parse color'
  }
}
