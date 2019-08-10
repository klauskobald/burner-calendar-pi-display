/**
 * User: klausk
 * Date: 2019-08-08
 * Time: 23:34
 */
const {google} = require('googleapis');

class GoogleCalendar {

    constructor(auth) {
        this.auth = auth;
    }

    ListEvents(calendarId, maxResults = 10) {
        return new Promise((resolve, reject) => {
            var auth = this.auth;
            const calendar = google.calendar({version: 'v3', auth});
            calendar.events.list({
                calendarId,
                timeMin:      (new Date()).toISOString(),
                maxResults:   maxResults,
                singleEvents: true,
                orderBy:      'startTime',
            }, (err, res) => {
                if (err) {
                    reject('The API returned an error: ' + err);
                    return;
                }
                const events = res.data.items;
                // if (events.length) {
                //     events.map((event, i) => {
                //         const start = event.start.dateTime || event.start.date;
                //         console.log(`${start} - ${event.summary}`);
                //         console.log(event);
                //     });
                // }
                // else {
                //     console.log('No upcoming events found.');
                // }
                resolve(events);

            });

        })
    }
}

module.exports = GoogleCalendar;