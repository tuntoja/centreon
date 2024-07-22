#!/usr/bin/env php
<?php

$file = "../centreon/www/install/insertBaseConf.sql";
$startBrokerAnalisys = false;
$data = [];
$brokerPattern1 = "/INSERT INTO `cb_field` \(`cb_field_id`, `fieldname`, `displayname`, `description`, `fieldtype`, `external`\) VALUES/";
$brokerPattern2 = "/INSERT INTO `cb_field` \(`cb_field_id`, `fieldname`, `displayname`, `description`, `fieldtype`, `external`, `cb_fieldgroup_id`\) VALUES/";
$brokerPattern3 = "/INSERT INTO `cb_fieldgroup` \(`cb_fieldgroup_id`, `groupname`, `displayname`, `multiple`, `group_parent_id`\) VALUES/";

$content = @file($file);

if (empty($content)) {
    return;
}

foreach ($content as $line) {
    if (empty($line) || preg_match('/^\s/', $line)) {
        $startBrokerAnalisys = false;
    }

    if ($startBrokerAnalisys) {
        $values = explode(',', $line);
        $data[$values[2]] = $values[2];
    }

    if (
        preg_match($brokerPattern1 , $line) || preg_match($brokerPattern2, $line) || preg_match($brokerPattern3, $line)
    ){
        $startBrokerAnalisys = true;
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

