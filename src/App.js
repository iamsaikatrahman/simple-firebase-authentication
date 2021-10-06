import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut } from "firebase/auth";
import { useState } from "react";
import './App.css';
import initializeAuthentication from './Firebase/firebase.initialize';


initializeAuthentication()
const googleProvider = new GoogleAuthProvider(); 
const gitHubProvider = new GithubAuthProvider();

function App() {
  const [user, setUser] = useState({})
  const auth = getAuth();
  const handleGoogleSignIn = () =>{
    signInWithPopup(auth, googleProvider)
    .then(result => {
      const {displayName, email, photoURL} = result.user;
      const loggedInUser = {
        name: displayName,
        email: email,
        photo: photoURL,
      };
      setUser(loggedInUser);
    }).catch((error) => {
      console.log(error.message);
    })
  }
  const handleGitHubSignIn = () =>{
    signInWithPopup(auth, gitHubProvider)
    .then(result =>{
      const {displayName, email, photoURL} = result.user;
      const loggedInUser = {
        name: displayName,
        email: email,
        photo: photoURL,
      };
      setUser(loggedInUser);
    }).catch((error) => {
      console.log(error.message);
    })
  }
  const handleSignOut = () =>{
    signOut(auth)
    .then(()=>{
      setUser({});
    })
  }
  return (
    <div className="App">
      <h2>Hello FireBase</h2>
      { !user.name ?   <div>
      <button onClick={handleGoogleSignIn}>Google SignIn</button>
      <button onClick={handleGitHubSignIn}>GitHub SignIn</button>
      </div> :
      <button onClick={handleSignOut}>Sign Out</button>}
      {
        user.name && <div>
            <h2>Welcome {user.name}</h2>
            <p>Your Email: {user.email}</p>
            <img src={user.photo} alt="" />
        </div>
      }
    </div>
  );
}

export default App;
