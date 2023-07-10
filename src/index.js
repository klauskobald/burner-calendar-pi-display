/**
 * User: klausk
 * Date: 2019-07-22
 * Time: 23:35
 */

import ApiRequest from './app/apiRequest'
import './app/style.css'
import Config from './config'
import Main from './app/component/main'

var req = document.location.href.split('?')
var dStr = req[1]
var startTime = dStr ? new Date(dStr) : new Date()

if (req[2]) Config.DaysColumns = parseInt(req[2])
if (req[3]) Config.Rotate.Target = req[3]

window._config = Config
ApiRequest.Initialize(Config.ProxyPath)
const main = new Main(startTime)
window._main = main

ApiRequest.Get('config?' + new Date()).then(cfg => {
  try {
    console.log('config from server:', cfg)
    const scals = JSON.parse(cfg)['calendars']
    const cals = {}
    for (var k in scals) {
      const cal = scals[k]
      cals[cal['id']] = cal
      cal['location'] = k
    }
    Config.Calendars = cals
    var i = 1
    for (var k in Config.Calendars) {
      Config.Calendars[k].class = 'cal-' + i
      i++
    }
    main.RenderInto(document.body)
  } catch (e) {
    console.error(e)
  }
})

// cleanup
setTimeout(() => {
  document.location.reload()
}, 900000)
