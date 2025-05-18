import StarRating from './starRating';
import { useState } from 'react';
import { Link } from 'react-router-dom';
//Here I get the name, img, top songs of the artist
const Artist = ({ id, name, images, rating, critique, onSelected = f => f, saveArtistComment = f => f }) => {
    const [selectedRating, setSelectedRating] = useState(rating);
    const handleRatingChange = (newRating) => {
        setSelectedRating(newRating);
    };
    return (
        <>
        
            <div className="box-container">
                {/* Title */}
                <div className="inner-box">
                    <Link to={`/songs`} className="h1-link" onClick={() => onSelected(id)}>
                        <h1>{name}</h1>
                    </Link>
                    {/* Rating section */}
                    {(rating === undefined) ? <p>No rating </p> : <></>}
                    <StarRating selectedStars={selectedRating} actualRating={rating} handleRatingChange={handleRatingChange} />
                    {/* Picture */}
                    <div className="about">
                        <img src={images[1].url} alt={name + "'s picture"} />
                        {/* Comment retrieved*/}
                        <div className="recentCritique">
                            <h2>Recent comment:</h2>
                            <textarea id="critiqueSection" value={critique} readOnly></textarea>
                        </div>
                    </div>
                    {/* Comment */}
                    <h2>We want to know your opinion about the artist</h2>
                    <div id="yourOpinion">
                        <textarea id={id} placeholder='Type here...'></textarea>
                        <button onClick={() => {
                            let comment = document.getElementById(id).value;
                            saveArtistComment({ id, name, comment, selectedRating })
                            document.getElementById(id).value=""
                        }}>Submit</button>

                    </div>
                </div>
            </div>
        </>
    );
}
export default Artist;