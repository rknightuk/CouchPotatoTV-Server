<?php

function object_to_array($data)
{
	if (is_array($data) || is_object($data))
	{
		$result = array();
		foreach ($data as $key => $value)
		{
			$result[$key] = object_to_array($value);
		}
		return $result;
	}
	return $data;
}

function getMoviesAsArray($endpoint) {
	include 'config.php';

	$movies = json_decode(file_get_contents($baseUrl . $endpoint));
	$movies = object_to_array($movies);

	return $movies;
}

function generateMovieElements($movies, $markAsDone = false, $addToWanted = false) {

	include 'config.php';

	$elements = '';
	foreach ($movies as $movie) {
		if ($markAsDone) {
			$elements .= '<lockup markAsDone="' . $movie['_id'] . '">';
		}
		elseif ($addToWanted) {
			$elements .= '<lockup addToWanted="'.$movie['identifiers']['imdb'].'">';
		}
		else {
			$elements .= '<lockup>';
		}

		$poster =  $movie['info']['images']['poster'][0];

		if ($poster == 'https://image.tmdb.org/t/p/w154None') {
			$poster =  $clientDomain . '/noPoster.png';
		}

		// $poster = $movie['info']['images']['poster'][0] == 'https://image.tmdb.org/t/p/w154None' ? '../resources/noPoster.png' : $movie['info']['images']['poster'][0];

		$elements .= '
				<img src="' . htmlentities($poster) . '" width="300" height="452"/>
				<title>' . htmlentities($movie['info']['original_title']) . '</title>
			</lockup>';
	}
	return $elements;
}

function insertIntoShelf($title, $moviesTemplate) {
	return '
		<shelf>
			<header>
			   <title>' . $title . '</title>
			</header>
			<section>
				' . $moviesTemplate . '
			</section>
		</shelf>
	';
}

function generateMovieShelf($title, $movies, $markAsDone = false, $addToWanted = false) {
	if ( ! count($movies)) return '';

	$moviesTemplate = generateMovieElements($movies, $markAsDone, $addToWanted);
	$shelfTemplate = insertIntoShelf($title, $moviesTemplate);

	return $shelfTemplate;
}

function generateShelves($shelves) {
	$template = '';

	foreach ($shelves as $shelf) {
		$movies = getMoviesAsArray($shelf['endpoint']);
		$template .= generateMovieShelf(
			$shelf['title'],
			$movies['movies'],
			$shelf['markAsDone'],
			$shelf['addToWanted']
		);
	}

	return $template;
}

function generateChartShelves() {
	$chartShelves = [];
	$charts = getMoviesAsArray('/charts.view');

	$chartShelves[] = generateMovieShelf('Blu Ray Releases', $charts['charts'][0]['list'], false, true);
	$chartShelves[] = generateMovieShelf('Box Office', $charts['charts'][2]['list'], false, true);
	$chartShelves[] = generateMovieShelf('Top Rentals', $charts['charts'][1]['list'], false, true);

	return implode('', $chartShelves);
}