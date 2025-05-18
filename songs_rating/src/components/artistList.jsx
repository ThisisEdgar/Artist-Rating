import Artist from "./artist";
const ArtistList = ({ artists, onSelected = f => f, saveArtistComment = f => f }) => {
  //If it is empty, either Spotify's app not working or
  // I'm not passing the values correctly
  if (artists.length === 0 || artists===undefined) return <h3>Whoops, something went wrong</h3>

  /* // Used this code to debug a logic  error I was having with the useEffect() usage
    // This helped me realize that although I was updating the artist List
    // I was doing that twice, which caused my code to run wrongly   
    const timestampWithMilliseconds = () => {   
    const date = new Date();
    const milliseconds = date.getMilliseconds();

    const formattedTimestamp = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T${date
        .getHours()
        .toString()
        .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date
          .getSeconds()
          .toString()
          .padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}Z`;

    return formattedTimestamp;
  }; 
  console.log(timestampWithMilliseconds());
  console.log("=this is artist list: ",artists)
  */
  return (
    <>
    <h1>Artist Rating</h1>
      {artists.map((artist) => {
        return (
          <Artist
            key={artist.id}
            {...artist}
            onSelected={onSelected}
            saveArtistComment={saveArtistComment}
          />
        );
      })}
    </>
  );

}

export default ArtistList;