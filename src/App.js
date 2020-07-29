import React, { useState,useEffect } from 'react';
import './App.css';
import Post from './Post';
import {db} from './firebase';
//firebase hosting -> instagram-clone-72700

function App() {
  const [posts,setPosts] = useState([]);

//useEffect -> Runs a piece of code based on a specific condition
useEffect(() => {
  //this is where the code runs
  db.collection('posts').onSnapshot(snapshot => {
    //every time a new post is added, this code fires...
    setPosts(snapshot.docs.map(doc => ( {
      id: doc.id, 
      post: doc.data()
    })));
  })
},[]);

  return (
    <div className="App">
      <div className="app__header">
        <img 
          className="app__headerImage"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt=""></img>
      </div>
      <h1>HELLO im Braysen</h1>
      {
        posts.map(({id,post}) => (
          <Post key={id}
                username={post.username}
                caption={post.caption}
                imageUrl={post.imageUrl}/>
        ))
      }

    </div>
  );
}

export default App;
