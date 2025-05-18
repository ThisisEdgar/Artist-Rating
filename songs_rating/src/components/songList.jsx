import Song from './song';
const SongsList = ({ songs, sendSongComment = f => f }) => {
  //If it is empty, either Spotify's app not working or
  // I'm not passing the values correctly
  //console.log("Inside songs ", songs)
  if (songs.length === 0 || songs === undefined) return <h3>Whoops, something went wrong</h3>
  return (
    <>
      <h1>Top tracks by {songs[0].artists[0].name}</h1>
      {
        // I defined each value manually, because some of them were hard to
        // obtain
        songs.map((track, index) => {
          return (<div key={index}>
            <Song
              key={track.id}
              id={track.id}
              songName={track.name}
              redirect={track.external_urls.spotify}
              artistName={track.artists[0].name}
              albumImage={track.album.images[0].url}
              releaseDate={track.album.release_date}
              critique={track.critique}
              albumName={track.album.name}
              sendSongComment={sendSongComment}
              {...track}
            />
          </div>)
        })
      }

    </>
  )

}

export default SongsList;