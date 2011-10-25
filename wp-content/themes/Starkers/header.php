<?php
/**
 * The Header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="main">
 *
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>" />
<title><?php
	/*
	 * Print the <title> tag based on what is being viewed.
	 * We filter the output of wp_title() a bit -- see
	 * twentyten_filter_wp_title() in functions.php.
	 */
	wp_title( '|', true, 'right' );

	?></title>
<link rel="profile" href="http://gmpg.org/xfn/11" />
<link rel="stylesheet" type="text/css" media="all" href="<?php bloginfo( 'stylesheet_url' ); ?>" />
<!--Loading CSS-->
<link type="text/css" href="<?php bloginfo('template_directory'); ?>/css/screen.css" rel="stylesheet" media="screen" />
<link type="text/css" href="<?php bloginfo('template_directory'); ?>/css/photo_folio.css" rel="stylesheet" media="screen" />
<link type="text/css" href="<?php bloginfo('template_directory'); ?>/css/bi_img_slider.css" rel="stylesheet" media="screen" />
<link type="text/css" href="<?php bloginfo('template_directory'); ?>/css/photo-cont-thumbs.css" rel="stylesheet" media="screen" />
<link type="text/css" href="<?php bloginfo('template_directory'); ?>/css/photo_folio.css" rel="stylesheet" media="screen" />
<!-- WP-Minify CSS -->

<!--[if IE]>
           <link rel="stylesheet" type="text/css"  href="<?php bloginfo('template_directory'); ?>/css/ie.css">
<![endif]-->
<!--[if IE 7]>
	   	   <link rel="stylesheet" type="text/css"  href="<?php bloginfo('template_directory'); ?>/css/ie7.css">
<![endif]-->
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />

<!--[if (gte IE 7)&(lte IE 8)]>
<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
<script type="text/javascript" src="<?php bloginfo('template_directory'); ?>/js/selectivizr-min.js"></script>
<![endif]-->

<!--Loading JSvascript-->
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js"></script>
<script type="text/javascript" src="<?php bloginfo('template_directory'); ?>/js/jquery.tweet.js"></script>
<script type="text/javascript" src="<?php bloginfo('template_directory'); ?>/js/default.js"></script>
<script type="text/javascript" src="<?php bloginfo('template_directory'); ?>/js/default_last.js"></script>
<!-- WP-Minify JS -->
<?php
	/* We add some JavaScript to pages with the comment form
	 * to support sites with threaded comments (when in use).
	 */
	if ( is_singular() && get_option( 'thread_comments' ) )
		wp_enqueue_script( 'comment-reply' );

	/* Always have wp_head() just before the closing </head>
	 * tag of your theme, or you will break many plugins, which
	 * generally use this hook to add elements to <head> such
	 * as styles, scripts, and meta tags.
	 */
	wp_head();
?>
</head>
<?php
    //Adding a UserAgent Class to main body for CSS exceptions
    $browser_info = get_browser(null, true);
            $browser = strtolower ($browser_info['browser']); 
           
           if( $browser == 'ie'){
            
            $ver  = $browser_info['majorver'];
            $browser = "ie ie".$ver;
            
           }
           
           $browser .= ($browser_info['ismobiledevice'])? " mobile" : "";
?>


<body <?php body_class($browser); ?>>

<!-- Page HEADER -->
    
<header id="header"> 
     <div id="main_hd"> 
	 	<div class="wrapper">
			<a id="logo_hd" href="/"><img src="<?php bloginfo('template_directory'); ?>/img/main_logo.png" alt="Belle Idea" ></a>                                        
                   
                   <?php wp_nav_menu( array( 'theme_location' => 'primary','menu_class' => 'navBar_hd' ) ); ?>
        </div>
	 </div>
     <!-- Page Header comes here -->
     <?php if (isset($page_submenu)){
        
            echo $page_submenu;
        
        } ?>
</header> <!--//Page HEADER -->