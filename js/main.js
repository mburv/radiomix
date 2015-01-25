var ytPlayGlobal=0;

var alreadyPlayed = new Array();

//Radio 1 loop
//Picks a random track from the Radio 1 RSS Feed
//Feeds artist and track name to queryYoutube

//When YouTube is finished playing it increments i +1
//if i=0,1,2 then run oneloop() if i=3 then run podloop()

//Get Radio 1 RSS Feed

function getSong(){

//getSong will get a random song from Radio 1 RSS and feed the title to queryYoutube()

var nowPlaying;
var playlist = new Array();


 $.ajax({
            url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D'http%3A%2F%2Fws.audioscrobbler.com%2F1.0%2Fuser%2Fbbcradio1%2Frecenttracks.rss'&diagnostics=true",
            type: 'GET', 
            dataType: 'xml',
            success: function(returnedXMLResponse){
                $('item', returnedXMLResponse).each(function(){
						videoTitle=$('title', this).text();
						playlist.push(videoTitle);
						//playlist[recordCount] = $('title', this).text();
                    //Here you can do anything you want with those temporary
                    //variables, e.g. put them in some place in your html document
                    //or store them in an associative array
		
                })
				
				var randomRecord = playlist[Math.floor(Math.random() * playlist.length)];
				
				nowPlaying=randomRecord;
				if(alreadyPlayed.indexOf(nowPlaying)>-1){
					getSong();
				}else{
					//$( ".NowPlaying" ).append( nowPlaying );
					queryYoutube(nowPlaying);
					alreadyPlayed.push(nowPlaying);
				}
            
			}  
        });

}

function queryYoutube(query){
	
	//alert("queryYoutube recieves "+playcount);
	
	var songURL;
	
	 $.ajax({
            url: "http://gdata.youtube.com/feeds/base/videos?alt=rss&q="+query+"&client=ytapi-youtube-rss-redirect&orderby=relevance&max-results=1&format=5&v=2",
            type: 'GET', 
            dataType: 'xml',
            success: function(returnedXMLResponse){
                $('item', returnedXMLResponse).each(function(){
                    	songURL = $('link', this).text();
                    //Here you can do anything you want with those temporary
                    //variables, e.g. put them in some place in your html document
                    //or store them in an associative array
						//$( ".VidURL" ).append( songURL );
						var first=songURL.replace("http://www.youtube.com/watch?v=","")
						var ytcode=first.replace("&feature=youtube_gdata","")
						//alert (ytcode);
						//alert("queryYoutube sends "+playcount);
						playYoutube(ytcode);
						console.log("queryYoutube sends "+ytcode);
                })
            }  
        });
		
	
	//queryYoutube will query the youtube RSS and pass the video URL to playYoutube()

}

function playYoutube(videoURL){
	
	console.log("queryYoutube recieves "+videoURL);
		jQuery("#youtube-player-container").tubeplayer("play", videoURL);
		$.tubeplayer.defaults.afterReady= function($player){
			jQuery("#youtube-player-container").tubeplayer("volume", 40)
			}
	
	//alert("playYoutube recieves "+ytcount);
		
	//playYoutube will play the video URL. when the video has finished it will increment a counter
	//if the counter is below 3 then it will call getSong() again if not it will execute getPodcast()
	
	jQuery("#youtube-player-container").tubeplayer({
		width: 390, // the width of the player
		height: 212, // the height of the player
		allowFullScreen: "true", // true by default, allow user to go full screen
		autoPlay:"true",
		initialVideo: videoURL, // the video that is loaded into the player
		preferredQuality: "default",// preferred quality: default, small, medium, large, hd720
		onPlay: function(id){}, // after the play method is called
		onPause: function(){}, // after the pause method is called
		onStop: function(){}, // after the player is stopped
		onSeek: function(time){}, // after the video has been seeked to a defined point
		onMute: function(){}, // after the player is muted
		onUnMute: function(){}, // after the player is unmuted
		onPlayerEnded: function(){
			ytPlayGlobal++;
			//$( ".Playcount" ).append( ytPlayGlobal );
			console.log(ytPlayGlobal);
			if (ytPlayGlobal<3){
				getSong();
			}else{
				getPodcast()
			}
		},
		onErrorNotFound: function(){
			alert("Song Not Found");
			getSong();
		}, // if a video cant be found
		onErrorNotEmbeddable: function(){
			alert("Song Not Embeddable");
			getSong();		
		}, // if a video isnt embeddable
			onErrorInvalidParameter: function(){
			alert("Song Not Recognised");
			getSong();		
		} // if a video id is malformed
	});
}

function getPodcast(){
	
		var randomRecord = podcastPlaylist[Math.floor(Math.random() * podcastPlaylist.length)];
				
		nowPlaying=randomRecord;
		if(alreadyPlayed.indexOf(nowPlaying)>-1){
			getPodcast();
		}else{
			//$( ".NowPlaying" ).append( nowPlaying );
			playPodcast(nowPlaying);
			alreadyPlayed.push(nowPlaying);
		}

	//getPodcast will loop through a bunch of Radio 4 podcast feeds
	//store the podcast urls in an array, choose a URL at random and feed URL to playPodcast()
}

var podcastPlaylist = new Array();

function playPodcast(podFile){
	$("#jquery_jplayer_1").jPlayer({
        ready: function () {
          $(this).jPlayer("setMedia", {
            title: podFile,
            mp3: podFile
          }).jPlayer("play");
        },
        swfPath: "/js",
        supplied: "mp3"
      });
    $("#jquery_jplayer_1").jPlayer( "setMedia", {
            title: podFile,
            mp3: podFile
    });
	$("#jquery_jplayer_1").jPlayer("play");
	$("#jquery_jplayer_1").bind($.jPlayer.event.ended, function() {
		getSong();
		ytPlayGlobal=0;
		
	});
		//playPodcast will play a podcast URL and when finished it will execute getSong()
}

var podcastQuery="https://query.yahooapis.com/v1/public/yql?q=select%20title%2C%20link%2C%20pubDate%20from%20rss%20where%20url%20in%20(%0A%20%20%20%20'http%3A%2F%2Fdownloads.bbc.co.uk%2Fpodcasts%2Fradio4%2Fr4friendship%2Frss.xml'%2C%0A%20%20%20%20'http%3A%2F%2Fdownloads.bbc.co.uk%2Fpodcasts%2Fradio4%2Ftoday%2Frss.xml'%2C%0A%20%20%20%20'http%3A%2F%2Fdownloads.bbc.co.uk%2Fpodcasts%2Fradio4%2Fthought%2Frss.xml'%2C%0A%20%20%20%20'http%3A%2F%2Fdownloads.bbc.co.uk%2Fpodcasts%2Fradio4%2Ftotd%2Frss.xml'%2C%0A%20%20%20%20'http%3A%2F%2Fdownloads.bbc.co.uk%2Fpodcasts%2Fradio4%2Fonetoone%2Frss.xml'%2C%0A%09'http%3A%2F%2Fdownloads.bbc.co.uk%2Fpodcasts%2Fradio4%2Fwtps%2Frss.xml'%2C%0A%09'http%3A%2F%2Fdownloads.bbc.co.uk%2Fpodcasts%2Fradio4%2Fprofile%2Frss.xml'%2C%0A%09'http%3A%2F%2Fdownloads.bbc.co.uk%2Fpodcasts%2Fradio4%2Fipm%2Frss.xml'%2C%0A%09'http%3A%2F%2Fdownloads.bbc.co.uk%2Fpodcasts%2Fradio4%2Fmoreorless%2Frss.xml'%2C%0A%09'http%3A%2F%2Fdownloads.bbc.co.uk%2Fpodcasts%2Fradio4%2Fpov%2Frss.xml'%2C%0A%09'http%3A%2F%2Fdownloads.bbc.co.uk%2Fpodcasts%2Fradio4%2Fcookperfect%2Frss.xml'%2C%0A%09'http%3A%2F%2Fdownloads.bbc.co.uk%2Fpodcasts%2Fradio4%2Fthpop%2Frss.xml'%2C%0A%09'http%3A%2F%2Fdownloads.bbc.co.uk%2Fpodcasts%2Fradio4%2Fhbn%2Frss.xml'%2C%0A%09'http%3A%2F%2Fdownloads.bbc.co.uk%2Fpodcasts%2Fradio4%2Fmyshakespeare%2Frss.xml'%2C%0A%09'http%3A%2F%2Fdownloads.bbc.co.uk%2Fpodcasts%2Fradio4%2Ftne%2Frss.xml'%2C%0A%09'http%3A%2F%2Fdownloads.bbc.co.uk%2Fpodcasts%2Fradio4%2Ftne%2Frss.xml'%2C%0A%09'http%3A%2F%2Fdownloads.bbc.co.uk%2Fpodcasts%2Fradio4%2Fr4shakespeare%2Frss.xml'%2C%0A%09'http%3A%2F%2Fdownloads.bbc.co.uk%2Fpodcasts%2Fradio4%2Fsportbrit%2Frss.xml'%2C%0A%09'http%3A%2F%2Fdownloads.bbc.co.uk%2Fpodcasts%2Fradio4%2Fahow%2Frss.xml'%2C%0A%09'http%3A%2F%2Fdownloads.bbc.co.uk%2Fpodcasts%2Fradio4%2Fmaths%2Frss.xml'%2C%0A%09'http%3A%2F%2Fdownloads.bbc.co.uk%2Fpodcasts%2Fradio4%2Fpovcj%2Frss.xml'%0A)%20%7C%20sort(field%3D%22pubDate%22%2C%20descending%3D%22true%22)&diagnostics=true";

populatePodcasts(podcastQuery);

function populatePodcasts(podcastUrl){
	
	var podfile

		$.ajax({
				url: podcastUrl,
				type: 'GET', 
				dataType: 'xml',
				success: function(returnedXMLResponse){
					$('item', returnedXMLResponse).each(function(){
							podfile=$('link', this).text();
							podcastPlaylist.push(podfile);
							console.log (podfile);
					})
				
				}  
			});
	
}

function start(){
getSong();
}

start();