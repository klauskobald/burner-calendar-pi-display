/**
 * User: klausk
 * Date: 2019-08-10
 * Time: 12:16
 */
import ComponentBase from './_base'
import Config from '../../config'
import DataCalendar from '../data/calendar'
import DomAccess from '../domAccess'
import Tools from '../tools'
import EventDetails from './eventdetails'

export default class CalendarAgenda extends ComponentBase {
  constructor (startTime) {
    super()
    this.startTime = startTime
  }

  TemplateHasBeenLoaded (tpl) {
    var da = new DomAccess(tpl.dom)
    this.itemEle = da.FirstByClass('item')
    this.itemEle.parentNode.removeChild(this.itemEle)
    this.container = da.FirstByClass('agenda')
    this.dayEle = da.FirstByClass('day')
    this.dayEle.parentNode.removeChild(this.dayEle)
    this._animator = { list: [] }
    switch (Config.Rotate.Target) {
      case 'calendar':
        setInterval(() => {
          this.Animator()
        }, Config.Rotate.Interval * 1000)
        this.Animator()
        break
    }
  }

  HasBeenActivated () {
    this.datasource = new DataCalendar(x => this.OnData(x))
    this.datasource.SetStartTime(this.startTime)
    clearInterval(this.timer)
    this.timer = setInterval(() => {
      this.AccuireData()
    }, Config.Refresh * 1000)
  }

  SetVisibility (cls, vis) {
    var lst = this.tpl.dom.getElementsByClassName(cls)
    for (var i = 0; i < lst.length; i++) {
      lst[i].style.display = vis
    }
    return lst.length > 0
  }

  Animator () {
    switch (Config.Rotate.Target) {
      case 'calendar':
        if (this._animator.list.length === 0) {
          for (var k in Config.Calendars) this._animator.list.push(k)
        }
        if (this._animator.curr) this.SetVisibility(this._animator.curr, 'none')
        var cId = this._animator.list.shift()
        var cls = Config.Calendars[cId].class
        var eventsAvailable = this.SetVisibility(cls, 'block')
        this._animator.curr = cls
        if (!eventsAvailable) setTimeout(() => this.Animator(), 10)
        break
    }
  }

  AccuireData () {
    this.datasource.LoadCalendars()
  }

  OnData (events) {
    //console.log(events)
    var maxDays = Config.DaysColumns,
      dayIdx = 0
    // var width = parseInt(100 / maxDays) + "%";
    var colClass = 'col-' + maxDays
    var itemClass = maxDays === 1 ? 'oneday' : ''
    // var newContainer = document.createElement('div')
    var newContainer = this.container
    newContainer.innerHTML = ''
    var dayOfWeek = null
    var currDay = null
    var iconpath = Config.IconPath
    var now = new Date()
    var preroll = Config.AlertPreRollMinutes * 60000
    var totct = 0
    var totmax = maxDays == 1 ? Config.MaxEventsTotal : 999
    var problemList = []

    events.forEach(e => {
      if (totct++ > totmax) return
      var s = e['summary'].split(':')
      switch (s[0].trim()) {
        case 'private': // do not display
          return
      }
      var i = this.itemEle.cloneNode(true)
      i.onclick = () => {
        this.onEventClick(e)
      }
      // i.addEventListener('pointerdown', e => {
      //   this.onEventClick(e)
      // })

      var cId = e.organizer.email
      i.style.backgroundColor = Config.Calendars[cId].color
      i.classList.add(Config.Calendars[cId].class)
      if (itemClass) i.classList.add(itemClass)
      switch (Config.Rotate.Target) {
        case 'calendar':
          i.style.display = 'none'
          break
      }
      var starttime = new Date(e['start']['dateTime'])
      var endtime = new Date(e['end']['dateTime'])

      if (starttime - preroll <= now && now <= endtime)
        i.classList.add('happening-now')

      var dow = Tools.DateTimeRelativeDaysString(starttime)
      if (dow !== dayOfWeek) {
        if (maxDays > 1 && dayIdx === maxDays) return
        dayOfWeek = dow
        var _currDay = this.dayEle.cloneNode(true)
        _currDay.classList.add(colClass)
        var _da = new DomAccess(_currDay)
        _da.FirstByClass('head').innerText = dayOfWeek
        newContainer.appendChild(_currDay)
        currDay = _da.FirstByClass('events')
        dayIdx++
      }

      var da = new DomAccess(i)
      var summary, iconname
      if (s.length === 1) {
        summary = s[0]
        iconname = null
      } else {
        iconname = iconpath + s[0].trim().toLowerCase() + '.svg'
        summary = s[1]
      }

      var problem = null

      if (e.description) {
        var ed = e.description.trim()
        ed = ed.replace('<br>', '\n')
        ed = ed.replace('<BR>', '\n')
        ed = ed.replace('<br\\>', '\n')

        if (ed.substr(0, 3).toLowerCase() === 'by:') {
          var dList = ed.split('\n')
          da.FirstByClass('by').innerHTML = '<span>' + dList[0] + '</span>'
        } else {
          if (ed.indexOf('by ') > 0)
            problem =
              'By is wrong!\nThe first line of description should read exactly "by: YOURNAME".<br> You seem to have added a "by" somewhere inside the description. This is wrong.'
        }
      } else problem = 'Description Missing!'

      if (problem) {
        e['_problem'] = problem
        // problemList.push({
        //   summary: e.summary,
        //   date: starttime,
        //   email: e.creator.email,
        //   problem: problem
        // })
        summary +=
          '<div class="event-problem">' + problem.split('\n')[0] + '</div>'
      }

      var sumele = da.FirstByClass('summary')
      sumele.innerHTML = '<span>' + summary + '</span>'
      if (summary.length > 40) sumele.classList.add('shrink-text')
      else if (summary.length < 20) sumele.classList.add('grow-text')
      da.FirstByClass('location').innerHTML =
        '<span>' + Config.Calendars[cId].location + '</span>'

      da.FirstByClass('starttime').innerHTML =
        '<span>' +
        Tools.DateTimeFormatForToday(starttime) +
        ' - ' +
        Tools.DateTimeFormatForToday(endtime) +
        '</span>'
      var iconele = da.FirstByClass('icon')
      iconele.src = iconname
      iconele.style.visibility = iconname ? 'visible' : 'hidden'
      currDay.appendChild(i)
    })
    // TODO - this causes black screen sometimes
    // better compare and remove/add single events
    // this.container.innerHTML = newContainer.innerHTML

    if (problemList.length > 0) {
      console.warn('problems with events:')
      console.log(problemList)
    }
  }

  onEventClick (e) {
    if (this.details) this.details.RemoveMeFromParent()
    this.details = new EventDetails(e)
    this.details.RenderInto(document.body)
  }

  _RenderInto (parent) {
    parent.append(this.tpl.dom)
  }

  DefineTemplateReplacers (dom) {
    return []
  }

  async ImportTemplate () {
    // Important ! - Put this into the child class !!!
    return await import('dom-loader!./' + this.NormalizedName() + '.html')
  }
}
