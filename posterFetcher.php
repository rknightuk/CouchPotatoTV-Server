<?php

function getPoster($movie) {
	include 'config.php';

	$imdbID = $movie['identifiers']['imdb'];
	$path = 'covers/' . $imdbID . '.lcr';

	if (file_exists($path)) return $clientDomain . '/' . $path;

	$title = $movie['info']['original_title'];
	$cover = @file_get_contents('http://lsrdb.com/search?title=' . urlencode($title));

	if ($cover) {
		file_put_contents($path, $cover);
		$poster = $clientDomain . '/' . $path;
	}
	else {
		$poster =  $movie['info']['images']['poster'][0];

		if ($poster == 'https://image.tmdb.org/t/p/w154None') {
			$poster =  $clientDomain . '/noPoster.png';
		}
	}

	return $poster;
}