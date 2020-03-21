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
        isValid: false,
        error: '',
        existingUser: false
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

  const createAccount = (event) => {
    if(user.isValid) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        const createdUser = {...user};
        createdUser.isSigned = true;
        createdUser.error = '';
        setUser(createdUser);
      })
      .catch(err => {
        console.log(err.message);
        const createdUser = {...user};
        createdUser.isSigned = false;
        createdUser.error = err.message;
        setUser(createdUser);
      })
 
    }
    else{
      console.log('Form is not Valid', user);
    }
     event.preventDefault();
     event.target.reset();
  }

  const switchForm = event =>{
    const createdUser = {...user};
    createdUser.existingUser = event.target.checked;
    setUser(createdUser);
  }

  const signInUser = (event) =>{
    if(user.isValid) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        const createdUser = {...user};
        createdUser.isSigned = true;
        createdUser.error = '';
        setUser(createdUser);
      })
      .catch(err => {
        console.log(err.message);
        const createdUser = {...user};
        createdUser.isSigned = false;
        createdUser.error = err.message;
        setUser(createdUser);
      })
    }
    event.preventDefault();
    event.target.reset();
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
      <input type="checkbox" name="switchForm" onChange={switchForm} id="switchForm"/>
      <label htmlFor="switchForm"> Existisng User</label>
      <form style={{display:user.existingUser ? 'block' : 'none'}} onSubmit={signInUser}>
        <input type="text" onBlur={handleChange} name="email" placeholder="Enter your email" required/> <br/>
        <input type="password" onBlur={handleChange} name="password" placeholder="Enter your passwod" required/> <br/>
        <input type="submit" value="Sign In"/>
      </form>

      <form style={{display:user.existingUser ? 'none' : 'block'}} onSubmit={createAccount}>
      <input type="text" onBlur={handleChange} name="name" placeholder="Enter your name" required/> <br/>
        <input type="text" onBlur={handleChange} name="email" placeholder="Enter your email" required/> <br/>
        <input type="password" onBlur={handleChange} name="password" placeholder="Enter your passwod" required/> <br/>
        <input type="submit" value="Create Account"/>
      </form>
      {
        user.error && <p style={{color:'red'}}> {user.error} </p>
      }

    </div>
  );
}

export default App;
