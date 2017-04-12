<?php
/*
 * Copyright 2005-2015 Centreon
 * Centreon is developped by : Julien Mathis and Romain Le Merlus under
 * GPL Licence 2.0.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation ; either version 2 of the License.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
 * PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program; if not, see <http://www.gnu.org/licenses>.
 *
 * Linking this program statically or dynamically with other modules is making a
 * combined work based on this program. Thus, the terms and conditions of the GNU
 * General Public License cover the whole combination.
 *
 * As a special exception, the copyright holders of this program give Centreon
 * permission to link this program with independent modules to produce an executable,
 * regardless of the license terms of these independent modules, and to copy and
 * distribute the resulting executable under terms of Centreon choice, provided that
 * Centreon also meet, for each linked independent module, the terms  and conditions
 * of the license of that module. An independent module is a module which is not
 * derived from this program. If you modify this program, you may extend this
 * exception to your version of the program, but you are not obliged to do so. If you
 * do not wish to do so, delete this exception statement from your version.
 *
 * For more information : contact@centreon.com
 *
 */

session_start();
require_once __DIR__ . '/../../../../bootstrap.php';
require_once '../functions.php';

$return = array(
    'id' => 'baseconf',
    'result' => 1,
    'msg' => ''
);

$step = new \CentreonLegacy\Core\Install\Step\Step6($dependencyInjector);
$parameters = $step->getDatabaseConfiguration();

try {
    $link = new \PDO(
        'mysql:host=' . $parameters['address'] . ';port=' . $parameters['port'],
        'root',
        $parameters['root_password']
    );
} catch (\PDOException $e) {
    $return['msg'] = $e->getMessage();
    echo json_encode($return);
    exit;
}

/**
 * Create tables
 */
try {
    $link->exec('use ' . $parameters['db_configuration']);

    splitQueries('../../insertMacros.sql', ';', $link, '../../tmp/insertMacros');
    splitQueries('../../insertCommands.sql', ';', $link, '../../tmp/insertCommands.sql');
    splitQueries('../../insertTimeperiods.sql', ';', $link, '../../tmp/insertTimeperiods.sql');
    splitQueries('../../var/baseconf/centreon-engine.sql', ';', $link, '../../tmp/centreon-engine.sql');
    splitQueries('../../var/baseconf/centreon-broker.sql', ';', $link, '../../tmp/centreon-broker.sql');
    splitQueries('../../insertTopology.sql', ';', $link, '../../tmp/insertTopology');
    splitQueries('../../insertBaseConf.sql', ';', $link, '../../tmp/insertBaseConf');
} catch (\Exception $e) {
    $return['msg'] = $e->getMessage();
    echo json_encode($return);
    exit;
}

# Manage timezone
$timezone = date_default_timezone_get();
$resTimezone = $link->query("SELECT timezone_id FROM timezone WHERE timezone_name= '" . $timezone . "'");
if (!$resTimezone) {
    $return['msg'] = _('Cannot get timezone information');
    echo json_encode($return);
    exit;
}
if ($row = $resTimezone->fetch()) {
    $timezoneId = $row['timezone_id'];
} else {
    $timezoneId = '334'; # Europe/London timezone
}
$link->exec("INSERT INTO `options` (`key`, `value`) VALUES ('gmt','" . $timezoneId . "')");

splitQueries('../../insertACL.sql', ';', $link, '../../tmp/insertACL');

/* Get Centreon version */
$res = $link->query("SELECT `value` FROM informations WHERE `key` = 'version'");
if (!$res) {
    $return['msg'] = _('Cannot get Centreon version');
    echo json_encode($return);
    exit;
}
$row = $res->fetch();
$step->setVersion($row['value']);

$return['result'] = 0;
echo json_encode($return);
exit;
