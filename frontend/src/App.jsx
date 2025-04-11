import { useState } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router'
import { auth } from "./firebaseConfig";

import Navbar from './Navbar';
import Login from './Login';
import Signup from './Signup';
import UserHomepage from './UserHomepage';
import Country from './Country'
import Map from './Map'

import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';

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
          <Route path="/country/:country_code" element={
            <div style={styles.pagePadding}>
              <Country />
            </div>
          } />
        </Routes>
      </div>
    </>
  );
}

const styles = {
  page: {
    position: 'absolute',
    paddingTop: '65.59px',
    width: '100%',
    height: 'calc(100% - 65.59px)',
  },
  pagePadding: {
    paddingTop: '20px',
    paddingBottom: '20px',
    paddingLeft: '40px',
    paddingRight: '40px'
  },
};

export default App;