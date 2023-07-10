<?php
/**
 * User: klausk
 * Date: 2019-08-14
 * Time: 15:58

 */

/*
Example Usage:
get data json
http://burners.kobald.com/calendar/google/events/all/1000/20190918/5

Export HTML
http://burners.kobald.com/calendar/google/export-grouped-by-time/all/1000/20190918/5/html
http://burners.kobald.com/calendar/google/export-grouped-by-time-table/all/1000/20190918/5/html

all = all calendars from config (replace with id for single calendar)
1000 = max number of items
20190918 = start date
5 = limit to 5 days

change html to csv for download

 */

define("DEBUG", 0);
const CacheTimeout = 10;

$scr = str_replace(dirname($_SERVER['SCRIPT_NAME']) . '/', '', $_SERVER['REQUEST_URI']);
$path = explode('/', $scr);

$cfile = '/tmp/bc' . md5($scr) . '.cache';
if (DEBUG) {
    echo "$cfile<br>";
}

if (!file_exists($cfile) || filectime($cfile) < time() - CacheTimeout) {
    # does only work over cli...
    if (DEBUG) {
        echo "php proxy.php " . join(" ", $path) . "<br>";
    }

    exec("php proxy.php " . join(" ", $path), $a);
    $data = $a[0];
    file_put_contents($cfile, $data);
} else {
    $data = file_get_contents($cfile);
}

$t = time() - CacheTimeout;
foreach (glob('/tmp/bc*.cache') as $f) {
    if (@filectime($f) < $t) {
        @unlink($f);
    }
}

$cmd = array_pop($path);
switch ($cmd) {
    case 'csv':
        header("Content-type: text/csv");
        header("Content-Disposition: attachment; filename=data.csv");
        header("Pragma: no-cache");
        header("Expires: 0");
        $a = json_decode($data, JSON_OBJECT_AS_ARRAY);
        foreach ($a as $lin) {
            $l = array();
            foreach ($lin as $col) {
                $col = str_replace('"', '\'', $col);
                $l[] = "\"{$col}\"";
            }
            echo join(",", $l) . "\n";
        }
        break;
    case 'html':
        $a = json_decode($data, JSON_OBJECT_AS_ARRAY);
        require '../export/out_html.php';
        $o = new out_html($a);
        $o->render();
        break;

    default:
        header('Content-Type', 'application/json');
        echo $data;
        break;
}
