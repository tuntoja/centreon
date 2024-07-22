#!/bin/bash

#
# Check working directory
#
BASE_DIR=$(dirname $0)
BASE_DIR=$( cd $BASE_DIR; pwd )
export BASE_DIR

#
# Check external tools
#
PHP=$(which php)
if [ -z $PHP ] ; then
    echo -e "You must install php-cli before continue"
    exit 1
fi

XGETTEXT=$(/usr/bin/which xgettext)
if [ -z $XGETTEXT ] ; then
    echo -e "You must install xgettext before continue"
    exit 1
fi

MSGMERGE=$(/usr/bin/which msgmerge)
if [ -z $MSGMERGE ] ; then
    echo -e "You must install msgmerge before continue"
    exit 1
fi

# Define projects
PROJECTS=(
    "centreon"
    "centreon-license-manager"
    "centreon-autodiscovery"
    "centreon-pp-manager"
    "centreon-bam"
    "centreon-map"
    "centreon-mbi"
)

# Define language
LANGS=(
    "de_DE"
    "es_ES"
    "fr_FR"
    "pt_BR"
    "pt_PT"
)

#
# Define global vars
#
i18n_DIR="BASE_DIR/i18n_toolkit"
MESSAGE_POT_FILE=messages.pot
HELP_POT_FILE=help.pot
SMARTY_TRANSLATE_SCRIPT=$BASE_DIR/tsmarty2centreon.php
REACTJS_TRANSLATE_SCRIPT=$BASE_DIR/reachjs2centreon.php
BROKER_TRANSLATE_SCRIPT=$BASE_DIR/pareInsertBaseConfForTranslation.php
MENUS_TRANSLATE_SCRIPT=$BASE_DIR/pareInsertTopologyForTranslation.php
PO_SRC=$BASE_DIR/po_src
CAN_BE_TRANSLATE=false

# Check project name
if [ "$1" ]; then
    for PROJECT in ${PROJECTS[@]};
    do
        if [ "$1" = "$PROJECT" ]; then
            CAN_BE_TRANSLATE=true
            PROJECT=$1
            break
        fi
    done
    if [ $CAN_BE_TRANSLATE = false ]; then
        echo -e "Project $1 can't be translated"
        exit 1
    fi
else
    echo -e "Please execute following command: $0 <project name> <locale>"
    exit 1
fi

# Check for locale
CAN_BE_TRANSLATE=false

if [ "$2" ]; then
    for LANG in ${LANGS[@]};
    do
        if [ "$2" = "$LANG" ]; then
            CAN_BE_TRANSLATE=true
            LANG=$2
            break
        fi
    done
    if [ $CAN_BE_TRANSLATE = false ]; then
        echo -e "Project $1 can't be translated in $2 lcoale"
        exit 1
    fi
else
    echo -e "Please execute following command: $0 <project name> <locale>"
    exit 1
fi

if [ "$PROJECT" = "centreon" ]; then
    BASE_DIR_PROJECT="$BASE_DIR/../$PROJECT"
    echo -e "Removing previous POT files"
    if [ -f "$BASE_DIR_PROJECT/lang/messages.pot" ]; then
        rm $BASE_DIR_PROJECT/lang/messages.pot -f >> /dev/null 2>&1
    fi
    if [ -f "$BASE_DIR_PROJECT/lang/help.pot" ]; then
        rm $BASE_DIR_PROJECT/lang/help.pot -f >> /dev/null 2>&1
    fi

    echo -e "Extracting strings to translate for menus"
    $PHP $BASE_DIR/pareInsertTopologyForTranslation.php > $BASE_DIR_PROJECT/www/install/menu_translation.php
    echo -e "Extracting strings to translate from Centreon Broker forms"
    $PHP $BASE_DIR/pareInsertBaseConfForTranslation.php > $BASE_DIR_PROJECT/www/install/centreon_broker_translation.php
    echo -e "Extracting strings to translate from legacy pages"
    $PHP $BASE_DIR/tsmarty2centreon.php $BASE_DIR_PROJECT > $BASE_DIR_PROJECT/www/install/smarty_translate.php
    echo -e "Extracting strings to translate from ReactJS pages"
    $PHP $BASE_DIR/reachjs2centreon.php $BASE_DIR_PROJECT > $BASE_DIR_PROJECT/www/install/front_translate.php

    echo -e ""
    echo -e "List all PHP files excluding help.php files"
    find $BASE_DIR_PROJECT -name '*.php' | grep -v "help" > $PO_SRC
    echo -e "Generate messages.pot file including all strings to translate"
    $XGETTEXT --default-domain=messages -k_ --files-from=$PO_SRC --output=$BASE_DIR_PROJECT/lang/messages.pot > /dev/null 2>&1

    # Merge exiusting translation file with new POT file
    $MSGMERGE $BASE_DIR_PROJECT/lang/$LANG.UTF-8/LC_MESSAGES/messages.po $BASE_DIR_PROJECT/lang/messages.pot -o $BASE_DIR_PROJECT/lang/$LANG.UTF-8/LC_MESSAGES/messages_new.po
    mv -f $BASE_DIR_PROJECT/lang/$LANG.UTF-8/LC_MESSAGES/messages_new.po $BASE_DIR_PROJECT/lang/$LANG.UTF-8/LC_MESSAGES/messages.po

    missing_translation=$(msggrep -v -T -e "." $BASE_DIR_PROJECT/lang/$LANG.UTF-8/LC_MESSAGES/messages.po | grep -c ^msgstr)
    echo -e "Missing $missing_translation strings to translate from $BASE_DIR_PROJECT/lang/$LANG.UTF-8/LC_MESSAGES/messages.po"

    echo -e ""
    echo -e "List all help.php files"
    find $BASE_DIR_PROJECT/www -name 'help.php' > $PO_SRC
    echo -e "Generate help.pot file including all strings to translate"
    $XGETTEXT --default-domain=messages -k_ --files-from=$PO_SRC --output=$BASE_DIR_PROJECT/lang/help.pot > /dev/null 2>&1

    # Merge exiusting translation file with new POT file
    $MSGMERGE $BASE_DIR_PROJECT/lang/$LANG.UTF-8/LC_MESSAGES/help.po $BASE_DIR_PROJECT/lang/help.pot -o $BASE_DIR_PROJECT/lang/$LANG.UTF-8/LC_MESSAGES/help_new.po
    mv -f $BASE_DIR_PROJECT/lang/$LANG.UTF-8/LC_MESSAGES/help_new.po $BASE_DIR_PROJECT/lang/$LANG.UTF-8/LC_MESSAGES/help.po

    missing_translation=$(msggrep -v -T -e "." $BASE_DIR_PROJECT/lang/$LANG.UTF-8/LC_MESSAGES/help.po | grep -c ^msgstr)
    echo -e "Missing $missing_translation strings to translate from $BASE_DIR_PROJECT/lang/$LANG.UTF-8/LC_MESSAGES/help.po"
fi
