import ComponentBase from "./_base";
import domAccess from "../domAccess";
import Tools from "../tools";
import {ThemeTemplateReplacer} from "../theme/template";
import Config from "../../config";

/**
 * User: klausk
 * Date: 2019-08-10
 * Time: 12:13
 */



export default class EventDetails extends ComponentBase {

    constructor(e){
        super();
        console.log(e);
        var starttime = e['start']['dateTime'];
        var endtime= e['end']['dateTime'];
        this.summary=e.summary;
        this.description=e.description;
        this.cId = e.organizer.email;
        this.location= Config.Calendars[this.cId].location;
        var dow = Tools.DateTimeRelativeDaysString(starttime);
        this.time=dow+" "+Tools.DateTimeFormatForToday(
            starttime) + " - "+Tools.DateTimeFormatForToday(
            endtime);
    }

    TemplateHasBeenLoaded(tpl) {
        tpl.dom.onclick=()=>{
            tpl.dom.classList.add("fadeout");
            setTimeout(()=>{
                this.RemoveMeFromParent();
            },200)

        };
        var da = new domAccess(tpl.dom);
        da.FirstByClass('head').style.backgroundColor = Config.Calendars[this.cId].color;
    }

    HasBeenActivated() {
    }

    DefineTemplateReplacers(dom) {
        var da = new domAccess(dom);

        return [
            new ThemeTemplateReplacer('summary',da.FirstByClass('summary')),
            new ThemeTemplateReplacer('description',da.FirstByClass('description')),
            new ThemeTemplateReplacer('location',da.FirstByClass('location')),
            new ThemeTemplateReplacer('time', da.FirstByClass('starttime'))
        ];
    }

    async ImportTemplate() {
        // Important ! - Put this into the child class !!!
        return await import("dom-loader!./" + this.NormalizedName() + ".html");
    }
}
