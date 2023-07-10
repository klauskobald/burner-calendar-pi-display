/**
 * User: klausk
 * Date: 2019-07-22
 * Time: 23:35
 */

import ApiRequest from "./app/apiRequest";
import './app/style.css';
import Config from "./config";
import Main from "./app/component/main";

var req = document.location.href.split('?');
var dStr = req[1];
var startTime = dStr ? new Date(dStr) : new Date();

if (req[2])
    Config.DaysColumns = parseInt(req[2]);
if (req[3])
    Config.Rotate.Target = req[3];

window._config = Config;
ApiRequest.Initialize(Config.ProxyPath);
const main = new Main(startTime);
window._main = main;

main.RenderInto(document.body);

// cleanup
setTimeout(() => {
    document.location.reload();
}, 900000);