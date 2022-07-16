import logo from './logo.svg';
import './App.css';
import { Routes, Route, Link} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Nav from  'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {useEffect, useCallback } from 'react';
import MoviesList from "./components/MoviesList";
import Movie from "./components/Movie";
import { useState } from 'react';
import Login from './components/Login';
import Logout from './components/Logout';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AddReview from './components/AddReview'
import "./App.css"
import FavoritesDataService from './services/favorites';

function App() {
  const [user,setUser] = useState(null);
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const [favorites, setfavorites] = useState([]);
  const [checkFavorite,setCheckFavorite] = useState(false);
  //let checkFave = false

  const addFavorite = (movieID) => {
    setCheckFavorite(true);
    setfavorites([...favorites,movieID])
    
  }
  
  const deleteFavorite = (movieID) => {
    setfavorites(favorites.filter(f => f !== movieID))
   }

  const retrieveFavorite = useCallback(() => {
    FavoritesDataService.getAll(user.googleId)
    //
    .then(response=>{
        setfavorites(response.data.favorites)
    })
    .catch(e=>{
      console.log(e);
    })
},[user]);

const saveFavorite = useCallback(() => {
   var data = {
    _id:user.googleId, 
    favorites:favorites
  }
   FavoritesDataService.updateFavorites(data)
   .catch(e=>{
    console.log(e);
  })
},[favorites,user]);

useEffect(() => {
  if (user && checkFavorite ){
    saveFavorite();
    setCheckFavorite(false);
  }
  }, [user, saveFavorite,favorites,checkFavorite]);

useEffect ( () => {
  if (user) {
    retrieveFavorite() ; 
  }
}, [user, retrieveFavorite]);

  useEffect(() => {
    let loginData = JSON.parse(localStorage.getItem("login"));
    if (loginData) {
      let loginExp = loginData.exp;
      let now = Date.now()/1000;
      if (now < loginExp) {
        // Not expired
        setUser(loginData);
      } else {
        // Expired
        localStorage.setItem("login", null);
      }
    }
  }, []);
  

  return (
        <GoogleOAuthProvider clientId={clientId}>
    <div className="App">
    <Navbar bg="primary" expand="lg" sticky="top" variant="dark">
      <Container className="container-fluid">
      <Navbar.Brand className="brand" href="/">
      <img src="/images/movies-logo.png" alt="movies logo" className="moviesLogo"/>
        MOVIE TIME
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link as={Link}  to={"/movies"}>
              Movies
              </Nav.Link>
              </Nav>
              </Navbar.Collapse>
              { user ? (
                  <Logout setUser={setUser} />
                ) : (
                  <Login setUser={setUser} />
                )}
              </Container>
              </Navbar>

              <Routes>      
              {/* <Route exact path={"/"} element={
                <MoviesList />}
                />
              <Route exact path={"/movies"} element={
                <MoviesList />}
                /> */}
              <Route path={"/movies/:id"} element={
                <Movie user={ user } />}
                />
              <Route path={"/movies/:id/review"} element={
                <AddReview user={ user } />}
                />
              <Route exact path={"/"} element={
                <MoviesList
                  user={ user }
                  addFavorite={ addFavorite }
                  deleteFavorite={ deleteFavorite}
                  favorites={ favorites }
                />}
                />
                <Route exact path={"/movies"} element={
                  <MoviesList
                  user={ user }
                  addFavorite={ addFavorite }
                  deleteFavorite={ deleteFavorite }
                  favorites={ favorites }
                  />
                }
                />
              </Routes>
              </div>
              </GoogleOAuthProvider>
    );
    }     
  
export default App;