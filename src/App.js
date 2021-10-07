import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut,createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { useState } from "react";
import './App.css';
import initializeAuthentication from './Firebase/firebase.initialize';


initializeAuthentication()
const googleProvider = new GoogleAuthProvider(); 
const gitHubProvider = new GithubAuthProvider();

function App() {
  const [user, setUser] = useState({})
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(false);
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

  const toggleLogin = e =>{
     setIsLogin(e.target.checked);
     
  }
  
  const handleNameChange = e => {
    setName(e.target.value);
  }

  const handleEmailChange = e => {
    setEmail(e.target.value);
  }
  const handlePasswordChange = e =>{
    setPassword(e.target.value);
  }
  const handleRegistration = (e) => {
    e.preventDefault();
    console.log(email, password)
    if(password.length < 6){
      setError('Password must be at least 6 characters long..')
      return ;
    }
    if(!/(?=.*[A-Z].*[A-Z])/.test(password)){
      setError('Password must be has two uppercase letters')
      return;
    }
    if(!/(?=.*[!@#$&*])/.test(password)){
      setError('Password must be has one special case letter')
      return;
    }
    if(!/(?=.*[0-9].*[0-9])/.test(password)){
      setError('Pasword must be has two digits')
      return;
    }
    if(!/(?=.*[a-z].*[a-z].*[a-z])/.test(password)){
      setError('Password must be has three lowercase letters')
      return;
    }
    isLogin? processLogin(email,password) : creatNewUser(email, password);
  }



  const processLogin = (email,password) => {
    signInWithEmailAndPassword(auth, email, password)
    .then(result => {
      const user = result.user;
      console.log(user);
      setError('');
    })
    .catch(error => {
      setError(error.message);
    })
  }

  const creatNewUser = (email, password) =>{
    createUserWithEmailAndPassword(auth, email, password)
    .then(result =>{
      const user = result.user;
      console.log(user);
      setError('');
      verifyEmail();
      setUserName();
    })
    .catch(error => {
      setError(error.message);
    })
  }

const setUserName = () =>{
  updateProfile(auth.currentUser,{
    displayName: name
  }).then(result =>{

  })
}


  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
    .then(result => {
      console.log(result);
    })
  }

  const handleResetPassword = () =>{
    sendPasswordResetEmail(auth, email)
    .then(result => {
      console.log(result);
    })
  }
  return (
    <div className="container py-3">
      <form onSubmit={handleRegistration}>
        <h3 className="text-primary">Please {isLogin ? 'Login' : 'Register'}</h3>
        {!isLogin && <div className="row mb-3">
          <label htmlFor="Name" className="col-sm-2 col-form-label">Name</label>
          <div className="col-sm-10">
            <input type="text" onBlur={handleNameChange} className="form-control" placeholder="Your Name" required/>
          </div>
        </div>}
        <div className="row mb-3">
          <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <input type="email" onBlur={handleEmailChange} className="form-control" id="inputEmail3" required/>
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="password" className="col-sm-2 col-form-label">Password</label>
          <div className="col-sm-10">
            <input type="password" onBlur={handlePasswordChange} className="form-control" id="inputPassword3" required/>
          </div>
        </div>
        <div className="row mb-3">
    <div className="col-sm-10 offset-sm-2">
      <div className="form-check">
        <input onChange={toggleLogin} className="form-check-input" type="checkbox" id="gridCheck1"/>
        <label className="form-check-label" htmlFor="gridCheck1">
          Already Registered?
        </label>
      </div>
    </div>
  </div>
        <div className="row mb-3 text-danger">{error}</div>
        <button type="submit" className="btn btn-primary">{isLogin ? 'Login' : 'Register'}</button>
        <button type="button" onClick={handleResetPassword} className="btn btn-secondary btn-sm">Reset Password</button>
    </form>
      <br /><br />
      <div>------------------------</div>
      <br /><br />
      <h3 className="text-primary">You can login with</h3>
      { !user.name ?   <div>
      <button onClick={handleGoogleSignIn} className="btn btn-primary mb-3">Google SignIn</button>
      <br />
      <button onClick={handleGitHubSignIn} className="btn btn-primary">GitHub SignIn</button>
      </div> :
      <button onClick={handleSignOut} className="btn btn-primary">Sign Out</button>}
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
