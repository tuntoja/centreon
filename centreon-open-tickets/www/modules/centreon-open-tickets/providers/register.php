<?php
/*
 * Copyright 2015-2019 Centreon (http://www.centreon.com/)
 *
 * Centreon is a full-fledged industry-strength solution that meets
 * the needs in IT infrastructure and application monitoring for
 * service performance.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,*
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

$register_providers = array();

// provider name and the ID. For specific use id > 1000.
$register_providers['Mail'] = 1;
$register_providers['Glpi'] = 2;
$register_providers['Otrs'] = 3;
$register_providers['Simple'] = 4;
$register_providers['BmcItsm'] = 5;
$register_providers['Serena'] = 6;
$register_providers['BmcFootprints11'] = 7;
$register_providers['EasyvistaSoap'] = 8;
$register_providers['ServiceNow'] = 9;
$register_providers['Jira'] = 10;
$register_providers['GlpiRestApi'] = 11;
$register_providers['RequestTracker2'] = 12;
$register_providers['Itop'] = 13;
$register_providers['EasyVistaRest'] = 14;

/* 
  to register a custom provider, create the file:
  /usr/share/centreon/www/modules/centreon-open-tickets/providers/custom_register.conf.php

  write the following structure inside it (use a value above 100 for your provider):
  <?php
  $register_providers=['MyCompanyCustomProvider'] = 1000;
*/
$customRegisterFile = $centreon_path . 'www/modules/centreon-open-tickets/providers/custom_register.conf.php';
if (file_exists($customRegisterFile)) {
  include $customRegisterFile;
}
