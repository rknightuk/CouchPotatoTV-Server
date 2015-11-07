<?php
header("Content-type: application/x-javascript");

include 'shelfGenerator.php';

$shelves = [
	[
		'endpoint' => '/media.list/?release_status=snatched%2Cmissing%2Cavailable%2Cdownloaded%2Cdone%2Cseeding&with_tags=recent',
		'title' => 'Snatched',
		'markAsDone' => true,
		'addToWanted' => false
	],
	[
		'endpoint' => '/dashboard.soon',
		'title' => 'Available Soon',
		'markAsDone' => true,
		'addToWanted' => false
	],
	[
		'endpoint' => '/dashboard.soon?late=true',
		'title' => 'Still Not Available',
		'markAsDone' => true,
		'addToWanted' => false
	]
];

$template = '<?xml version="1.0" encoding="UTF-8" ?>
		<document>
		   <stackTemplate>
			  <banner>
				 <title>Downloads</title>
			  </banner>
			  <collectionList>
				 ' . generateShelves($shelves) . '
			  </collectionList>
		   </stackTemplate>
		</document>';

echo "var Template = function() { return `". $template . "`}";