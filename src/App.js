import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {

  const [user, setUser] = useState({
    isSigned: false,
    name: '',
    email: '',
    photo: ''
  }) 

  const provider = new firebase.auth.GoogleAuthProvider();

  const handleSignIn = () =>{
    firebase.auth().signInWithPopup(provider)
    .then(res =>{
      const {displayName, photoURL, email} = res.user;
      const signedInUser = {
        isSigned: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedInUser);
      console.log(displayName, email, photoURL);
    })
    .catch(err =>{
      console.log(err);
      console.log(err.message);
    })
  }

  const handleSignOut = () =>{
    firebase.auth().signOut()
    .then(res => {
      const signedOutUser = {
        isSigned: false,
        name: '',
        email: '',
        password: '',
        photo: '',
        isValid: false
      }
      setUser(signedOutUser);
    })
    .catch(err => {

    })
  }

  const handleChange = e =>{
    const newUserInfo = {
      ...user
    };

  // perform validation
  const is_valid_email = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  const hasNumber = input => /\d/.test(input);

  let isValid = true;
  if (e.target.name === 'email'){
    isValid = is_valid_email(e.target.value);
  }
  if (e.target.name === 'password'){
    isValid = e.target.value.length > 8 && hasNumber(e.target.value);
  }

    newUserInfo[e.target.name] = e.target.value;
    // console.log(e.target.name, e.target.value);
    //  console.log(newUserInfo);
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  }

  const createAccount = () => {
    if(user.isValid) {
      console.log(user.email, user.password);
      // console.log("Form is valid");
      
    }
    else{
      console.log('Form is not Valid', user);
      
    }
    // eslint-disable-next-line no-restricted-globals
     event.preventDefault();
  }


  return (
    <div className="App">
      {
        user.isSigned ?  <button onClick={handleSignOut}>Sign Out</button> : 
         <button onClick={handleSignIn}>Sign In</button>
      }
     
      {
        user.isSigned && <div>
        <p>Welcome, {user.name} </p>
        <p>Your email is: {user.email} </p>
        <img src={user.photo} alt="user"/>
        </div>
      }

      <h1>Our own Authentication</h1>
      <form onSubmit={createAccount}>
        <input type="text" onBlur={handleChange} name="email" placeholder="Enter your email" required/> <br/>
        <input type="password" onBlur={handleChange} name="password" placeholder="Enter your passwod" required/> <br/>
        <input type="submit" value="Create Account"/>
      </form>

    </div>
  );
}

export default App;
