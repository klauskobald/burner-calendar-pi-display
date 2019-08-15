<?php
/**
 * User: klausk
 * Date: 2019-08-14
 * Time: 15:58
 */

const CacheTimeout = 10;

$scr = str_replace(dirname($_SERVER['SCRIPT_NAME']) . '/', '', $_SERVER['REQUEST_URI']);
$path = explode('/', $scr);



$cfile = '/tmp/bc' . md5($scr) . '.cache';

if (!file_exists($cfile) || filectime($cfile) < time() - CacheTimeout) {
	# does only work over cli...
	exec("php proxy.php " . join(" ", $path), $a);
	$data = $a[0];
	file_put_contents($cfile, $data);
} else
	$data = file_get_contents($cfile);


$t=time()-60;
foreach(glob('/tmp/bc*.cache') as $f)
	if(@filectime($f)<$t)
		@unlink($f);

switch(array_pop($path)){
	case 'csv':
		header("Content-type: text/csv");
		header("Content-Disposition: attachment; filename=data.csv");
		header("Pragma: no-cache");
		header("Expires: 0");
		$a=json_decode($data,JSON_OBJECT_AS_ARRAY);
		foreach($a as $lin) {
			$l=array();
			foreach($lin as $col) {
				$col=str_replace('"','\'',$col);
				$l[]= "\"{$col}\"";
			}
			echo join(",",$l)."\n";
		}
		break;
	default:
		header('Content-Type', 'application/json');
		echo $data;
}
