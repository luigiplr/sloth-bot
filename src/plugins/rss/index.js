import RSSWatcher from 'rss-watcher'
import { sendMessage } from '../../slack'
import config from '../../../config.json'
import striptags from 'striptags'

if (config.feeds) {
  if (Array.isArray(config.feeds) && config.feeds[0] && config.feedsChannel) {
    config.feeds.forEach(feed => {
      let watcher = new RSSWatcher(feed.url)
      watcher.set({ feedUrl: feed.url, interval: 15 }) // I dunno
      watcher.on('new article', article => {
        sendMessage(config.feedsChannel, null, generateAttachment(article, feed))
      })
      watcher.run((err) => {
        if (err) console.error(err)
      })
      watcher.on('error', err => {
        console.error("Error", err)
      })
      watcher.on('stop', () => {
        console.error("Stop")
      })
    })
  } else console.error("Invalid feed config")
} else console.log("No RSS Feeds to monitor")


const generateAttachment = (data, provider) => {
  let image = null
  if (data.description) {
    let match = data.description.match(/https?:\/\/[a-zA-z./_-]+\.jpg|\.jpeg|\.png|\.gif/)
    image = match ? match[0] : null
  }
  let out = [{
    "mrkdwn_in": ["text"],
    "color": "#ff4794",
    "pretext": `RSS - New ${provider.name} Article`,
    "author_name": data.author || null,
    "thumb_url": image,
    "title": data.title,
    "title_link": data.link,
    "text": striptags(data.summary).split('\n')[0],
    "footer": provider.name,
    "footer_icon": provider.image,
    "ts": new Date(data.date).getTime() / 1000
  }]
  return JSON.stringify(out)
}
