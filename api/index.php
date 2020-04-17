<?php

require_once ('vendor/autoload.php');

function populationSort($a, $b) {
    return $b->population - $a->population;
} 

function processJSON($response_body, $searchType) {
    
    if ($searchType == 3) {
        // edge case for single country returned
        $response_body = '[' . $response_body . ']';
    }
    
    // converts string to JSON object
    $decoded_body_to_process = json_Decode($response_body);

    // sort by population
    usort($decoded_body_to_process, 'populationSort');
    
    // encode back to JSON
    $sortedJSON = json_encode($decoded_body_to_process);

    //return sorted and encoded;
    return $sortedJSON;
}

function readByName($client, $endpoint, $searchType) {
    try {
        $response = $client->request('GET', $endpoint);
        $response_body = $response->getBody();

    } catch (RequestException $ex) {
        echo "HTTP Request failed\n";
        echo "<pre>";
        print_r($ex->getRequest());
        echo "</pre>";
        
        if ($ex->hasResponse()) {
            echo $ex->getResponse();
          
        }
    }
    $processedJSON = processJSON($response_body, $searchType); // do you want this here?
    print_r ($processedJSON);  

}

// logic when receiving GET from JS
if (isset($_GET['term']) && isset($_GET['type'])) {
    $client = new GuzzleHttp\Client();
    $url = "https://restcountries.eu/rest/v2/";
    $searchTerm = $_GET['term'];
    $searchType = $_GET['type'];
    $endpoint = "";

    if ($searchType == 3) {
        $endpoint = "${url}alpha/${searchTerm}";
    } else if ($searchType == 2) {
        $endpoint = "${url}name/${searchTerm}?fullText=true";
    } else if ($searchType == 1) {
        $endpoint = "${url}name/${searchTerm}"; 
    } 
    
    readByName($client, $endpoint, $searchType);
}


?>

