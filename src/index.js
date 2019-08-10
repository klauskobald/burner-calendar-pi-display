/**
 * User: klausk
 * Date: 2019-07-22
 * Time: 23:35
 */

import ApiRequest from "./app/apiRequest";
import './app/style.css';
import Config from "./config";
import Main from "./app/component/main";

window._config=Config;
ApiRequest.Initialize('http://localhost:7000/');
const main=new Main();
window._main=main;

main.RenderInto(document.body);

