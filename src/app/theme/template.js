/**
 * User: klausk
 * Date: 2019-06-09
 * Time: 23:00
 *
 * Holds an array of replacers and a dom of an html template.
 * A replacer has a key and a pointer to a html element or attribute inside the dom.
 * The innerText or attribute gets then replaced by the value of that same key inside the dataobject given in the Replace() method.
 */

export class ThemeTemplate {

    /**
     *
     * @param dom
     * @param replacerGetter function that gets the ThemeTemplateReplacer(s)
     */
    constructor(dom, replacerGetter) {
        this.dom = dom;
        this.replacerGetter = replacerGetter;
    }

    /**
     *
     * @param data - can be an object, which has matching keys for each replacer
     * @constructor
     */
    Replace(data) {
        (this.replacerGetter.bind(data))(this.dom).forEach((r) => {
            if (r) r.run(data[r.key]);
        });
    }
}

/**
 * Replace a value inside a HTMLElement or Attribute
 */
export class ThemeTemplateReplacer {

    /**
     *
     * @param key string
     * @param obj HTMLElement | Attr
     */
    constructor(key, obj, fn) {
        this.key = key;
        this.obj = obj;
        this.fn = fn;
    }

    run(value) {
        if (this.fn !== undefined) {
            this.fn(this.obj, value);
            return;
        }
        // supports element
        if (this.obj.innerHTML !== undefined) {
            this.obj.innerHTML = value;
            return;
        }

        if (this.obj.innerText !== undefined) {
            this.obj.innerText = value;
            return;
        }
        // or attr
        this.obj.nodeValue = value;
    }

    bind(str, fn) {
        if (!fn) throw "callback missing";
        var me = this;
        var e = this.obj;
        if (e.ownerElement) e = e.ownerElement;
        e[str] = (e) => {
            fn(e, me.obj);
        };
        return this;
    }
}