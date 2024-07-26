#!/usr/bin/env php
<?php

/**
 * Basic util functions.
 *
 * @author    Greg Sherwood <gsherwood@squiz.net>
 * @copyright 2006-2015 Squiz Pty Ltd (ABN 77 084 670 600)
 * @license   https://github.com/squizlabs/PHP_CodeSniffer/blob/master/licence.txt BSD Licence
 */
# ffunction rom https://github.com/squizlabs/PHP_CodeSniffer/blob/master/src/Util/Common.php#L333
function isCamelCaps(
    $string,
    $classFormat=false,
    $public=true,
    $strict=true
) {
    // Check the first character first.
    if ($classFormat === false) {
        $legalFirstChar = '';
        if ($public === false) {
            $legalFirstChar = '[_]';
        }

        if ($strict === false) {
            // Can either start with a lowercase letter, or multiple uppercase
            // in a row, representing an acronym.
            $legalFirstChar .= '([A-Z]{2,}|[a-z])';
        } else {
            $legalFirstChar .= '[a-z]';
        }
    } else {
        $legalFirstChar = '[A-Z]';
    }

    if (preg_match("/^$legalFirstChar/", $string) === 0) {
        return false;
    }

    // Check that the name only contains legal characters.
    $legalChars = 'a-zA-Z0-9';
    if (preg_match("|[^$legalChars]|", substr($string, 1)) > 0) {
        return false;
    }

    if ($strict === true) {
        // Check that there are not two capital letters next to each other.
        $length          = strlen($string);
        $lastCharWasCaps = $classFormat;

        for ($i = 1; $i < $length; $i++) {
            $ascii = ord($string[$i]);
            if ($ascii >= 48 && $ascii <= 57) {
                // The character is a number, so it can't be a capital.
                $isCaps = false;
            } else {
                if (strtoupper($string[$i]) === $string[$i]) {
                    $isCaps = true;
                } else {
                    $isCaps = false;
                }
            }

            if ($isCaps === true && $lastCharWasCaps === true) {
                return false;
            }

            $lastCharWasCaps = $isCaps;
        }
    }//end if

    return true;

}//end isCamelCaps()

if ($argc < 2) {
    echo "Usage: php {$argv[0]} <centreon-web directory>\n";
    exit(1);
}

if (is_dir($_SERVER['argv'][1])) {
    $centeonDir = $_SERVER['argv'][1];
} else {
    echo "{$argv[1]} if not a dir\n";
    echo "Usage: php {$argv[0]} <centreon-web directory>\n";
    exit(1);
}

$dir = $centeonDir . "/www/widgets/src";
$pattern1 = '/"label"\:\s+"(.*)\"/';
$pattern2 = '/"name"\:\s+"(.*)\"/';
$pattern3 = '/"secondaryLabel"\:\s+"(.*)\"/';

if ( ! is_dir($dir)) {
    echo "{$argv[1]} if not a the centreon-web dir\n";
    echo "Usage: php {$argv[0]} <centreon-web directory>\n";
    exit(1);
}

$d = dir($dir);
$data = [];

while (false !== ($entry = $d->read())) {
    if ($entry == '.' || $entry == '..') {
        continue;
    }

    $entry = $dir.'/'.$entry;
    $propertiesJsonFile = $entry . '/properties.json';

    if (is_dir($entry) && is_file($propertiesJsonFile)) {
        $content = @file_get_contents($propertiesJsonFile);

        if (empty($content)) {
            return;
        }
        if (preg_match_all($pattern1, $content, $matches)) {
            foreach ($matches[1] as $string) {
                if (isCamelCaps($string, false, true, false) === false) {
                    $data[$string] = $string;
                }
            }
        }
        if (preg_match_all($pattern2, $content, $matches)) {
            foreach ($matches[1] as $string) {
                $data[$string] = $string;
            }
        }
        if (preg_match_all($pattern3, $content, $matches)) {
            foreach ($matches[1] as $string) {
                $data[$string] = $string;
            }
        }
    }
}

$d->close();

if (count($data) > 0) {
    echo "<?php\n";
    foreach ($data as $key => $value) {
        if (!empty(trim($key))) {
            echo '_("' . trim($key) .'");' ."\n";
        }
    }
    echo "?>\n";
}

?>