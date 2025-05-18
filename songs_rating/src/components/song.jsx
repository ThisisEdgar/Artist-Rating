import { useState } from "react";
import StarRating from "./starRating";
import '../card.css'
const Song = ({
  id,
  artistName,
  songName,
  albumImage,
  albumName,
  releaseDate,
  rating,
  critique,
  preview_url,
  redirect,
  sendSongComment = f => f
}) => {
  // This state is necessary to update each time the user selects a rating,
  // because we need the value that the user gives us in other places
  const [selectedRating, setSelectedRating] = useState(rating);
  const handleRatingChange = (newRating) => {
    setSelectedRating(newRating);
  };
  return (
    <>
      <br />
      {/* Picture */}
      <div className="album-container" >
        <div className="album-art">
          <img src={albumImage} alt={songName + "'s album "} />
        </div>
        {/* Title */}
        <a href={redirect} target="_blank" rel="noopener noreferrer">
          <img className="overlay-image" src="https://storage.googleapis.com/spotify-newsroom-staging.appspot.com/1/2021/02/Spotify_Icon_RGB_Green.png" alt={`${artistName}'s Spotify`} />
        </a>
        {/* Star rating */}
        <div className="rating">
          <StarRating selectedStars={selectedRating} actualRating={rating} handleRatingChange={handleRatingChange} />
          {rating === 0 ? null : null}
          {/* Audio shows only if there is a valid url */}
          {preview_url !== undefined && preview_url !== null ? (
            <div>
              <audio controls>
                <source src={preview_url} type="audio/mp3" />

              </audio>
            </div>
          ) : null}
        </div>
        {/* Info */}
        <div className="album-info">
          <h1>{songName}</h1>
          <p>{artistName}</p>
          <p>Release Date: <span>{releaseDate}</span></p>
          <p>Album: <span>{albumName}</span></p>
          <p>Critiques by fans: <span>{critique}</span></p>
          {/* Review section */}
          <div className="review">
            <h3>Your Thoughts</h3>
            <textarea
              id={id}
              placeholder="Type here..."
            /* // I could've also used something like this, but I forgot that this existed
            value={comment}
            onChange={(e) => setComment(e.target.value)} */
            ></textarea>
            <div className="submit-btn">
              <button onClick={() => {
                let comment = document.getElementById(id).value;
                sendSongComment({ id, songName, artistName, comment, selectedRating })
                document.getElementById(id).value=""
              }}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </>

  );
};

export default Song;
