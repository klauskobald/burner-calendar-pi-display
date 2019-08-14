<?php
/**
 * User: klausk
 * Date: 2019-08-14
 * Time: 15:43
 */
chdir(__DIR__ . '/..');
require __DIR__ . '/google-api-client.php';

$cmd = $argv[1];
$calendarId = $argv[2];
$max = $argv[3];

$client = getClient();
$service = new Google_Service_Calendar($client);
$optParams = array(
	'maxResults'   => $max,
	'orderBy'      => 'startTime',
	'singleEvents' => true,
	'timeMin'      => date('c'),
);
$results = $service->events->listEvents($calendarId, $optParams);
$events = $results->getItems();


function exportGrouped($events) {
	$lst = array();
	foreach ($events as $event) {
		$k = $event->getSummary();
		if (array_key_exists($k, $lst))
			$d = $lst[$k];
		else {
			$d = array(
				'summary'     => $event->getSummary(),
				'description' => $event->getDescription(),
				'times'       => array(),
				'creator'     => $event->creator->email,
				'location'    => $event->organizer->displayName
			);
		}
		$d['times'][] = array('start' => $event->start->dateTime, 'end' => $event->end->dateTime);
		$lst[$k] = $d;
	}
	return $lst;
}


function formatDate($str){
	return date('Y-m-d H:i',strtotime($str));
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
		$head=array();
		$r=array();
		foreach($lst as $e){
			if(!$head) {
				$head = array_keys($e);
				$r[]=$head;
			}
			$ts=array();
			foreach($e['times'] as $t){
				$ts[]=formatDate($t['start']).' ('.((strtotime($t['end'])-strtotime($t['start']))/60)."')";
			}
			$e['times']=join(", ",$ts);
			$lin=array_values($e);
			$r[]=$lin;
		}
		echo json_encode($r);
		break;
}
