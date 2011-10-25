<?php

#FirePHP SETUP

$PHP_SELF = $_SERVER['DOCUMENT_ROOT'];

require_once($PHP_SELF.'/FirePHPCore/FirePHP.class.php');

ob_start(); //Output buffer

#End of FirePHP setup



class Flickr{

#Class Vars

	protected $API_keys = array(

	'api_key'	=> '59f274e3514f672180c069409c7b745f',

	'user_id'   => '47320488@N04'

	);

	protected $error_msg = "Sorry, the API call has failed";

	protected $base_url = 'http://api.flickr.com/services/rest/?';

	protected $sql_connection; //MySQLi Connection

	protected $firePHP; //Debugger console

##Constructor	

	function __construct() {

       //$this->sql_connection = new mysqli('localhost','belleide_alfsaav','jesus9284','belleide_gallery');

	   $this->firePHP = FirePHP::getInstance(true);//Set debugger

   }	

##Insertion of 1 Collection	

	public function ins_coll($col_id){

	

		$console = $this->firePHP;



		$params = array(

		'method'	=> 'flickr.collections.getTree',

		'collection_id' => $col_id,

		'format'	=> 'php_serial'

		);



		$rsp = $this->REST($params);

        

      	//Check if response is valid

		if ($rsp['stat'] == 'ok'){

		

    		$mysqli = $this->sql_connection; //Set connection

            ###

            ##Collection information INSERT

    		###

            //Filtering Colleciton containing colleciton info

            $collection_info = $rsp['collections']['collection'][0];

            $slug_col_id = $this->friendly_url($collection_info['title']); //Friendly URL

            $n_sets = count($collection_info['set']);

            $query = "INSERT IGNORE INTO `collection`

                           (`collection_id`,`slug_id`,`title`,`n_sets`) 

                           VALUES ('$col_id','$slug_col_id','{$collection_info['title']}','$n_sets')";

            

            //Inserting query

            $mysqli->query($query, MYSQLI_STORE_RESULT);

            

            if($mysqli->errno) {

    		printf("Unable to connect to the database: <br /> %s <br /> ",

    		$mysqli->error);

    		}

    		printf("\r %d collection inserted.<br />", 

    		$mysqli->affected_rows);

            

            

    		//Filtering Colleciton containing sets array

            $collection = $rsp['collections']['collection'][0]['set'];

            

    		$data_v = array(); //Array that will input set attributes in Photoset Table

    		$col_set_v = array(); //Array that will input set and coll attributes in Photoset-Collection Table

    		

            $index  = 0;

            foreach($collection as $set){

        		

                $slug_id = $this->friendly_url($set['title']); //Friendly URL

        		

        		$data_v[] = "('{$set['id']}','{$set[title]}','$slug_id')";

                $col_set_v[] = "('{$set['id']}','$col_id','$index')";

                $index += 1;           

                             

    		}

            ###

            ##Photoset Information INSERT

    		###

            $query = "INSERT IGNORE INTO photoset 

    				(`photoset_id`,`title`,`slug_id`)

    				VALUES ".implode(',',$data_v);

    

    		$mysqli->query($query, MYSQLI_STORE_RESULT);

    

    		if($mysqli->errno) {

    		printf("Unable to connect to the database: <br /> %s <br /> ",

    		$mysqli->error);

    		}

    		printf("\r %d Photoset rows have been inserted.<br />", 

    		$mysqli->affected_rows);

    		###

            ##COLL-SET Information INSERT

            ###

            $query = "INSERT IGNORE INTO `set-has-col`

					  (`photoset_id`,`collection_id`,`index`)

					  VALUES ".implode(',',$col_set_v);

			

            $mysqli->query($query, MYSQLI_STORE_RESULT);

            

            printf("\r %d coll-set row have been inserted.<br />", 

    		$mysqli->affected_rows);

    		

            ###

            ##Insert routine for Images based on the photoset inserted

            ###

    		foreach($collection as $set){

    			$this->ins_photos($set['id']);

    		}//End of ForEach

		

    	}else{

    		echo "Error in Flickr call";

    	}

}//End of ins_sets

##Insertion of Photos based on Photoset_ID

	public function ins_photos($set_id){

		

		$console = $this->firePHP;



		$params = array(

		'method'	=> 'flickr.photosets.getPhotos',

		'photoset_id' => $set_id,

		'format'	=> 'php_serial',

		'extras'      => 'url_o,url_m,url_s,last_update' 

		);

		

		$rsp = $this->REST($params);

		

		//Check if response is valid

		if ($rsp['stat'] == 'ok'){

		

			$photoset = $rsp['photoset']; //Traverse through response and sending array of pictures to get inserted in SQL table

			$mysqli = $this->sql_connection; //Set connection

            

        	$photoset_id = $photoset['id']; 

            $n_photos = count($photoset['photo']);//Getting number of pics per set

            

               

            

            $data_v = array(); 

			$img_set_v = array();

			

            $index = 0;

            

            foreach($photoset['photo'] as $pic){

			//Data for images table insertion 
            
            
            
			$data_v[] = "('{$pic['id']}',

					   '{$pic[url_o]}','{$pic[url_m]}', '{$pic[url_s]}',

					   '{$pic[height_o]}','{$pic[height_m]}','{$pic[height_s]}',

					   '{$pic[width_o]}','{$pic[width_m]}','{$pic[width_s]}',

					   '{$pic[title]}','{$pic[lastupdate]}'

				)";

			

            

            

			//Data for img-photoset table insertion 

			$img_set_v[] = "('{$pic['id']}', $photoset_id,'$index')";

            $index += 1;

			}

            

            ######

			###Inserting values to Images table	

			######

			$query = "INSERT IGNORE INTO images 

					(`pic_id`,

					`url_l`,`url_m`,`url_s`,

					`height_l`,`height_m`,`height_s`,

					`width_l`,`width_m`,`width_s`,

					`title`,`flickr_last_mod`)

					VALUES ".implode(',',$data_v)
                    
                    ." ON DUPLICATE KEY UPDATE `flickr_last_mod` = VALUES(`flickr_last_mod`)";
                    
            
			$mysqli->query($query, MYSQLI_STORE_RESULT);
            
            if($mysqli->errno) {

			printf("[Images] Unable to connect to the database: <br /> %s <br /> ",

			$mysqli->error);

			}

			printf("\r %d Image rows have been inserted.<br />", 

			$mysqli->affected_rows);
            
            
            ######

			###Inserting values to many to many table	

			######

            $query = "INSERT IGNORE INTO `img-has-set`

					  (`pic_id`,`photoset_id`,`index`)

					  VALUES ".implode(',',$img_set_v);

			$mysqli->query($query, MYSQLI_STORE_RESULT);

			

            //Checking for errors and rows affected

            if($mysqli->errno) {

			printf("[img-has-set]Unable to connect to the database: <br /> %s <br /> ",

			$mysqli->error);

			}

			printf("\r %d [img-has-set] rows have been inserted.<br />", 

			$mysqli->affected_rows);

            

            ######

            ###Updating Photoset with number of photos for that photoset

            ######

            $query = "UPDATE `photoset` 

                      SET `n_pics` = '$n_photos',`gall_pic` ='{$photoset['primary']}'

                      WHERE `photoset_id`= '$set_id'";

			

            $mysqli->query($query);

  	        if($mysqli->errno) {

            $err = sprintf ("\r Error: %s , N_photos: $n_photos  Set_id: $photoset_id <br />",$mysqli->error);

            }

            $msg = sprintf ("\r %d Photoset rows have been updated with new n_pic values .<br />",$mysqli->affected_rows);

            

            



		}else{ //End of SQL Ins

		

			echo "Error in Flickr call";

		}

	}//End of ins_photos Method



#Get PhotoSet pictures in an array

	public function getPhotos($set_id){

	

	$console = $this->firePHP;

    

    $mysqli = $this->sql_connection; //Set connection

	

	$query = "SELECT `images`.`url_l`, `images`.`title` 

              FROM `images` NATURAL JOIN `img-has-set` 

              WHERE `img-has-set`.`photoset_id` = '$set_id'";

              

    $result = $mysqli->query($query);

        

        

        //If there is no errors

         if(!$mysqli->errno AND $mysqli->affected_rows > 0){

            

            $photoset = array();

            while ($row = $result->fetch_object() ) {

                $obj = array(

        		'url_l'	=> $row->url_l,

        		'title' => $row->title

        		);

                

                $photoset[] = $obj; 

            }

       	   

            $obj_resp = array('success'=>true, //set response obj

                              'images'=>$photoset);

           

        }else{ //If Error

       

            $obj_resp = array('success'=>false, //set response obj

                              'Error'=>$mysqli->error);

        }

       //Respond OBJ

       return $obj_resp;

       

	}//End of getPhotos

#Get Collection in an array

	public function getCollection($coll_id){

	

	$console = $this->firePHP;

    $mysqli = $this->sql_connection; //Set connection

	

	//Fetch all Collections with a given coll_id

    $query = "SELECT `p`.`photoset_id`,`p`.`slug_id`, `p`.`title`,`p`.`n_pics`,`i`.`url_s`,`i`.`height_s`,`i`.`width_s`,`s_c`.`index`

              FROM `photoset` `p` NATURAL JOIN `set-has-col` `s_c` LEFT JOIN `images` `i`

              ON `p`.`gall_pic` = `i`.`pic_id`

              WHERE `s_c`.`collection_id` = '$coll_id'

              ORDER BY `index` DESC";

              

    $result = $mysqli->query($query);

    

    $collection = array();

    

    if(!$mysqli->errno){

    

        while ($row = $result->fetch_object())

        {

            $obj = array(

    		'id' => $row->photoset_id,

            'slug_id' => $row->slug_id, //if url needs be decoded use: urldecode()

    		'title' => $row->title,

            'n_pics' => $row->n_pics,

            'url_s' => $row->url_s,

            'height_s' => $row->height_s,

            'width_s' => $row->width_s,

            'index' => $row->index

    		);

            

            $collection[] = $obj; 

        }

   	   

       $obj_resp = array('success'=>true, //set response obj

                         'id'=> $coll_id,

                         'collection'=>$collection);

       

    }else{//If Error

         

       $obj_resp = array('success'=>false, //set response obj

                              'Error'=>$mysqli->error);

    }

   //Respond OBJ

   return $obj_resp;

       

	}//End of getCollection



##Get Collection in an array

	public function getAllCollections(){

	   

       	

	$console = $this->firePHP;

    $mysqli = $this->sql_connection; //Set connection

	

	//Fetch all Collections with a given coll_id

    $query = "SELECT * FROM `collection` ORDER by `index`";

              

    $result = $mysqli->query($query);

    

    $colls = array();

    

    if(!$mysqli->errno){

    

        while ($row = $result->fetch_object())

        {

            $obj = array(

    		'id'	=> $row->collection_id,

            'slug_id'	=> $row->slug_id, //if url needs be decoded use: urldecode()

    		'title' => $row->title,

            'n_sets' => $row->n_sets,

            'description' => $row->description,

            'index' => $row->index

    		);

            

            $colls[] = $obj; 

        }

   	   

       $obj_resp = array('success'=>true, //set response obj

                         'collections'=>$colls);

       

    }else{//If Error

         

       $obj_resp = array('success'=>false, //set response obj

                              'Error'=>$mysqli->error);

    }

   //Respond OBJ

   return $obj_resp;



    }

##Set Img Rating for each picture

	public function set_img_rating($pic_id,$rating){

	   

       $console = $this->firePHP;

       

       settype($rating, 'integer');

         

       //Check to make sure the rating follows DB reqs

       if (is_integer($rating) AND $rating >0 AND $rating <= 100){

    

        $mysqli = $this->sql_connection; //Set connection

    	

        //Insert Rating        

    	$query = "INSERT INTO `ratings` 

                  (`rate`,`pic_id`) 

                  VALUES('$rating','$pic_id')"; 

                  
 

        $mysqli->query($query);             

        

        

         

         //If success Respond with new pic stats

         if($mysqli->errno OR $mysqli->affected_rows == 0) {

             

             

             $obj_resp = array('success'=>false, //set response obj

                               'Error'=>$mysqli->error);

         

         }else{

            

            $query  = "SELECT `pic_id`,`rating`,`n_votes` FROM `images` WHERE `pic_id` = '$pic_id'";

            $data = $mysqli->query($query);

            

            //If no Errors

            if(!$mysqli->errno){

                

                $row = $data->fetch_object();

                $resp = array(

                    		'id'	=> $row->pic_id,

                            'rating'	=> $row->rating,

                    		'n_votes' => $row->n_votes

                    		);

                
                $obj_resp = array('success'=>true, //set response obj

                                  'pic_stats'=>$resp);

                

            }else{

                

                $obj_resp = array('success'=>false, //set response obj

                                  'Error'=>$mysqli->error);

            }

            

         }//End SQL Errors check

      

       }else{

        

        

        $obj_resp = array('success'=>false, //set response obj

                          'Error'=>'Incorrect Rating value, value has to between 1-100');

        

       }//End of rating val check

       

       //Respond OBJ

       return $obj_resp;

       

    }//End of setting rating   

    	  

##Rest Method	

	public function REST($params){

        

		if(is_array($params)){

		

		//Encoding params into URL friedly query strings (e.g. size=five)

		

		$params = array_merge($params, $this->API_keys);

		$encoded_params = array();

		foreach ($params as $k => $v){

				 $encoded_params[] = urlencode($k).'='.urlencode($v);

			}

		//call the API and decode the response

		$url_call = $this->base_url.implode('&', $encoded_params);

	

		$rsp = file_get_contents($url_call);

		if($rsp == false) {

		return $error_msg;

		}

		

		//Response different formats

		if (array_key_exists("format", $params)){

		

			switch($params["format"]) {

				case "json":

					return $rsp;

					break;

				case "php_serial":

					$response = unserialize($rsp);

					return $response;

					break;

			}

		}

		else

		{

		return $rsp;

		}

		

		}

		else

		{

		return $error_msg;

		}

		

	}//End of REST func





	public function u_collection_slug(){

	

    /*   

  	$console = $this->firePHP;

    $mysqli = $this->sql_connection; //Set connection

	

	//Fetch all Collections with a given coll_id

    $query_select = "SELECT `p`.`title` ,`sc`.`photoset_id`, `p`.`time`

              FROM `set-has-col` as `sc` JOIN `photoset` as `p`

              ON `sc`.`photoset_id` = `p`.`photoset_id`

              ORDER BY `p`.`time`";

              

    $result = $mysqli->query($query_select);

    

    $slug = array();

    

    while ($row = $result->fetch_object())

    {

        $slug[] = $this->friendly_url($row->title); 

    }

    

    $query = "UPDATE ($query_select) as `p` 

              SET `p`.`title` = CONCAT(`p`.`title`,`_test`) 

              WHERE `p`.`photoset_id` = `` ";

    */

    }





##

##Helper Methods

	

##Format JSON response

    public function json_resp($obj, $success){   

              

        

        if($success){

            $parent = array(

                      'success'=> 'ok',

                      'data'=> $obj

                      );

        }else{

            $parent = array(

                      'success'=> 'no',

                      'data'=> $obj

                      );

        }

        

        $json = json_encode($parent);

        return $json;

    } 



##Get friendly URL //Replaces spaces with underscore and encodes unfriendly characters (e.g. %,&)

    public function friendly_url($str){   

        

        /*

       	var slugcontent_hyphens = slugcontent.replace(/\s/g,'-');

	    var finishedslug = slugcontent_hyphens.replace(/[^a-zA-Z0-9\-]/g,'');

        */

        $f_url = trim(strtolower($str));

        $f_url = preg_replace ('/&/', "and", $f_url); //friendly url

        $f_url = preg_replace ('/\s/', "-", $f_url); //friendly url

        $f_url = preg_replace ('/[^a-zA-Z0-9\-]/', '', $f_url);

        

        return $f_url;

    }      

}//End of flickr class

?>