import React, { useState, useEffect } from 'react';
import './Post.css';
import { db } from './firebase';
import Avatar from '@material-ui/core/Avatar';
import firebase from 'firebase';

function Post({ postId,user,username,caption,imageUrl }){
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if (postId){
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp','desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                });
        }

        return () => {
            unsubscribe();
        };
    },[postId]);

    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }

    return(
        <div className="post">
            <div className="post__header">
                <Avatar className="post__avatar"
                alt="RafejQazi"
                src="/static/images/avatar/1.jpg"/>
                <h3>{username}</h3>
            </div>
            
            <img className="post__image"
                 src={imageUrl} alt="">
            </img>
            
            <h4 className="post__text"><strong style={{fontWeight:'600'}}>{username}</strong><h7 style={{marginLeft: '5px', fontSize:'14px'}}>{caption}</h7></h4>
            
            <div className="post__comments">
                {comments.map((comment) => (
                    <p>
                        <strong style={{fontWeight:'600', fontSize:'14px'}}>{comment.username}</strong><h7 style={{marginLeft: '5px', fontSize:'14px'}}>{comment.text}</h7>
                    </p>
                ))}
            </div>

            {user && (
                <form className="post__commentBox">
                    <input
                        className="post__input"
                        type="text"
                        placeholder="Agrega un comentario..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}/>
                    <button
                        className="post__button"
                        disabled={!comment}
                        type="submit"
                        onClick={postComment}
                    >
                        Publicar
                    </button>
                </form>
            )}

            
        
        </div>
    );
};

export default Post;