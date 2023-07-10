<?php

/**
 * User: klausk
 * Date: 2019-08-14
 * Time: 15:43
 */

/*
Example:
php proxy.php events all 1000 20190913
php proxy.php events o8j4ua2ifmte2it81lmnkvs04o@group.calendar.google.com 1000 20190913
php proxy.php export-grouped-by-time-table all 1000 20190918 3
# 3 = limit to 3 days
 */

define("DEBUG", 0);

chdir(__DIR__ . '/..');
require __DIR__ . '/google-api-client.php';

if (count($argv) < 2) {
    die("
USAGE: CMD CalendarId maxItems [start date]
");
}

$cmd = $argv[1];
$calendarId = $argv[2];
$max = $argv[3];
$maxSeconds = 0;
if ($argv[4]) {
    $startTime = strtotime($argv[4]);
    if (!$startTime) {
        $startTime = $argv[4];
    }
    # is timestamp
} else {
    $startTime = time();
}

if ($argv[5]) {
    $maxSeconds = 86400 * floatval($argv[5]);
    if ($maxSeconds < 1000) {
        $maxSeconds = 0;
    }

}

$client = getClient();
$service = new Google_Service_Calendar($client);
$optParams = array(
    'maxResults' => $max,
    'orderBy' => 'startTime',
    'singleEvents' => true,
    'timeMin' => date('c', $startTime),
);
if ($maxSeconds) {
    $optParams['timeMax'] = date('c', $startTime + $maxSeconds);

}

if (DEBUG) {
    print_r($optParams);
}

$events = array();
$cfg = json_decode(file_get_contents(__DIR__ . '/config.json'), JSON_OBJECT_AS_ARRAY);

$calendarToLoc = array();
foreach ($cfg['calendars'] as $location => $c) {
    $calendarToLoc[$c["id"]] = $location;
}

$cIdList = array();
if ($calendarId == 'all') {
    foreach ($cfg['calendars'] as $loc => $c) {
        $cIdList[] = $c["id"];
    }
} else {
    if ($calendarId) {
        $cIdList = array($calendarId);
    }

}

foreach ($cIdList as $calendarId) {
    try {
        $results = $service->events->listEvents($calendarId, $optParams);
        $_events = $results->getItems();
    } catch (Exception $e) {
    }
    $events = array_merge($events, $_events);
}

function exportGrouped($events)
{
    $lst = array();
    global $calendarToLoc;
    foreach ($events as $event) {
        $k = $event->getSummary();
        if (array_key_exists($k, $lst)) {
            $d = $lst[$k];
        } else {
            $d = array(
                'summary' => $event->getSummary(),
                'description' => $event->getDescription(),
                'times' => array(),
                'creator' => $event->creator->email,
                'location' => $calendarToLoc[$event->organizer->email],
            );
        }
        $d['times'][] = array('start' => $event->start->dateTime, 'end' => $event->end->dateTime);
        $lst[$k] = $d;
    }
    return $lst;
}

function formatDate($str)
{
    return date('Y-m-d H:i', strtotime($str));
}

switch ($cmd) {
    case 'events':
        $lst = array();
        if (empty($events)) {

        } else {

            foreach ($events as $event) {
                $lst[] = $event;
            }
        }
        echo json_encode($lst);
        break;
    case 'export-grouped-by-time':
        $lst = exportGrouped($events);
        echo json_encode($lst);
        break;
    case 'export-grouped-by-time-table':
        $lst = exportGrouped($events);
        $head = array();
        $r = array();
        foreach ($lst as $e) {
            if (!$head) {
                $head = array_keys($e);
                $r[] = $head;
            }
            $ts = array();
            foreach ($e['times'] as $t) {
                $ts[] = formatDate($t['start']) . ' (' . ((strtotime($t['end']) - strtotime($t['start'])) / 60) . "')";
            }
            $e['times'] = join(", ", $ts);
            $lin = array_values($e);
            $r[] = $lin;
        }
        echo json_encode($r);
        break;
    case 'config':
        echo json_encode($cfg);
        break;
}
