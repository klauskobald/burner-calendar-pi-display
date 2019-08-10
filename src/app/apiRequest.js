/**
 * User: klausk
 * Date: 2019-06-10
 * Time: 19:31
 */


export default class ApiRequest {

    static Initialize(host) {
        this.SetHost(host);
    }

    static SetHost(h) {
        console.log("setting api host to:", h);
        ApiRequest.host = h;
    }

    static Get(path) {

        return new Promise((resolve,reject)=>{
            const Http = new XMLHttpRequest();
            Http.open("GET", ApiRequest.host+path);
            Http.send();
            Http.onreadystatechange = (e) => {
                switch(Http.readyState){
                    case 4:
                        resolve(Http.responseText);
                        break;
                }

            }
        })

    }
}

ApiRequest.host = null;
