<?
/**
Oreon is developped with GPL Licence 2.0 :
http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt
Developped by : Julien Mathis - Romain Le Merlus

The Software is provided to you AS IS and WITH ALL FAULTS.
OREON makes no representation and gives no warranty whatsoever,
whether express or implied, and without limitation, with regard to the quality,
safety, contents, performance, merchantability, non-infringement or suitability for
any particular or intended purpose of the Software found on the OREON web site.
In no event will OREON be liable for any direct, indirect, punitive, special,
incidental or consequential damages however they may arise and even if OREON has
been previously advised of the possibility of such damages.

For information : contact@oreon-project.org
*/

	if (!isset($oreon))
		exit();
	#
	## Database retrieve information for Contact
	#
	$cct = array();
	if (($o == "c" || $o == "w") && $sc_id)	{
		$DBRESULT =& $pearDB->query("SELECT * FROM service_categories WHERE sc_id = '".$sc_id."' LIMIT 1");
		if (PEAR::isError($DBRESULT))
			print "DB Error : ".$DBRESULT->getDebugInfo()."<br>";
		# Set base value
		$sc = array_map("myDecode", $DBRESULT->fetchRow());
		$DBRESULT->free();
	}
	
	#
	# End of "database-retrieved" information
	##########################################################
	##########################################################
	# Var information to format the element
	#
	$attrsText 		= array("size"=>"30");
	$attrsText2 	= array("size"=>"60");
	$attrsAdvSelect = array("style" => "width: 200px; height: 100px;");
	$attrsTextarea 	= array("rows"=>"5", "cols"=>"40");
	$template 		= "<table><tr><td>{unselected}</td><td align='center'>{add}<br><br><br>{remove}</td><td>{selected}</td></tr></table>";

	#
	## Form begin
	#
	$form = new HTML_QuickForm('Form', 'post', "?p=".$p);
	if ($o == "a")
		$form->addElement('header', 'title', $lang["sc_add"]);
	else if ($o == "c")
		$form->addElement('header', 'title', $lang["sc_change"]);
	else if ($o == "w")
		$form->addElement('header', 'title', $lang["sc_view"]);
	
	# Contact basic information
	$form->addElement('header', 'information', $lang['sc_infos']);

	# No possibility to change name and alias, because there's no interest
	$form->addElement('text', 'sc_name', $lang["name"], $attrsText);
	$form->addElement('text', 'sc_description', $lang["description"], $attrsText);

/*
    $ams3 =& $form->addElement('advmultiselect', 'contact_cgNotif', $lang["cct_cgNotif"], $notifCgs, $attrsAdvSelect);
	$ams3->setButtonAttributes('add', array('value' =>  $lang['add']));
	$ams3->setButtonAttributes('remove', array('value' => $lang['delete']));
	$ams3->setElementTemplate($template);
	echo $ams3->getElementJs(false);
*/
	$sc_activate[] = &HTML_QuickForm::createElement('radio', 'sc_activate', null, $lang["enable"], '1');
	$sc_activate[] = &HTML_QuickForm::createElement('radio', 'sc_activate', null, $lang["disable"], '0');
	$form->addGroup($sc_activate, 'sc_activate', $lang["status"], '&nbsp;');
	$form->setDefaults(array('sc_activate' => '1'));

	$tab = array();
	$tab[] = &HTML_QuickForm::createElement('radio', 'action', null, $lang['actionList'], '1');
	$tab[] = &HTML_QuickForm::createElement('radio', 'action', null, $lang['actionForm'], '0');
	$form->addGroup($tab, 'action', $lang["action"], '&nbsp;');
	$form->setDefaults(array('action'=>'1'));

	$form->addElement('hidden', 'sc_id');
	$redirect =& $form->addElement('hidden', 'o');
	$redirect->setValue($o);

	if (is_array($select))	{
		$select_str = NULL;
		foreach ($select as $key => $value)
			$select_str .= $key.",";
		$select_pear =& $form->addElement('hidden', 'select');
		$select_pear->setValue($select_str);
	}
	
	# Form Rules
	
	function myReplace()	{
		global $form;
		$ret = $form->getSubmitValues();
		return (str_replace(" ", "_", $ret["contact_name"]));
	}

	$form->applyFilter('__ALL__', 'myTrim');
	$form->applyFilter('contact_name', 'myReplace');
	$from_list_menu = false;
	
	$form->addRule('sc_name', $lang['ErrName'], 'required');
	$form->addRule('sc_description', $lang['ErrAlias'], 'required');
	
	$form->addRule('sc_name', $lang['ErrAlreadyExist'], 'exist');
	
	$form->setRequiredNote($lang['requiredFields']);

	# End of form definition

	# Smarty template Init
	$tpl = new Smarty();
	$tpl = initSmartyTpl($path, $tpl);

	# Just watch a service_categories information
	if ($o == "w")	{
		$form->addElement("button", "change", $lang['modify'], array("onClick"=>"javascript:window.location.href='?p=".$p."&o=c&sc_id=".$sc_id."'"));
	    $form->setDefaults($cct);
		$form->freeze();
	}
	# Modify a service_categories information
	else if ($o == "c")	{
		$subC =& $form->addElement('submit', 'submitC', $lang["save"]);
		$res =& $form->addElement('reset', 'reset', $lang["reset"]);
	    $form->setDefaults($sc);
	}
	# Add a service_categories information
	else if ($o == "a")	{
		$subA =& $form->addElement('submit', 'submitA', $lang["save"]);
		$res =& $form->addElement('reset', 'reset', $lang["reset"]);
	}

	$valid = false;
	if ($form->validate() && $from_list_menu == false)	{
		$cctObj =& $form->getElement('sc_id');
		if ($form->getSubmitValue("submitA"))
			$cctObj->setValue(insertServiceCategorieInDB());
		else if ($form->getSubmitValue("submitC"))
			updateServiceCategorieInDB($cctObj->getValue());
		
		$o = NULL;
		$form->addElement("button", "change", $lang['modify'], array("onClick"=>"javascript:window.location.href='?p=".$p."&o=c&sc_id=".$cctObj->getValue()."'"));
		$form->freeze();
		$valid = true;
	}
	$action = $form->getSubmitValue("action");
	if ($valid && $action["action"]["action"])
		require_once($path."listServiceCategories.php");
	else	{
		#Apply a template definition
		$renderer =& new HTML_QuickForm_Renderer_ArraySmarty($tpl);
		$renderer->setRequiredTemplate('{$label}&nbsp;<font color="red" size="1">*</font>');
		$renderer->setErrorTemplate('<font color="red">{$error}</font><br />{$html}');
		$form->accept($renderer);
		$tpl->assign('form', $renderer->toArray());
		$tpl->assign('o', $o);
		$tpl->assign('p', $p);
		$tpl->assign('lang', $lang);
		$tpl->display("formServiceCategories.ihtml");
	}
?>