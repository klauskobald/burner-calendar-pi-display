/**
 * User: klausk
 * Date: 2019-08-10
 * Time: 13:14
 */

export default class Tools {
  static DateTimeFormatForToday (dtStr) {
    var d = new Date(dtStr)
    return d.getHours() + ':' + ('0' + d.getMinutes()).substr(-2)
  }

  static TimeString (d) {
    return (
      ('0' + d.getHours()).substr(-2) + ':' + ('0' + d.getMinutes()).substr(-2)
    )
  }

  static DateTimeRelativeDays (dtStr) {
    var d = new Date(dtStr)
    var now = new Date()
    var dif = d.getDate() - now.getDate()
    return dif
  }

  static DateTimeRelativeDaysString (dtStr) {
    var d = new Date(dtStr)
    var now = new Date()
    var msecs = d - now
    if (msecs / 86400000 < 7) {
      var dif = this.DateTimeRelativeDays(dtStr)
      switch (dif) {
        case 0:
          return 'Today'
        case 1:
          return 'Tomorrow'
        default:
          return this.DayToString(dtStr)
      }
    } else return d.toString().substr(0, 10)
  }

  static DayToString (dtStr) {
    var d = new Date(dtStr)
    return Tools.days[d.getUTCDay()]
  }
}
Tools.days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]

window._tools = Tools
