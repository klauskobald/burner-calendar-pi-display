import Config from "../../config";
import ApiRequest from "../apiRequest";
import StatusInfo from "../statusinfo";

/**
 * User: klausk
 * Date: 2019-08-10
 * Time: 12:19
 */

export default class DataCalendar {

    constructor(dataCallback) {
        this.events = {};
        this.dataFn = dataCallback;
        this._timer = null;
        this.starttime = null;
    }

    SetStartTime(dt) {
        this.starttime = dt;
        this.LoadCalendars();
    }

    LoadCalendars() {
        var maxEvents = Config.MaxEvents;
        StatusInfo.Display("loading ...");
        for (var k in Config.Calendars) {
            console.log("load", k,this.starttime);
            var timestamp = this.starttime ? '/' + parseInt(this.starttime.getTime() / 1000) : '';
            ApiRequest.Get('events/' + k + '/' + maxEvents + '/' + timestamp).then(
                (events) => {
                    try {
                        this.OnData(JSON.parse(events));
                    } catch (e) {
                        StatusInfo.Display('loading error');
                        clearTimeout(this._timer);
                    }
                });
        }
    }

    OnData(events) {
        var t = new Date().getTime();
        events.forEach((e) => {
            var old = this.events[e.id];
            if (old) {
                if (e.updated !== old.updated)
                    this.events[e.id] = e;
            }
            else
                this.events[e.id] = e;

            this.events[e.id]._touched = t;
        });

        // aggregate all events first then send
        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
            StatusInfo.Display("updated");
            var timedout = new Date().getTime() - 10000;

            for (var k in this.events) {
                var e = this.events[k];
                if (e._touched < timedout)
                    delete this.events[e.id];
            }
            this.dataFn(this.EventsToOrderedList());
        }, 500);

    }

    EventsToOrderedList() {
        var r = [];
        for (var k in this.events) {
            r.push(this.events[k]);
        }

        return r.sort((a, b) => a.start.dateTime < b.start.dateTime ? -1 : 1);

    }
}