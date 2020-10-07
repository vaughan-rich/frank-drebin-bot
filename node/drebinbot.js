/* THIS BOT:

* POSTS DAILY DREBIN QUOTES TO TWITTER
* RETWEETS #frankdrebinbot
* FAVOURITES #thenakedgun #nakedgun #leslienielsen #frankdrebin #frankdrebinbot

*/

console.log('|_-_-_-_-_-_-_-_-_-_-| THE BOT IS STARTING NOW |_-_-_-_-_-_-_-_-_-_-|');

var config = require('./config');
var quotes = require('./quotes');
var Twit = require('twit');

// Authenticate with OAuth, using separate config.js file which holds API keys
var T = new Twit(config);

// ------------------------------------------------------------------- //

// For my own testing purposes
function timePassed() {
    console.log('|****************************************| 30 MINS PASSED |****************************************|');
}
setInterval(timePassed, 1800000);

// ------------------------------------------------------------------ //

// POSTING QUOTES TO TWITTER:

//postTweet();
setInterval(postTweet, 86400000); // every 24 hours. 1800000 is 30 mins. 600000 is 10 mins.

function postTweet() {
    
    console.log("|----------------------------------------------------------------|");
    console.log("|--------------------| BEGINNING TWEET POST |--------------------|");
    
    var quoteNum = Math.floor(Math.random()*(quotes.length - 1)); // generate random num

    console.log('There are ' + quotes.length + ' quotes in total.');
    
    console.log('Randomly chosen quote number: ' + quoteNum);
    
    var tweet = {
    status: quotes[quoteNum] // pick a random quote from the array of strings
    }
    
    var chosenQuote = quotes[quoteNum];
    
    var mytweets = {
        user_id: "1023991795989012483",
        count: 30,
        result_type: 'recent'
    }
    
    // Search my 30 most recent tweets for repeats
    T.get('statuses/user_timeline', mytweets, searchMyTweets);
    
    function searchMyTweets(err, data, response) {
        loop();
        
        function loop() {
            
            for (let kk = 0; kk < data.length; kk++) {
                
                console.log("----------------------");
                console.log(chosenQuote);
                console.log(data[kk].text);
                console.log("----------------------");
                
                if (chosenQuote.substring(0,10) === data[kk].text.substring(0,10)) {
                    
                    console.log("Matches");
                    var quoteNum = Math.floor(Math.random()*(quotes.length - 1));
                    console.log('New, randomly chosen quote number: ' + quoteNum);
                    chosenQuote = quotes[quoteNum];
                    var tweet = {
                        status: quotes[quoteNum] // pick a random quote from the array of strings
                    }
                    kk = 0; // restarts loop
                }
                else {
                    console.log(kk + " doesn't match.");
                }  
            }  
        } 
        
        console.log("LOOP DONE. NO MATCHES IN LAST 30 TWEET. PROCEEDING TO POST QUOTE.");
        
        T.post('statuses/update', tweet, tweeted);  
        
        function tweeted(err, data, response) {
            if (err) {
                console.log('Something went wrong when tweeting the quote... HERE IS THE ERROR: ' + err);
            }
            else {
                console.log('QUOTE TWEET HAS BEEN SUCCESSFULLY POSTED!!!');    
            }
        }
    }
    
    console.log("|--------------------| ENDING TWEET POST |--------------------|");
    console.log("|----------------------------------------------------------------|");
}

// ------------------------------------------------------------------ //

// RETWEETING #frankdrebinbot. Looks for retweet opportunties every 2 hours - tries the last 5 recent tweets with the hashtag.

//hashtagSearch();
setInterval(hashtagSearch, 7200000); // every 2 hours

function hashtagSearch() {
    
    console.log("|--------------------| BEGINNING #frankdrebinbot SEARCH |--------------------|");
    
    var params = {
        q: '#frankdrebinbot',
        count: 5,
        result_type: 'recent' // looks for 5 most recent tweets
    };

    T.get('search/tweets', params, retweet); // search Twitter for posts to retweet
    
    function retweet(err, data, response) {
        
        if (!err) {   
            
            console.log(data.statuses.length + " retweetable tweets have been found, to loop through.");
            console.log("|-- STARTING RETWEET LOOP --|");
            
            if (data.statuses.length > 0) { // Make sure there are actually some tweets to retweet
            
                // Loop through retweetable tweets
                for (let n = 0; n < data.statuses.length; n++) {

                    let id = { id: data.statuses[n].id_str }

                    // Try to retweet each
                    T.post('statuses/retweet/:id', id, function(err2, response) {

                        // If the retweet fails, log an error
                        if (err2) {
                            console.log("Tweet with ID: " + data.statuses[n].id_str + " wasn't retweeted this time. HERE IS THE ERROR: " + err2);
                        }
                        else {
                            // Generate the URL of the retweeted tweet
                            let username = response.user.screen_name;
                            let tweetId = response.id_str;
                            console.log('TWEET RETWEETED!!!', `https://twitter.com/${username}/status/${tweetId}`);
                        }
                    });
                }  
            }
            else {
                console.log("No Tweets found to retweet...");
            }
        }
        else {
        console.log("Something went wrong whilst searching for retweets. HERE IS THE ERROR: " + err);
        }
    } 
}

// ------------------------------------------------------------------ //

// FAVOURITING #thenakedgun #nakedgun #frankdrebin #frankdrebinbot #leslienielsen content. Looks for 20 most recent tweets with any of these tags and loops through them, favouriting any that haven't been favourited already.

//favouriteSearch();
/*setInterval(favouriteSearch, 1680000); // every 28 mins

function favouriteSearch() {
    
    console.log("|--------------------| BEGINNING FAVOURITING SEARCH |--------------------|");
    
    var favparams = {
        q: '#thenakedgun OR #nakedgun OR #frankdrebin OR #frankdrebinbot OR #leslienielsen',
        count: 20,
        result_type: 'recent' // looks for 20 most recent tweets
    }
    
    T.get('search/tweets', favparams, favourite); // search Twitter for posts to favourite
    
    function favourite(err, data, response) {
        
        if (!err) {
            
            console.log("There are " + data.statuses.length + " favouritable tweets found, to loop through.")
            console.log("|-- STARTING FAV LOOP --|");
            
            if (data.statuses.length > 0) { // Make sure there are actually some tweets to favourite
            
                // Loop through favouritable tweets
                for (let k = 0; k < data.statuses.length; k++) {

                    let id = { id: data.statuses[k].id_str }

                    // Try to favourite each
                    T.post('favorites/create', id, function(err2, response) {

                        // If the favourite fails, log an error
                        if (err2) {
                            console.log("Tweet with ID: " + data.statuses[k].id_str + " wasn't favourited this time. HERE IS THE ERROR: " + err2);
                        }
                        else {
                            // Generate the URL of the favourited tweet
                            //let username = response.user.screen_name;
                            //let tweetId = response.id_str;
                            //console.log('TWEET FAVOURITED!', `https://twitter.com/${username}/status/${tweetId}`);
                            console.log('TWEET FAVOURITED??? ID: ' + data.statuses[k].id_str);
                        }
                    });
                }  
            }
            else {
                console.log("No tweets found to favourite...");
            }
        }
        else {
            console.log("Something went wrong whilst searching for favourites. HERE IS THE ERROR: " + err);    
        }
    }    
}*/