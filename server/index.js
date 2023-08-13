/**
 * User: klausk
 * Date: 2019-08-08
 * Time: 23:10
 */

var http = require('http')

const googleApi = require('./api/google-authorize')
const googleCalendar = require('./api/google-calendar')
console.log('trying to authorize...')

googleApi.Authorize(oAuth2Client => {
  // no idea how to check, if good or bad
  console.log(oAuth2Client)
  main(oAuth2Client)
})

function main (auth) {
  var gCalendar = new googleCalendar(auth)

  var server = http.createServer((request, response) => {
    //response.writeHead("Access-Control-Allow-Origin", "*");
    //console.log(request.url);
    var urls = request.url.split('/')
    switch (urls[1]) {
      case 'events':
        gCalendar
          .ListEvents(urls[2], urls[3] || 20)
          .then(events => {
            response.writeHead(200, { 'Content-Type': 'text/json' })
            response.end(JSON.stringify(events))
          })
          .catch(err => {
            response.writeHead(500, { 'Content-Type': 'text/json' })
            response.end(JSON.stringify('- ' + err))
          })

        break
      default:
        response.writeHead(404, { 'Content-Type': 'text/json' })
        response.end('-\n')
        break
    }
  })
  console.log('starting gateway server on port 7000')
  server.listen(7000)
  console.log('running')
}
