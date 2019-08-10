/**
 * User: klausk
 * Date: 2019-08-10
 * Time: 12:16
 */
import ComponentBase from "./_base";
import Config from "../../config";
import DataCalendar from "../data/calendar";
import DomAccess from "../domAccess";
import Tools from "../tools";

export default class CalendarAgenda extends ComponentBase {

    TemplateHasBeenLoaded(tpl) {
        var da = new DomAccess(tpl.dom);
        this.itemEle = da.FirstByClass('item');
        this.itemEle.parentNode.removeChild(this.itemEle);
        this.container = da.FirstByClass("agenda");
        this.dayEle = da.FirstByClass('day');
        this.dayEle.parentNode.removeChild(this.dayEle);
    }

    HasBeenActivated() {
        this.datasource = new DataCalendar(x => this.OnData(x));
        this.AccuireData();
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.AccuireData();
        }, Config.Refresh * 1000);
    }

    AccuireData() {
        this.datasource.LoadCalendars();
    }

    OnData(events) {
        console.log(events);
        var maxDays = Config.DaysColumns, dayIdx = 0;
        var width = parseInt(100 / maxDays) + "%";
        this.container.innerHTML = "";
        var dayOfWeek = null;
        var currDay = null;
        events.forEach(e => {
            var i = this.itemEle.cloneNode(true);

            var cId = e.organizer.email;
            i.style.backgroundColor = Config.Calendars[cId].color;

            var starttime = e['start']['dateTime'];
            var endtime= e['end']['dateTime'];
            var dow = Tools.DateTimeRelativeDaysString(starttime);
            if (dow !== dayOfWeek) {
                if (dayIdx === maxDays)
                    return;
                dayOfWeek = dow;
                var _currDay = this.dayEle.cloneNode(true);
                _currDay.style.width = width;
                var _da = new DomAccess(_currDay);
                (_da.FirstByClass("head")).innerText = dayOfWeek;
                this.container.appendChild(_currDay);
                currDay = _da.FirstByClass("events");
                dayIdx++;
            }

            var da = new DomAccess(i);
            da.FirstByClass('summary').innerHTML = "<span>" + e['summary'] + "</span>";
            da.FirstByClass('location').innerHTML = "<span>" + Config.Calendars[cId].location + "</span>";
            da.FirstByClass('starttime').innerHTML = "<span>" + Tools.DateTimeFormatForToday(
                starttime) + " - "+Tools.DateTimeFormatForToday(
                endtime)+ "</span>";
            currDay.appendChild(i);
        });
    }

    _RenderInto(parent) {
        parent.append(this.tpl.dom);
    }

    DefineTemplateReplacers(dom) {
        return [];
    }

    async ImportTemplate() {
        // Important ! - Put this into the child class !!!
        return await import("dom-loader!./" + this.NormalizedName() + ".html");
    }

}