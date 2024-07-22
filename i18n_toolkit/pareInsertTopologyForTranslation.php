#!/usr/bin/env php
<?php

$file = "../centreon/www/install/insertTopology.sql";
$data = [];
$topologyPattern1 = "/INSERT INTO `topology` \(.*\) VALUES/";
$topologyPattern2 = "/\(NULL.*\)/";

$content = @file($file);

if (empty($content)) {
    return;
}

foreach ($content as $line) {
    if (preg_match($topologyPattern1, $line))
    {
        $aSqlValues = explode('VALUES', $line);
        # Removing parentheses
        $aSqlValues[1] = substr($aSqlValues[1], strpos($aSqlValues[1], '(') + 1, strpos($aSqlValues[1], ')'));
        # Removing spaces before and after
        $aSqlValues[1] = trim($aSqlValues[1]);
        $aValues = explode(',', $aSqlValues[1]);
        # If array is not empty
        if (count($aValues)) {
            if (
                preg_match('/NULL/', trim($aValues[0]))
                || preg_match('/\d+/', trim($aValues[0]))
            ) {
                $data[$aValues[1]] = $aValues[1];
            } else {
                $data[$aValues[0]] = $aValues[0];
            }
        }
    } elseif (preg_match($topologyPattern2, $line))
    {
        $aValues = explode(',', $line);
        if (count($aValues)) {
            if (
                preg_match('/NULL/', trim($aValues[0]))
                || preg_match('/\d+/', trim($aValues[0]))
            )  {
                $data[$aValues[1]] = $aValues[1];
            } else {
                $data[$aValues[0]] = $aValues[0];
            }
        }
    }
}

if (count($data) > 0) {
    echo "<?php\n";
    foreach ($data as $key => $value) {
        if (!empty(trim($key))) {
            echo '_(' . trim($key) .');' ."\n";
        }
    }
    echo "?>\n";
}

?>

