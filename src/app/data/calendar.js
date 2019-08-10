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

    }

    LoadCalendars() {
        var maxEvents = Config.MaxEvents;
        StatusInfo.Display("loading ...");
        for (var k in Config.Calendars) {
            console.log("load", k);
            ApiRequest.Get('events/' + k + '/' + maxEvents).then((events) => {
                this.OnData(JSON.parse(events));
            });
        }
    }

    OnData(events) {
        events.forEach((e) => {
            var old = this.events[e.id];
            if (old) {
                if (e.updated !== old.updated)
                    this.events[e.id] = e;
            }
            else
                this.events[e.id] = e;
        });

        // aggregate all events first then send
        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
            StatusInfo.Display("updated");
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