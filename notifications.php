<?php
header("Content-type: application/x-javascript");

include 'config.php';
include 'shelfGenerator.php';

$notifications = json_decode(file_get_contents($baseUrl . '/notification.list'));
$notifications = object_to_array($notifications);

$template = '';
if ( ! $notifications['empty']) {

	foreach ($notifications['notifications'] as $not) {
		$template .= '<title>' . $not['message'] .'</title>';
	}
}

$template = '<?xml version="1.0" encoding="UTF-8" ?>
	<document>
		<listTemplate>
		   <banner>
		     Notifications
		   </banner>
		   <list>
		      <section>
		         <listItemLockup>
		            <title>' . $template . '</title>
		         </listItemLockup>
		      </section>
		   </list>
		</listTemplate>

	</document>';

echo "var Template = function() { return `". $template . "`}";