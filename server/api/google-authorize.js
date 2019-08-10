/**
 * User: klausk
 * Date: 2019-08-08
 * Time: 23:13
 */
const {google} = require('googleapis');
const Token = require('../data/token');
const Credentials = require("../data/credentials");

class GoogleApi {
    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {function} callback The callback to call with the authorized client.
     */
    static Authorize(callback) {
        const {client_secret, client_id, redirect_uris} = Credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        oAuth2Client.setCredentials(Token);
        callback(oAuth2Client);
    }

}

module.exports = GoogleApi;