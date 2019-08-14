/**
 * User: klausk
 * Date: 2019-06-04
 * Time: 16:38
 */
import {ThemeTemplate} from "../theme/template";

export default class ComponentBase {
    constructor() {
        this.tpl = null;
        this.Initialize();
    }

    Initialize() {
    }

    RenderInto(parent, force = false) {

        var me = this;
        if (this.tpl === null)
            (async () => {
                me.tpl = await this.GetTemplate();
                me._RenderInto(parent);
                me.TemplateHasBeenLoaded(me.tpl);
                this.tpl.Replace(this);
                me.HasBeenActivated();
            })();
        else {
            if (force) me._RenderInto(parent);
            this.tpl.Replace(this);
            me.HasBeenActivated();
        }
    }


    RemoveMeFromParent() {
        if(this.tpl.dom.parentNode)
            this.tpl.dom.parentNode.removeChild(this.tpl.dom);
    }

    // override those

    TemplateHasBeenLoaded(tpl) {
    }

    HasBeenActivated() {
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

    //


    NormalizedName() {
        return this.constructor.name.replace("Component", "").toLowerCase();
    }

    async GetTemplate() {
        var dom = await this.ImportTemplate();
        var node = dom.default.cloneNode(true);
        node._TEMPLATE_ID = ComponentBase._templateId++;
        return new ThemeTemplate(
            node,
            this.DefineTemplateReplacers
        );
    }


}
ComponentBase._templateId = 1;