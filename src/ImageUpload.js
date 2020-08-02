import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import firebase from "firebase";
import { storage , db } from './firebase';
import './ImageUpload.css';
/* Agregado reciente */
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';

function ImageUpload({username}){
    const [image, setImage] = useState(null);//Validado
    const [progress, setProgress] = useState(0);//Validado
    const [caption, setCaption] = useState('');//Validado
    
    /* Validado */
    const handleChange = (e) => {
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    };

    /* Agregado reciente */
    const BootstrapButton = withStyles({
        root: {
          boxShadow: 'none',
          textTransform: 'none',
          fontSize: 16,
          padding: '6px 12px',
          border: '1px solid',
          lineHeight: 1.5,
          color: 'white',
          backgroundColor: '#0095F6',
          borderColor: '#0095F6',
          marginBottom: '15px',
          fontWeight: '600',
          fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
          ].join(','),
          '&:hover': {
            backgroundColor: '#0074CC',
            borderColor: '#0062cc',
            boxShadow: 'none',
          },
          '&:active': {
            boxShadow: 'none',
            backgroundColor: '#0062cc',
            borderColor: '#005cbf',
          },
          '&:focus': {
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
          },
        },
      })(Button);

    /* Validado */
    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //progress function...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
              //Error function...
              console.log(error);
              alert(error.message);  
            },
            () => {
                //Complete function...
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        //Post image inside db
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        });

                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    });
            }/* Fin de Complete function */
        );/* Fin de uploadTask */
    };/* Fin de handleUpload */

    return(
        <div className="imageUpload">
            <div className="imageUpload__perfil">
                <Avatar className="post__avatar"
                    alt="RafejQazi"
                    src="/static/images/avatar/1.jpg"/>
                <h1 className="imageUpload__username">{username}</h1>
            </div>
            <progress className="imageupload__progress" value={progress} max="100"/>
            <input type="file" onChange={handleChange}/>
            <input className="imageupload__text" type="text" placeholder="Enter a caption..." onChange={event => setCaption(event.target.value)} value={caption}/>
            
            <BootstrapButton onClick={handleUpload} variant="contained" color="#0095F6">
                Compartir
            </BootstrapButton>
        </div>
    )
}

export default ImageUpload;