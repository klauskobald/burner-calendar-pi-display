/**
 * User: klausk
 * Date: 2019-07-25
 * Time: 15:23
 */

export default class StatusInfo {

    static Display(str) {
        StatusInfo.updated = new Date();
        StatusInfo.text = str;
        this._display();
    }

    static _display() {

        var secs = parseInt((new Date().getTime() - StatusInfo.updated.getTime()) / 1000);
        StatusInfo.element.innerHTML = "<span>" + StatusInfo.text + "</span>" + (
            secs > 2 ? " <span>" + secs + " secs ago</span>" : "");

        clearTimeout(StatusInfo.timer);
        StatusInfo.timer = setTimeout(() => {
            this._display();
        }, 1000);
    }
}
StatusInfo.element = document.getElementById('statusinfo');
StatusInfo.updated = new Date();
StatusInfo.text = null;
StatusInfo.timer;