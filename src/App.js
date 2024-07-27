import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from "react";
import SpotifyWebApi from "spotify-web-api-js";
import axios from 'axios';
import itemCard from "./ItemCard";
import {BrowserRouter as Router, Route, Link  } from "react-router-dom";
// import { Router } from 'express';
const spotifyApi = new SpotifyWebApi();
const clientID = '8ba44158505b4495ab2d524151c6fe94';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';
const REDIRECT_URI = "https://Prithvi-Kanaujia.github.io/spotify-roundup";
// const REDIRECT_URI = "http://localhost:3000";
const SCOPE = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-recently-played user-top-read';

const getToken = () => {
  return window.location.hash.substring(1).split('&').reduce((initial, item) => {
    let parts = item.split("=");
    initial[parts[0]] = decodeURIComponent(parts[1]);
    return initial;
  },{});
}; 

// const Home = () => {return(
  
// );
// }

function App() {
  const [spotifyToken, setSpotifyToken] = useState("");
  const [topTracks, setTopTracks] = useState({});
  const[song, setSong] = useState(false);
  const [artists, setArtists] = useState({});

  const[loggedIn, setLoggedin] = useState(false);
  useEffect(()=> {
    console.log("this is what we got: " , getToken());
    const spotifyToken = getToken().access_token;
    // window.location.hash="";
    if (spotifyToken) {
      setSpotifyToken(spotifyToken);
      setLoggedin(true);
      spotifyApi.setAccessToken(spotifyToken);
      console.log(spotifyToken);
      // console.log(getToken().access_token)
      spotifyApi.getMe().then((user) => {
        // console.log(user);
      })
      
    }
  });

  const getTopItems = async () => {
    var selectElement = document.getElementById("timeframeSelect");
    var selectedValue = selectElement.value;
    console.log(selectedValue);
    let timeline = "medium_term";
    switch (selectedValue) {
      case "0":
        timeline = "medium_term";
        break;
      case "1":
        timeline = "short_term";
        break;
      case "2":
        timeline = "medium_term";
        break;
      case "3":
        timeline = "long_term";
        break;
      default:
        timeline = "medium_term";
    }
    try {
      const response = await axios.get("https://api.spotify.com/v1/me/top/artists", {
        headers: {
          Authorization: `Bearer ${spotifyToken}`
        },
        params: { limit:50,time_range: timeline }
      });

      const data = response.data.items;
      console.log(data);
      setSong(false);
      setTopTracks(data);
      setArtists(data);

      // Logging names of top tracks
      data.forEach((artist) => {
        console.log(artist.name);
      });
     
    } catch (error) {
      console.error("Error fetching top items:", error);
    }
  };

  const getTopTracks = async () => {
    var selectElement = document.getElementById("timeframeSelect");
    var selectedValue = selectElement.value;
    console.log(selectedValue);
    let timeline = "medium_term";
    switch (selectedValue) {
      case "0":
        timeline = "medium_term";
        break;
      case "1":
        timeline = "short_term";
        break;
      case "2":
        timeline = "medium_term";
        break;
      case "3":
        timeline = "long_term";
        break;
      default:
        timeline = "medium_term";
    }
    try {
      const response = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
        headers: {
          Authorization: `Bearer ${spotifyToken}`
        },
        params: { limit:50,time_range: timeline }
      });
      setSong(true);
      const data = response.data.items;
      console.log(data);
      setTopTracks(data);
      // setArtists(data);

      // Logging names of top tracks
      data.forEach((artist) => {
        console.log(artist.name);
      });
     
    } catch (error) {
      console.error("Error fetching top items:", error);
    }
  };
  const renderTracks = () => {
    const list = Object.values(topTracks);
    return list.map(track => (
      <div key={track.id} className='artist-item'>
        {track.name}
        {track.album.images[0] ? <img width={"100%"} src={track.album.images[0].url} alt=''/>:<div>No Image</div>}
      </div>
    ))
  }
  const renderArtists = () => {
    const list = Object.values(artists);
    return list.map(artist => (
      <div key={artist.id} className='artist-item'>
        {artist.name}
        {artist.images[0] ? <img width={"100%"} src={artist.images[0].url} alt=''/>:<div>No Image</div>}
      </div>
    ))
  }
  
  return (
    <div className="app">
      
    {!loggedIn && (
      <div class = "loginPage"> 
        <h2>Your Spotify Roundup Awaits </h2>
        <button 
          class ="login-button" 
          onClick={()=>{window.location.href = `${AUTH_ENDPOINT}?client_id=${clientID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&response_type=${RESPONSE_TYPE}&show_dialog=true`}}
          >Login to Spotify
        </button>
      </div>)}
    {loggedIn && (
      <><div></div>
      <div class="button-container">
        <button class = "custom-button" onClick={getTopItems}> Get my top artists</button>
        <button class = "custom-button" onClick={getTopTracks}> Get my top songs</button>
      </div>  
    <div class="custom-select">
      <select class ="dropdown" id="timeframeSelect" >
        {/* <option value="0">Select Timeframe</option> */}
        <option value="0">4 weeks</option>
        <option value="1">6 months</option>
        <option value="2">All time</option>
      </select>
    </div>
    <div className='artists-grid'>
      {song ?renderTracks():renderArtists() }
    </div>
    
  </>
    )}
    
    
  </div>
    
  );
    }

export default App;
