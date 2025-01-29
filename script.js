console.log('Lets write some javascript');
let currentSong = new Audio();


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

const playMusic = (track)=>{
    currentSong.src ="/songs/" + track
    currentSong.play()
}


async function main() {

    

    //getting list of songs
    let songs = await getSongs()
    console.log(songs);

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

}
main()