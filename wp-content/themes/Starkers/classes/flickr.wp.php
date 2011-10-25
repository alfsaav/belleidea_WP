<?php
/**
 * @author Alfredo 
 * @copyright 2011
 * Description: This Class is a wrapper for the flickr API
 */
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

       $this->firePHP = FirePHP::getInstance(true);//Set debugger

   }	

##Insertion of Photos based on Photoset_ID

	public function get_photos($set_id){

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
            
            $data_v = array(
                             'id' => $set_id,
                             'n_pics' => $photoset['total']
                          );
                           
			$pic_v = array();
           
            foreach($photoset['photo'] as $pic){

			//Data for images table insertion 
            
            $pic_v[] = array(

                            'id' =>  $pic['id'],
                            'url_l' => $pic['url_o'],
                            'url_m' => $pic['url_m'],
                            'url_s' => $pic['url_s'],
                            'width_l' => $pic['width_o'],
                            'width_m' => $pic['width_m'],
                            'width_s' => $pic['width_s'],
                            'height_l' => $pic['height_o'],
                            'height_m' => $pic['height_m'],
                            'height_s' => $pic['height_s']
                            );

			}//End of Loop

            //Adding the pics vector to main data vector
            $data_v['pics'] = $pic_v;  

       	}else{ //If null response from Rest call

		

			echo "Error in Flickr call";

		}
        
       return $data_v;
    
    }//End of ins_photos Method



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
}//End of flickr class

?>