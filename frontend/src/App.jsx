import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router'
import { auth } from "./firebaseConfig";

import Navbar from './Navbar';
import Login from './Login';
import Signup from './Signup';
import UserHomepage from './UserHomepage';
import Country from './Country'
import Map from './Map'
import IngredientLookup from './IngredientLookup';
import Recipe from './Recipe';

import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
import RecipeEditor from './RecipeEditor';

function App() {
  const navigate = useNavigate();

  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState();

  if (!loaded) {
    auth.authStateReady().then(() => {
      setUser(auth.currentUser);
      setLoaded(true);
      navigate("/");
    });

    return;
  }

  // user login/signin
  const updateUser = () => {
    setUser(auth.currentUser);
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      setUser(null);
      navigate();
    }).catch((error) => {
      console.log("Failed to sign out", error);
    });
  };

  return (
    <>
      <Navbar user={user} handleLogout={handleLogout} />
      <div style={styles.page}>
        <Routes>
          <Route path="/" element={<Map />} />
          <Route path="/ingredients" element={
            <div style={styles.pagePadding}>
              <IngredientLookup/>
            </div>
          } />
          <Route path="/user" element={
            <div style={styles.pagePadding}>
              <UserHomepage user={user} />
            </div>
          } />
          <Route path="/register" element={
            <div style={styles.pagePadding}>
              <Signup onSignup={updateUser} />
            </div>
          } />
          <Route path="/login" element={
            <div style={styles.pagePadding}>
              <Login onLogin={updateUser} />
            </div>
          } />
          <Route path="/recipes/new" element={
            <div style={styles.pagePadding}>
              <RecipeEditor user={user}/>
            </div>
          }
          />
          <Route path="/country/:country_code" element={
            <div style={styles.pagePadding}>
              <Country />
            </div>
          } />
          <Route path ="/recipes/:recipe_id" element={
            <div style={styles.pagePadding}>
              <Recipe/>
            </div>
          }
          />
        </Routes>
      </div>
    </>
  );
}

const styles = {
  page: {
    position: 'absolute',
    top: '66px',
    width: '100%',
    height: 'calc(100% - 66px)',
    overflow: 'auto'
  },
  pagePadding: {
    paddingTop: '20px',
    paddingBottom: '20px',
    paddingLeft: '40px',
    paddingRight: '40px'
  },
};

export default App;