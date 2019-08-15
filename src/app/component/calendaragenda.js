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
import EventDetails from "./eventdetails";

export default class CalendarAgenda extends ComponentBase {

    constructor(startTime){
        super();
        this.startTime=startTime;
    }

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
        this.datasource.SetStartTime(this.startTime);
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
        // var width = parseInt(100 / maxDays) + "%";
        var colClass = 'col-' + maxDays;
        this.container.innerHTML = "";
        var dayOfWeek = null;
        var currDay = null;
        var iconpath = Config.IconPath;
        var now=new Date();
        events.forEach(e => {
            var i = this.itemEle.cloneNode(true);
            i.onclick = () => {
                this.onEventClick(e);
            };
            var cId = e.organizer.email;
            i.style.backgroundColor = Config.Calendars[cId].color;

            var starttime = e['start']['dateTime'];
            var endtime = e['end']['dateTime'];

            if(new Date(starttime)<=now && now<=new Date(endtime))
                i.classList.add('happening-now');

            var dow = Tools.DateTimeRelativeDaysString(starttime);
            if (dow !== dayOfWeek) {
                if (dayIdx === maxDays)
                    return;
                dayOfWeek = dow;
                var _currDay = this.dayEle.cloneNode(true);
                _currDay.classList.add(colClass);
                var _da = new DomAccess(_currDay);
                (_da.FirstByClass("head")).innerText = dayOfWeek;
                this.container.appendChild(_currDay);
                currDay = _da.FirstByClass("events");
                dayIdx++;
            }

            var da = new DomAccess(i);
            var s = e['summary'].split(':');
            var summary, iconname;
            if (s.length === 1) {
                summary = s[0];
                iconname = null;
            }
            else {
                iconname = iconpath + s[0].trim().toLowerCase() + '.svg';
                summary = s[1];
            }
            da.FirstByClass('summary').innerHTML = "<span>" + summary + "</span>";
            da.FirstByClass('location').innerHTML = "<span>" + Config.Calendars[cId].location + "</span>";
            da.FirstByClass('starttime').innerHTML = "<span>" + Tools.DateTimeFormatForToday(
                starttime) + " - " + Tools.DateTimeFormatForToday(
                endtime) + "</span>";
            var iconele = da.FirstByClass('icon');
            iconele.src = iconname;
            iconele.style.visibility = iconname ? 'visible' : 'hidden';
            currDay.appendChild(i);
        });
    }

    onEventClick(e) {
        if (this.details)
            this.details.RemoveMeFromParent();
        this.details = new EventDetails(e);
        this.details.RenderInto(document.body);
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