<?php error_reporting(E_ALL); ini_set('display_errors', '1'); ?>
<!doctype html>
<html lang="en">
<head>

	<meta charset="utf-8">
	<title>Filmstrip Carousel Tests</title>
	<link rel="stylesheet" href="css/style.css" media="screen" />
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
	<script src="../filmstripCarousel.min.js"></script>
	<script src="js/test.js"></script>

</head>
<body>
<div id="micrositeContainer">
<div id="micrositeContainerInner">
<div id="micrositeContainerCompress">

	<div id="micrositeHeader">
    <h2>Header</h2>
  </div>

	<div id="micrositeContent">

	<div id="micrositeContentColumnLeft">

		<h6>6 items, navigation inline, pagination on</h6>
		<?php include('inc/fsLeft6ItemsNavInlinePaginationOn.php'); ?>

		<h6>3 items, navigation inline, pagination on</h6>
		<?php include('inc/fsLeft3ItemsNavInlinePaginationOn.php'); ?>

		<h6>42 items, navigation inline, pagination on</h6>
		<?php include('inc/fsLeft42ItemsNavInlinePaginationOn.php'); ?>

		<h6>9 items, navigation inline, pagination off</h6>
		<?php include('inc/fsLeft9ItemsNavInlinePaginationOff.php'); ?>

		<h6>9 items, navigation off, pagination on</h6>
		<?php include('inc/fsLeft9ItemsNavOffPaginationOn.php'); ?>

		<h6>9 items, navigation off, pagination off</h6>
		<?php include('inc/fsLeft9ItemsNavOffPaginationOff.php'); ?>

	</div>

	<div id="micrositeContentColumnRight">
    <h2>Right Column</h2>
  </div>

	<div id="micrositeContentColumnFull">

		<h6>6 items, navigation inline, pagination on</h6>
		<?php include('inc/fsFull6ItemsNavInlinePaginationOn.php'); ?>

		<h6>42 items, navigation inline, pagination on</h6>
		<?php include('inc/fsFull42ItemsNavInlinePaginationOn.php'); ?>

		<h6>9 items, navigation inline, pagination off</h6>
		<?php include('inc/fsFull9ItemsNavInlinePaginationOff.php'); ?>

		<h6>9 items, navigation off, pagination on</h6>
		<?php include('inc/fsFull9ItemsNavOffPaginationOn.php'); ?>

    <h6>3 items, navigation inline, pagination on</h6>
    <?php include('inc/fsFull3ItemsNavInlinePaginationOn.php'); ?>

		<h6>9 items, navigation off, pagination off</h6>
		<?php include('inc/fsFull9ItemsNavOffPaginationOff.php'); ?>

	</div>

  <div id="micrositeFooter">
    <h2>Footer</h2>
  </div>

</div>
</div>
</div>
</body>
</html>