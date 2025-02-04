console.log('Lets write some javascript');
let currentSong = new Audio();
let songs;

// defining secondsToMinutesSeconds

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs() {

    let a = await fetch("http://127.0.0.1:5501/songs/")
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs;
}

const playMusic = (track, pause = false) => {
    currentSong.src = "/songs/" + track
    if (!pause) {
        currentSong.play()
        play.src = "pause.svg"
    }
    currentSong.play()
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}


async function main() {



    //getting list of songs
    let songs = await getSongs()
    console.log(songs);

    playMusic(songs[0], true)

    // show all  the songs in the playlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Khushi</div>
                            </div>    
                                <div class="playnow">
                                    <span>Play Now</span>
                                    <img class="invert" src="playbtn.svg" alt="">
                                </div> 
                                </li>`;
    }

    // attach an event listener to every song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })


    //attach an event listerner to play,next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = 'playbtn.svg'
        }
    })


    // listen for time update event 
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })


    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    // add an event listener to previous and next
    prev.addEventListener("click", () => {
        currentSong.pause()
        console.log("previous cicked")
        console.log(currentSong)
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(currentSong.src.split("/").slice(-1)[0])


        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })


    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("next cicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(currentSong.src.split("/").slice(-1)[0])


        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })


    // add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e, e.target, e.target.value)
        currentSong.volume = parseInt(e.target.value) / 100;
    })


    // add event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        console.log("hamburger clicked");
        document.querySelector(".left").style.left = "0px";

    });


    // add event listener for hamburger close
    document.querySelector(".close").addEventListener("click", () => {
        console.log("Cross clicked!");  
        document.querySelector(".left").style.left = "-120%";  // Hide menu
    });

}
main()


