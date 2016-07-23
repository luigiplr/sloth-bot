import RSSWatcher from 'rss-watcher'
import { sendMessage } from '../../slack'
import config from '../../../config.json'
import striptags from 'striptags'
import { RSSFeeds } from '../../database'
import _ from 'lodash'

if (config.feeds) {
  if (Array.isArray(config.feeds) && config.feeds[0] && config.feedsChannel) {
    config.feeds.forEach(feed => {
      let watcher = new RSSWatcher(feed.url)
      watcher.set({ feedUrl: feed.url, interval: 120 }) // I dunno
      watcher.on('new article', article => {
        RSSFeeds.findOneByGuid(article.guid).then(resp => {
          if (!resp) {
            let newFeed = new RSSFeeds()
            newFeed.guid = article.guid
            newFeed.Persist()
            sendMessage(config.feedsChannel, null, generateAttachment(article, feed))
          } else console.log("Feed already been sent")
        })
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
    "pretext": `RSS - New ${provider.name} Post`,
    "author_name": data.author || null,
    "thumb_url": image,
    "title": data.title,
    "title_link": data.link.indexOf('http') == 0 ? data.link : data.meta.link,
    "text": data.summary ? striptags(data.summary).split('\n')[0] : _.truncate(striptags(data.description), { length: 100 }),
    "footer": provider.name,
    "footer_icon": provider.image,
    "ts": new Date(data.date).getTime() / 1000
  }]
  return JSON.stringify(out)
}
