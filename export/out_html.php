<?php
/**
 * User: klausk
 * Date: 2019-09-03
 * Time: 22:58
 */

define('IMPRINT_TEXT', 'Support: <a href=https://hub.burners.at/t/help-for-using-the-event-system-google-calendar/251>https: //hub.burners.at/t/help-for-using-the-event-system-google-calendar/251
</a>
');

class out_html
{
    protected $data;

    /**
     * out_html constructor.
     * @param $data
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    public function render()
    {
        $columns = array_shift($this->data);

        usort(
            $this->data, function ($a, $b) {
                $aa = explode(':', $a[0]);
                $bb = explode(':', $b[0]);
                if (!$aa[1]) {
                    $aa[1] = $aa[0];
                }

                if (!$bb[1]) {
                    $bb[1] = $bb[0];
                }

                return strtoupper(trim($aa[1])) < strtoupper(trim($bb[1])) ? -1 : 1;
                #return $a[2] < $b[2] ? -1 : 1;
            }
        );

        $rows = array();
        foreach ($this->data as $row) {
            $r = array();
            foreach ($row as $ci => $col) {
                switch ($columns[$ci]) {
                    case 'description':
                        $lines = explode("\n", trim($col));
                        if (strpos(strtolower($lines[0]), 'by:') === 0) {
                            $by = array_shift($lines);
                            $lines2 = array();
                            $isBr = false;
                            foreach ($lines as &$l) {
                                $l2 = trim($l);
                                if (substr($l2, 0, 3) == '<br' || !$l2) {
                                    if ($isBr) {
                                        continue;
                                    }
                                    # remove double newlines
                                    $isBr = true;
                                } else {
                                    $isBr = false;
                                }

                                $lines2[] = $l2;
                            }
                            $col = join("\n", $lines2);
                            $r[] = '<div class="by">' . ($by) . '</div>';
                        }
//                        $col = str_replace(
//                            array('<br/>', '<br>', '<br />'),
//                            array('', '', ''),
//                            $col
//                        );
                        $col = nl2br($col);
                        break;
                    case 'summary':
                        $sums = explode(':', $col);
                        $ico = '../icons/' . trim($sums[0]) . '.svg';
                        if (file_exists($ico)) {
                            array_shift($sums);
                            $col = join(':', $sums);
                            $r[] = '<div class="icon"><img src="' . str_replace('..', '/calendar/', $ico) . '"/></div>';
                        } else {
                            $r[] = '<div class="icon"></div>';
                        }
                        break;
                    case 'times':
                        $times = explode(', ', $col);
                        $lst = array();
                        foreach ($times as $t) {
                            $day = substr($t, 0, 10);
                            $lst[] = date('l', strtotime($day)) . ' ' . substr($t, 11);
                        }
                        $col = join(', ', $lst);
                        break;
                }

                $r[] = '<div class="' . $columns[$ci] . '">' . ($col) . '</div>';
            }
            $rows[] = sprintf('<div class="row">%s</div>', join('', $r));
        }

        printf(
            '
				<html>
				<head>
					    <link rel="stylesheet" type="text/css" href="/calendar/export/out_html.css" >
				</head>
				<body>
					<h1>What - Where - When</h1>
					%s
					<div class="imprint">' . IMPRINT_TEXT . '</div>
				</body>
				</html>
				', join('', $rows)
        );
    }

}
