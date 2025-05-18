import { useState } from "react";
const AdminDelete = ({ artistComments, songsComments, onDeleteArtist = f => f, onDeleteSong = f => f }) => {
  
  // I already have read from DB operations in my application
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const loginButton = () => {
    if (password === '123') {
      setAuthenticated(true);
    } else {
      alert('Please insert the correct password');
    }
  };

if (artistComments.length === 0 || songsComments.length === 0) return (<h1>No comments to display</h1>)

if (!authenticated) {
  return (
    <div>
      <h1> Please insert the password (123) to see this page</h1>
      <input
        type="password"
        id="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter Password"
        style={{width:"28%"}}
      /><br/>
      <button id="loginButton" onClick={()=>
      {
        if (password === '123') {
          setAuthenticated(true);
        } else {
          alert('Please insert the correct password');
        }
      }
        
      } style={{width:"30%",height:"3em",}} >
        Submit
      </button>
    </div>
  );
}
  return (
    <>
      <h1 style={{ color: "#1DB954", marginBottom: "20px" }}>Admin delete menu</h1>
      {/* For each artist comment */}
      <h2 style={{ color: "#075121" }}>Delete artist's comments</h2>
      {artistComments.map((comment) => (
        <div className="deleteRow" key={comment._id}>
          <p>{comment.name}</p>
          <p className="text">{comment.comments}</p>
          <button className="delete" onClick={() => onDeleteArtist(comment._id)}>
            Delete
          </button>
        </div>
      ))}
      {/* For each song comment */}
      <h2 style={{ color: "#075121" }}>Delete song's comments</h2>
      {songsComments.map((comment) => (
        <div className="deleteRow" key={comment._id}>
          <p>{comment.title}</p>
          <p className="text">{comment.comments}</p>
          <button className="delete" onClick={() => onDeleteSong(comment._id)}>
            Delete
          </button>
        </div>
      ))}
    </>
  );
};

export default AdminDelete;
