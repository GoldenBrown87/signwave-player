var storedMedia = (function() {
	
	var path = require("path");
	var fs = require("fs");
	var _crypto = require("crypto");
	
	var cachePath = path.join(__dirname,"cache");
	var cachedPlaylist = path.join(cachePath,"playlist.json");
	
	var playlist = require(cachedPlaylist);
	
	var itemsInPlaylist = playlist.package.itemquantity;
	var playlistPosition = 0;
	var mediaPlaying = false;
	var timer;
	
	function isAvailable()
	{
		return false;
	}
	
	function play()
	{
		if (verifyAssets())
			playFromCache();
	}
	
	function stop()
	{
		console.log("stop");
	}
	
	function playFromCache()
	{
		// initialise and clear the canvas
		var theCanvas = document.getElementById("playerCanvas");
		//theCanvas.innerHTML = "";
		
		for (i=0;i<itemsInPlaylist;i++)
		{
			var playlistItem = playlist.package.playlist.item[i];
			var playerContent = document.createElement("div");
			playerContent.className = "content";
			playerContent.dataset.duration = playlistItem.duration;
			switch (playlistItem.type) {
				case "audio":
					playerContent.dataset.mediaid = playlistItem.id;
					var imageElement = document.createElement("img");
					imageElement.src = path.join(__dirname, "cache", playlistItem.id + "." + playlistItem.ext);
					playerContent.appendChild(imageElement);
					var audioElement = document.createElement("audio");
					audioElement.src = playlistItem.location;
					audioElement.setAttribute("id", playlistItem.id);
					playerContent.appendChild(audioElement);
					break;
				case "video":
					playerContent.dataset.mediaid = playlistItem.id;
					var videoElement = document.createElement("video");
					videoElement.src = path.join(__dirname, "cache", playlistItem.id + "." + playlistItem.ext);
					videoElement.setAttribute("id",playlistItem.id);
					playerContent.appendChild(videoElement);
					break;
				case  "image":
					var imageElement = document.createElement("img");
					imageElement.src = path.join(__dirname, "cache", playlistItem.id + "." + playlistItem.ext);
					playerContent.appendChild(imageElement);
					break;
				default:
					break;
			}
			theCanvas.appendChild(playerContent);
		}
	}
	
	function verifyAssets()
	{
		var status = true;
		console.log("Veryifying assets...");
		for (i=0;i<itemsInPlaylist;i++)
		{
			var item = playlist.package.playlist.item[i];
			var filename = path.join(cachePath,item.id + "." + item.ext);
			var md5 = item.checksum;
			
			if (!verifyAsset(filename, md5))
			{
				console.log("asset missing or broken");
				status = false;
			}
			else {
				console.log("Asset with id " + item.id + " is cached");
			}
		}
		return status;
	}
	
	function verifyAsset(filename,md5)
	{
		try {			
			if (checksum(fs.readFileSync(filename)) == md5)
				return true;
		} catch(err){}
		
		return false;
	}
	
	function checksum (str, algorithm, encoding)
	{
		    return _crypto
			.createHash(algorithm || 'md5')
			.update(str, 'utf8')
			.digest(encoding || 'hex')
	}

	
	return {
		play: play,
		stop: stop
	};

}());