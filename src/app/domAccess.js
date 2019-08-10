/**
 * User: klausk
 * Date: 2019-06-28
 * Time: 16:25
 *
 * Helper for easy DOM Access
 */

export default class DomAccess {

    constructor(dom) {
        this.dom = dom;
    }

    FirstByClass(classname) {
        var r = this.dom.getElementsByClassName(classname)[0];
        if (!r)
            throw "element not found by class " + classname;
        return r;
    }

    TryAttributeFirstByClass(classname, attributename) {
        try {
            return this.AttributeFirstByClass(classname, attributename)
        } catch (e) {
            return null;
        }
    }

    AttributeFirstByClass(classname, attributename) {
        var r = this.FirstByClass(classname);
        var a = r.getAttributeNode(attributename);
        if (!a) {
            window._failnode = r;
            throw "cannot find attribute " + attributename + " for class " + classname;
        }
        return a;
    }
}