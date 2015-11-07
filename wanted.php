<?php
header("Content-type: application/x-javascript");

require_once 'config.php';

include 'shelfGenerator.php';

$shelves = [
	[
		'endpoint' => '/media.list?type=movie&status=active',
		'title' => 'Wanted',
		'markAsDone' => true,
		'addToWanted' => false
	],
	[
		'endpoint' => '/suggestion.view',
		'title' => 'Suggestions',
		'markAsDone' => false,
		'addToWanted' => true
	]
];

$template = '<?xml version="1.0" encoding="UTF-8" ?>
		<document>
		   <stackTemplate>
			  <banner>
				 <title>Wanted</title>
			  </banner>
			  <collectionList>
				 ' . generateShelves($shelves) . generateChartShelves() . '
			  </collectionList>
		   </stackTemplate>
		</document>';

echo "var Template = function() { return `". $template . "`}";