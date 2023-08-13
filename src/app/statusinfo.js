/**
 * User: klausk
 * Date: 2019-07-25
 * Time: 15:23
 */

import Config from '../config'

export default class StatusInfo {
  static Display (str, remainingTime = false) {
    StatusInfo.updated = new Date()
    StatusInfo.text = str
    StatusInfo.reverse = remainingTime
    this._display()
  }

  static _display () {
    var secs
    if (StatusInfo.reverse) {
      secs = parseInt(
        (StatusInfo.updated.getTime() +
          Config.Refresh * 1000 -
          new Date().getTime()) /
          1000
      )
      StatusInfo.element.innerHTML =
        '<span>' + StatusInfo.text + ' ' + secs + 's</span>'
    } else {
      secs = parseInt(
        (new Date().getTime() - StatusInfo.updated.getTime()) / 1000
      )
      StatusInfo.element.innerHTML =
        '<span>' + StatusInfo.text + ' ' + secs + 's ago</span>'
    }

    clearTimeout(StatusInfo.timer)
    StatusInfo.timer = setTimeout(() => {
      this._display()
    }, 1000)
  }
}
StatusInfo.element = document.getElementById('statusinfo')
StatusInfo.updated = new Date()
StatusInfo.text = null
StatusInfo.reverse = false
StatusInfo.timer
