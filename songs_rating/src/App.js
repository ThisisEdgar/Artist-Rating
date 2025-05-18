import './App.css';
import { useEffect, useState } from 'react';
import ArtistList from './components/artistList';
import allArtists from './services/artist-info.json';
import { Route, Routes, Link } from 'react-router-dom';
import NavBar from './components/navBar';
import SongsList from './components/songList'
import allSongs from './services/songs-info.json'
import AdminDelete from './components/adminDelete';

function App() {
  // use state null does not work, putting the state [] works,
  // otherwise it just keep changing from the allArtists file to the new state 
  // I set it to 
  const [artistList, setArtistList] = useState([]);
  // In case user access directly to the "/songs" page
  const [songList, setSongList] = useState(allSongs);
  // This executed or not states saved my life in the useEffect(), this store a boolean
  // value that allows them to execute only if they have not been run or if I want 
  // them to run I change the state
  const [executedOrNot, setexecutedOrNot] = useState(false);
  const [songExecuted, setSongExecuted] = useState(false);
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [artistComments, setArtistComments] = useState([]);
  const [songsComments, setSongsComments] = useState([]);
  const [deleteComments, setdeleteComments] = useState(true);
  // ---------------------------------Artists--------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      if (!executedOrNot) {
        try {

          const url = "http://localhost:5000/api/getArtists";
          const data = await fetch(url);
          const response = await data.json();
          setArtistList(response.artists);
          setexecutedOrNot(true);
        } catch (err) {
          console.log(`error fetching artists: ${err}`);
        }
      }
    };

    fetchData();
  }, [executedOrNot]);
  // Adding the comments to the api result
  useEffect(() => {
    if (executedOrNot) {
      const addComments = async () => {
        try {
          const promises = artistList.map(async (element) => {
            const url = `http://localhost:5000/api/artistComment/${element.id}`;
            try {
              const response = await fetch(url);
              const data = await response.json();
              const comments = data.comments;
              let artistRating = data.rating || 0;

              //console.log(artistRating);
              return { critique: comments, rating: artistRating, ...element };
            } catch (err) {
              console.log(`error fetching comments: ${err}`);
              return { critique: [], rating: 0, ...element };
            }
          });

          const newArtists = await Promise.all(promises);
          //console.log(newArtists);
          setArtistList(newArtists);
        } catch (err) {
          console.log(`error adding comments: ${err}`);
        }
      };

      addComments();
    }
  }, [executedOrNot]);
  // ---------------------------------Songs--------------------------------------------------
  useEffect(() => {
    if (songExecuted === false) {
      const fetchData = async () => {
        if (selectedArtistId !== null) {
          try {
            console.log("running again")
            const url = `http://localhost:5000/api/getSongs/${selectedArtistId}`;
            const data = await fetch(url);
            const response = await data.json();
            setSongList(response.tracks);
            setSongExecuted(true);
          } catch (err) {
            console.log(`error fetching songs: ${err}`);
          }
        }
      };

      fetchData();

    }

  }, [selectedArtistId, songExecuted]);
  // Adding the comments to the api result
  useEffect(() => {
    const addComments = async () => {
      if (songExecuted) {

        try {
          const promises = songList.map(async (element) => {
            console.log("this is now working ", element)
            const url = `http://localhost:5000/api/songComment/${element.id}`;
            try {
              const response = await fetch(url);
              const data = await response.json();
              const comments = data.comments;
              let artistRating = data.rating || 0;
              console.log("critique returned ", comments)
              return { critique: comments, rating: artistRating, ...element };
            } catch (err) {
              console.log(`error fetching comments: ${err}`);
              return { critique: "nothing", rating: 0, ...element };
            }
          });

          const newSongList = await Promise.all(promises);
          //console.log("ThisnewArtists);
          setSongList(newSongList);
        } catch (err) {
          console.log(`error adding comments: ${err}`);
        }
      }
    };

    addComments();
  }


    , [songExecuted]);
  // ---------------------------------Admin--------------------------------------------------
  useEffect(() => {
    const fetchArtistComments = async () => {
      if (deleteComments) {
        try {
          const response = await fetch("http://localhost:5000/api/artists/comments");
          const result = await response.json();
          setArtistComments(result);
        } catch (error) {
          console.error("Error fetching artist comments:", error);
        }
      }
    };

    const fetchSongsComments = async () => {
      if (deleteComments) {
        try {
          const response = await fetch("http://localhost:5000/api/songs/comments");
          const result = await response.json();
          setSongsComments(result);
        } catch (error) {
          console.error("Error fetching songs comments:", error);
        }
      }
    };
    fetchArtistComments();
    fetchSongsComments();
    setdeleteComments(false);
  }, [deleteComments]);

  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <ArtistList
              artists={artistList}
              onSelected={(artistId) => {
                setSelectedArtistId(artistId);
                setexecutedOrNot(false);
                setSongExecuted(false)
              }}
              saveArtistComment={(artistComment) => {
                
                if (artistComment.selectedRating === undefined || undefined || artistComment.selectedRating === 0 || artistComment.comment === undefined || artistComment.comment === null || artistComment.comment === "") {
                  alert("Not saved, please enter a rating and comment first")
                }
                else {
                  setexecutedOrNot(false);
                  const url = `http://localhost:5000/api/updatecomment/${artistComment.id}/${artistComment.name}/${artistComment.comment}/${artistComment.selectedRating}`;
                  fetch(url)
                    .then(result => alert(`Comment saved`, result))
                }
              }}
            />
          }
        />
        <Route path='songs' element={
          
          <SongsList
            songs={songList}
            sendSongComment={(songComment) => {
              
              if (songComment.selectedRating === undefined || undefined || songComment.selectedRating === 0 || songComment.comment === undefined || songComment.comment === null || songComment.comment === "") {
                alert("Not saved, please enter a rating and comment first")
              }
              else {
                setSongExecuted(false)
                const url = `http://localhost:5000/api/song/updatecomment/${songComment.id}/${songComment.songName}/${songComment.artistName}/${songComment.comment}/${songComment.selectedRating}`;
                fetch(url)
                  .then(result => alert(`Comment saved`, result))
              }
            }}
          />

        } />
        <Route path='admin' element={
          <AdminDelete
            artistComments={artistComments}
            songsComments={songsComments}
            onDeleteArtist={(id) => {
              fetch(`http://localhost:5000/api/delete/artist/${id}`)
              alert("deleted")
              setArtistComments([])
              setdeleteComments(true)
            }}
            onDeleteSong={(id) => {
              fetch(`http://localhost:5000/api/delete/song/${id}`)
              alert("deleted")
              setSongsComments([])
              setdeleteComments(true)
            }} />

        } />
      </Routes>
    </div>





  );
}

export default App;
