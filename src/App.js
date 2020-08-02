import React, { useState,useEffect } from 'react';
import './App.css';
import Post from './Post';
import {db,auth} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

/* Verificado */
function getModalStyle(){
  const top = 50;
  const left = 50;

  return{
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

/* Verificado */
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(6,4,6),
  },
}));

function App() {
  const classes = useStyles();//Verificado
  const [modalStyle] = useState(getModalStyle);//Verificado
  const [posts,setPosts] = useState([]);//Verificado
  const [open, setOpen] = useState(false);//Verificado
  const [openSignIn, setOpenSignIn] = useState(false);//Verificado
  const [username,setUsername] = useState('');//Verificado
  const [password, setPassword] = useState('');//Verificado
  const [email, setEmail] = useState('');//Verificado
  const [user, setUser] = useState(null);//Verificado
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        //user has logged in...
        console.log(authUser);
        setUser(authUser);
      }else{
        //user has logged out...
        setUser(null);
      }
    })

    return () => {
      //perform some cleanup actions
      unsubscribe();
    }
  },[user,username]);

  /*---------Verificado---------*/
  /* UseEffect -> runs a piece of code based on a specific condition */
  useEffect(() => {
    //This is where the code runs
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      //every time a new post is added, this code fires...
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  },[])

  /*---------Verificado---------*/
  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email,password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email,password)
      .catch((error) => alert(error.message))

    setOpenSignIn(false);
  }


  return (
    <div className="App">
      
      <Modal
       open={open}
       onClose={() => setOpen(false)}
       >
         <div style={modalStyle} className={classes.paper}>
         <form className="app__signup">
            <center>
              <img className="app_headerImage"
                   src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
            </center>
            <Input
                  placeholder="username"
                  className="appsignup__textfirst space"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}/>
            <Input
                  placeholder="email"
                  className="appsignup__textfirst"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}/>
            <Input
                  placeholder="password"
                  className="appsignup__textsecond"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}/>
            <Button type="submit" onClick={signUp}>Sign Up</Button>
            </form>
         </div>
      </Modal>

      <Modal
       open={openSignIn}
       onClose={() => setOpenSignIn(false)}
       >
         <div style={modalStyle} className={classes.paper}>
         <form className="app__signup">
            <center>
              <img className="app_headerImage"
                   src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
            </center>
            <Input
                  placeholder="email"
                  className="appsignup__textfirst space"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}/>
            <Input
                  placeholder="password"
                  className="appsignup__textsecond"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}/>
            <Button type="submit" onClick={signIn}>Sign In</Button>
            </form>
         </div>
      </Modal>

      <div className="app__header">
        <div className="app__headerBody">
        <img 
          className="app__headerImage"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt=""/>

        {user ?(
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ):(
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
        </div>
      </div>

      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({id,post}) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
            ))
          }
        </div>
        <div className="app__postsRight">

          {
            user?.displayName ? (
              <ImageUpload username={user.displayName}/>
            ):(
              <h3 style={{fontSize:'0px'}}>Sorry you need to login to upload</h3>
          )}

          <InstagramEmbed
            url="https://www.instagram.com/p/B-UoosMpFnS/"
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />

        </div>
    
      </div>  

    </div>
  );
}

export default App;
