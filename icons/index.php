<html>
<head>
    <style>
        body {
            background: #111111;
            color: #bbbbbb;
            font-family: Arial;
        }

        .inverted {
            filter: invert(100%);
        }

        td{
            padding:10px;
            font-size: 1.5em;
        }

        .icon{
            width: 50px;
        }

        .help{
            font-size: 1em;
        }

        .inset{
            padding-left: 20px;
        }
    </style>
</head>
<body>
<table>

	<?php
	/**
	 * User: klausk
	 * Date: 2019-08-15
	 * Time: 17:54
	 */
	echo "
	<tr>
	<td></td>
	<td class='help'>Icon Name</td>
	</tr>";

	foreach (glob("*.svg") as $f) {
		$nam = str_replace(".svg", "", basename($f));
		echo "
	<tr>
	<td><img class='inset inverted icon' src='$f'></td>
	<td>$nam</td>
	</tr>
	";
	}


	echo "
	<tr>
	<td></td>
	<td class='help'>Use the icon name in the event title like so: 
	<br /><b>meditation:Find Your Other Self!</b></td>
	</tr>";


	?>
</table>

</body>
</html>

