import ComponentBase from "./_base";
import domAccess from "../domAccess";
import CalendarAgenda from "./calendaragenda"
import Clock from "./clock";

/**
 * User: klausk
 * Date: 2019-08-10
 * Time: 12:13
 */



export default class Main extends ComponentBase {

    constructor(startTime) {
        super();
        this.startTime=startTime;
        this.containers = [];
    }

    TemplateHasBeenLoaded(tpl) {
        var da = new domAccess(tpl.dom);
        this.containers.push( new Container(
            'big',
            da.FirstByClass('container-big'),
            new CalendarAgenda(this.startTime)
        ));

        this.clock=new Clock();
        this.clock.RenderInto(document.body);
    }

    HasBeenActivated() {
    }

    DefineTemplateReplacers(dom) {
        return [];
    }

    async ImportTemplate() {
        // Important ! - Put this into the child class !!!
        return await import("dom-loader!./" + this.NormalizedName() + ".html");
    }
}

class Container {
    constructor(key, ele, component) {
        this.key = key;
        this.ele = ele;
        this.component = component;
        component.RenderInto(ele);
    }
}