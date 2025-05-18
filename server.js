import express from 'express';
import mongoose from "mongoose";
import cors from 'cors'
import bodyParser from 'body-parser';
import { Song } from "./models/songs.js";
import { Artist } from "./models/artists.js";
import axios from 'axios'

// ------------------------------------------------------EXPRESS DEFINITION ---------------------------------------------------------------
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"))
// ------------------------------------------------------MONGO URL ---------------------------------------------------------------
const url = `mongodb://localhost:27017/ratingDB`;
let isConnectionUp = false;
// ------------------------------------------------------API VALUES ---------------------------------------------------------------
const clientID = `a91afece91fd468cabafc82c96f03c8b`;
const clientSecret = `9700cac40a93472abc92c8acb471bf4b`;
let token = 'BQBDKrlpUNzPXyyFhIhw6welZlQrXtdmp9erSCcN7SiJWLa9_0zlzPTanbwN8MORl5TCyjKiZHA7z3dIvQJFXz8axqNBZvYpD80s3xis6-3r7mtankM';
// ------------------------------------------------------UPDATE TOKEN ---------------------------------------------------------------
const getToken = async () => {
    const url = 'https://accounts.spotify.com/api/token';
    // Suggested by Spotify
    const payload = new URLSearchParams();
    payload.append('grant_type', 'client_credentials');
    payload.append('client_id', clientID);
    payload.append('client_secret', clientSecret);

    try {
        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        console.log('access token', response.data.access_token)
        token = response.data.access_token;
    } catch (error) {
        console.error('Error getting token:', error.response ? error.response.data : error.message);
    }
}
// ------------------------------------------------------TO MY SELF: ---------------------------------------------------------------
/* mongoose.connect(url);
1. Create the database
2. I need 2 schemas : songs, artists
3.  Send them to artists and songs files
/* 

// ------------------------------------------------------MONGO DB ---------------------------------------------------------------  
// ------------------------------------------------------CREATE ---------------------------------------------------------------

/* 
const addSong = async ()=> {
    const dummySongComment = new Song({
        _id : "askdjnkasdkjakjsd",
        title: "cheap thrills",
        artist: "sia",
        comments: "awesome song"
    })
    try {
        const savedSong = await dummySongComment.save();
        console.log(`saved succesfull ${savedSong}`)
    } catch (err) {
        console.log(`saved unsuccesfull ${err}`)
    }
}
addSong() */
/* const addArtist = async ()=> {
    const dummyArtistComment = new Artist({
        _id: "v5234234qwre",
        name: "Hello",
        comments :"Absolutely loved it"
    })
    try {
        const savedArtist = await dummyArtistComment.save();
        console.log(`saved succesfull ${savedArtist}`)
    } catch (err) {
        console.log(`saved unsuccesfull ${err}`)
    }
}
//It works
addArtist() */

// ------------------------------------------------------START UP DATABASE ---------------------------------------------------------------
app.get("/", async (req, res) => {
    try {
        await mongoose.connect(url);
        console.log("Connection is up. DB connected");
        res.send("<h1>Database Connected </h1>")
    }
    catch (err) {
        console.log(`Error here: ${err}`)
    }
})
const connect = async () => {
    try {
        await mongoose.connect(url);
        console.log("Connection is up. DB connected");
    }
    catch (err) {
        console.log(`Error here: ${err}`)
    }
}
// ------------------------------------------------------CREATE COMMENT---------------------------------------------------------------
app.post("/api/createcomment/:id", async (req, res) => {
    // connect to DB if it you are not connected
    if (isConnectionUp === false) {
        await connect();
        isConnectionUp = true;
    }

    let _id = req.params.id;
    const { name, comments } = req.body;
    const newData = { _id, name, comments };

    try {
        const createdArtist = await Artist.create(newData);

        if (createdArtist) {
            console.log(`Successfully Created ${createdArtist}`);
            res.send(JSON.stringify(createdArtist));
        } else {
            console.log(`Error creating a new document`);
            res.send(`Error creating a new document`);
        }


        isConnectionUp = false;
    } catch (err) {
        console.log(`ERROR in Creating comment in DB ${err}`);
        res.status(500).json({ error: 'My Server Error' });
    }
});
// ------------------------------------------------------READ ---------------------------------------------------------------

app.get("/api/artists/comments", async (req, res) => {
    if (isConnectionUp === false) {
        connect()
        isConnectionUp = true;
    }
    try {
        const allComments = await Artist.find();
        res.send(allComments);
    }
    catch (err) {
        res.send(`Error reading artist comments: ${err}`)
    }
})
app.get("/api/artistComment/:id", async (req, res) => {
    if (isConnectionUp === false) {
        await connect()
        isConnectionUp = true;
    }
    let _id = req.params.id;
    try {
        let allComments = await Artist.findOne({ _id });
        if (!allComments) {
            allComments = { comments: "No comments yet" }
        }
        console.log("Getting artist comment with id ", _id)
        res.send(allComments);
    }
    catch (err) {
        res.send(`Error getting artist comment: ${err}`)
    }
})
app.get("/api/songComment/:id", async (req, res) => {
    if (isConnectionUp === false) {
        await connect()
        isConnectionUp = true;
    }
    let _id = req.params.id;
    try {
        let allComments = await Song.findOne({ _id });
        if (!allComments) {
            allComments = { comments: "No comments yet" }
        }
        console.log("Getting song comment with id ", _id)
        res.send(allComments);
    }
    catch (err) {
        res.send(`Error getting song comment: ${err}`)
    }
})
app.get("/api/songs/comments", async (req, res) => {
    if (isConnectionUp === false) {
        connect()
        isConnectionUp = true;
    }

    try {
        const allComments = await Song.find();
        res.send(allComments);
    }
    catch (err) {
        if (err === 'MongooseError: Operation `artists.find()` buffering timed out after 10000ms') {
            res.send("No documents found")
        }
        else {
            res.send(`Error getting songs comment: ${err}`)
        }

    }
})
// ------------------------------------------------------U UPDATE ---------------------------------------------------------------
app.put("/api/updatecomment/:id", async (req, res) => {
    if (isConnectionUp === false) {
        connect()
        isConnectionUp = true;
    }

    let _id = req.params.id;
    const { name, comments } = req.body;
    const updatedData = { name, comments }
    const filter = { _id }
    try {
        const updatedArtist = await Artist.findByIdAndUpdate(filter, updatedData, { new: true });
        if (updatedArtist) {
            console.log(`Sucessfully Updated ${updatedArtist}`);
            res.send(JSON.stringify(updatedArtist))
        }
        else {
            console.log(`No matching document could be found ${id} `)
            res.send(`No matching document could be found.`)
        }

        isConnectionUp = false;
    }
    catch (err) {
        console.log(`ERROR in updating artist comment ${err}`)
    }



})
app.get("/api/updatecomment/:id/:name/:comments/:rating", async (req, res) => {
    if (isConnectionUp === false) {
        connect()
        isConnectionUp = true;
    }

    let _id = req.params.id;
    let name = req.params.name;
    let comments = req.params.comments;
    let rating = req.params.rating;
    if (rating === undefined) {
        rating = 0;
    }
    console.log("Rating is ", rating)
    const updatedData = { name, comments, rating }
    const filter = { _id }
    try {
        const updatedArtist = await Artist.findByIdAndUpdate(filter, updatedData, { new: true });
        if (updatedArtist) {
            console.log(`Sucessfully Updated ${updatedArtist}`);
            res.send(JSON.stringify(updatedArtist))
        }
        else {
            console.log(`No matching document could be found ${id} `)
            res.send(`No matching document could be found.`)
        }


    }
    catch (err) {
        // If it doesn't exist, create a new document
        try {
            const createdArtist = await Artist.create({ _id, ...updatedData });

            if (createdArtist) {
                console.log(`Successfully Created ${createdArtist}`);
                res.send(JSON.stringify(createdArtist));
            } else {
                console.log(`Error creating a new document`);
                res.send(`Error creating a new document`);
            }

        } catch (err) {
            console.log(`ERROR in creating comment ${err}`);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }



})
app.get("/api/song/updatecomment/:id/:title/:artist/:comments/:rating", async (req, res) => {
    if (isConnectionUp === false) {
        connect()
        isConnectionUp = true;
    }

    let _id = req.params.id;
    let title = req.params.title;
    let artist = req.params.artist;
    let comments = req.params.comments;
    let rating = req.params.rating;
    if (rating === undefined) {
        rating = 0;
    }
    console.log("Rating is", rating)
    const updatedData = { title, artist, comments, rating }
    const filter = { _id }
    try {
        const updatedArtist = await Song.findByIdAndUpdate(filter, updatedData, { new: true });
        if (updatedArtist) {
            console.log(`Sucessfully Updated ${updatedArtist}`);
            res.send(JSON.stringify(updatedArtist))
        }
        else {
            console.log(`No matching document could be found ${id} `)
            res.send(`No matching document could be found.`)
        }


    }
    catch (err) {
        try {
            const createdArtist = await Song.create({ _id, ...updatedData });

            if (createdArtist) {
                console.log(`Successfully Created ${createdArtist}`);
                res.send(JSON.stringify(createdArtist));
            } else {
                console.log(`Error creating a new document`);
                res.send(`Error creating a new document`);
            }

        } catch (err) {
            console.log(`ERROR in Creating in DB ${err}`);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }



})
// ------------------------------------------------------D DELETE ---------------------------------------------------------------
app.get("/api/delete/artist/:id", async (req, res) => {
    if (isConnectionUp === false) {
        connect()
        isConnectionUp = true;
    }
    //convert id to object id
    let _id = req.params.id;
    const filter = { _id }
    try {
        const result = await Artist.deleteOne(filter);
        if (result.deletedCount === 0) {
            console.log(`No matching document could be found; so deleted none`);
            res.send(`No matching document could be found; so deleted none`)
        }
        else {
            console.log(`Successfully deleted ${result.deletedCount} documents.`)
            res.send(`Successfully deleted ${result.deletedCount} documents.`)
        }

    }
    catch (err) {
        console.log(`ERROR in Deleting from DB ${err}`)
    }


})
app.get("/api/delete/song/:id", async (req, res) => {
    if (isConnectionUp === false) {
        connect()
        isConnectionUp = true;
    }
    //convert id to object id
    let _id = req.params.id;
    const filter = { _id }
    try {
        const result = await Song.deleteOne(filter);
        if (result.deletedCount === 0) {
            console.log(`No matching document could be found; so deleted none`);
            res.send(`No matching document could be found; so deleted none`)
        }
        else {
            console.log(`Successfully deleted ${result.deletedCount} documents.`)
            res.send(`Successfully deleted ${result.deletedCount} documents.`)
        }

    }
    catch (err) {
        console.log(`ERROR in Deleting from DB ${err}`)
    }

})

// ------------------------------------------------------API SECTION ---------------------------------------------------------------
// ------------------------------------------------------READ ---------------------------------------------------------------
// ------------------------------------------------------ARTISTS ---------------------------------------------------------------
app.get("/api/getArtists", async (req, res) => {
    const artistsId = [
        "3cjEqqelV9zb4BYE3qDQ4O",
        "0HthCchcL0kVLHTr113Vk1",
        "6qqNVTkY8uBg9cP3Jd7DAH",
        "4Ly0KABsxlx4fNj63zJTrF"
    ];

    let url = "https://api.spotify.com/v1/artists?ids=";
    url += artistsId.join(',');
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        res.json(response.data);
    } catch (error) {
        // According to Spotify's documentation, error 401 means token expired
        // That's why we get another token in that case,
        // But be careful not to refresh the page, it would generate a new token each time 
        // it is refreshed, and there is a token limit
        if (error.response && error.response.status === 401) {
            await getToken();
            try {
                const response = await axios.get(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                res.json(response.data);
            } catch (retryError) {
                console.error('Error retrying with refreshed token:', retryError.message);
            }
        }
        else {
            res.send(error);
        }
    }

})
// If there is no artist selected for the "/songs" page, show this songs:
app.get("/api/getSongs", async (req, res) => {
    let artistID = "0YC192cP3KPCRWx8zr8MfZ";
    let url = `https://api.spotify.com/v1/artists/${artistID}/top-tracks?market=ES`;
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        res.json(response.data);
    } catch (error) {
        if (error.response && error.response.status === 401) {
            await getToken();
            try {
                const response = await axios.get(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                res.json(response.data);
            } catch (retryError) {
                console.error('Error retrying with refreshed token:', retryError.message);
            }
        }
        else {
            res.send(error);
        }
    }

})
// Show selected artist's songs
app.get("/api/getSongs/:id", async (req, res) => {
    let artistID = req.params.id;
    let url = `https://api.spotify.com/v1/artists/${artistID}/top-tracks?market=ES`;
    try {
        const response = await axios.get(url, {
            headers: {  
                'Authorization': `Bearer ${token}`
            },
        });
        res.json(response.data);
    } catch (error) {
        if (error.response && error.response.status === 401) {
            await getToken();
            try {
                const response = await axios.get(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                res.json(response.data);
            } catch (retryError) {
                console.error('Error retrying with refreshed token:', retryError.message);
            }
        }
        else {
            res.send(error);
        }
    }

})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`running on port ${port}`)
})
