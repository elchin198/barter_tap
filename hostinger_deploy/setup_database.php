<?php

/**
 * Database setup script for BarterTap.az
 * 
 * This script is used to set up the database for the BarterTap.az on Hostinger.
 * Run this script once after deploying the files to Hostinger.
 */

// Include the database setup file
include_once('hostinger_db_setup.php');

// Redirect to homepage after setup
header('Location: /');
?>