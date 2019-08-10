import ComponentBase from "./_base";
import domAccess from "../domAccess";
import Tools from "../tools";

/**
 * User: klausk
 * Date: 2019-08-10
 * Time: 12:13
 */



export default class Clock extends ComponentBase {

    TemplateHasBeenLoaded(tpl) {

        var da = new domAccess(tpl.dom);
        this.ele = da.FirstByClass("clock");
        setInterval(() => {
            var d = new Date();
            this.ele.innerText = Tools.TimeString(d);
        }, 3000);
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
