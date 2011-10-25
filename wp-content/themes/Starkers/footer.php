<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the id=main div and all content
 * after.  Calls sidebar-footer.php for bottom widgets.
 *
 * @package WordPress
 * @subpackage Starkers
 * @since Starkers 3.0
 */
?>

<div id="foot_wrap" class="clear_bi">   <!--FOOTER-->                  
 

 <div id="footer" class="wrapper">
  <!--Twitter Feed--> 
<div id="twitt_hd"> 

    <span id="tl_tw_hd">Twitter:</span><span class="tweet"></span>

</div>  
					                   

                <div id="first_ft">

                     <ul>

					      <li><a href="/portfolio/web/">portfolio</a> | </li>

                          <li><a href="/services/">services</a> | </li>

                          <li><a href="/about/">about</a> | </li>

                          <li><a href="/blog/">blog </a></li>

					</ul>

                     

                    <p>

                    Copyright &copy; 2008-<?php echo date("Y"); ?> BelleIdea<br>

                    All rights reserved.

                    </p>

                </div>

                    

                 <div id="second_ft">  

                         <h2>About</h2>

                           <p>Although I have a degree in Mechanical Engineering,  I have decided to persue my passion: Communicating and expressing ideas through art and technology. <a href="/about/">[...]</a> <br>

						 

                          </p>

                </div>

                 

                <div id="third_ft">

                             <h2>Contact</h2>

                            <p>Feel free to <a href="/contact/">contact me </a>if you have a project you would like to discuss, or if you have suggestions or questions about the site and even if you just want to say hi.</p>

                            <p>Phone: 011-1-(801)885-7488 <br>

							Email: <a href="mailto:alfredo@belleidea.com"> <br>

							alfredo@belleidea.com</a> <br>

							Or drop me a line <a href="/contact/">here</a>. </p>

                </div>

                            

                <div id="fourth_ft">

                  <h2>Stay in touch</h2>

                  

                      <ul>

                         <li><a href="/contact/"> <img  src="<?php bloginfo('template_directory'); ?>/img/icons/email.png" alt="email me">Contact me</a> </li>

                          <li><a href="/blog/feed/"><img  src="<?php bloginfo('template_directory'); ?>/img/icons/feed.png" alt="rss">RSS Feed</a>  </li>

                          <li><a target="_blank" href="http://twitter.com/alfsaav"><img  src="<?php bloginfo('template_directory'); ?>/img/icons/twitter.png" alt="twitter">Twitter</a>  </li>

                          <li><a target="_blank" href="http://www.facebook.com/alfredo.saavedra"><img  src="<?php bloginfo('template_directory'); ?>/img/icons/facebook.png" alt="facebook">Facebook</a> </li>

                          <li><a target="_blank" href="http://www.flickr.com/photos/alfredo-saavedra/"><img  src="<?php bloginfo('template_directory'); ?>/img/icons/flickr.png" alt="flickr">Flickr </a> </li>

                          <li><a target="_blank" href="http://www.linkedin.com/in/alfredosaavedra"><img  src="<?php bloginfo('template_directory'); ?>/img/icons/linkedin.png" alt="linkedin">LinkedIn </a> </li>                                                                      

                      </ul>

                </div>

                

</div></div><!--End of footer_wrapper-->
<?php
	/* Always have wp_footer() just before the closing </body>
	 * tag of your theme, or you will break many plugins, which
	 * generally use this hook to reference JavaScript files.
	 */

	wp_footer();
?>
</body>
</html>