import React, { useEffect, useState } from 'react'
import { doc, deleteDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db, storage } from 'fbase';
import { ref, deleteObject } from "firebase/storage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import 'styles/Twit.scss'

function Twit(props) {
  const {twitObj: {text,id,attachmentUrl,createdAt}, isOwner} = props;
  const [editing, setEditing] = useState(false)  
  const [newTwit, setNewTwit] = useState(text)
  const [nowDate, setNowDate] = useState(createdAt)

  const onDeleteClick = async () => {
    const ok = window.confirm("삭제하시겠습니까?")
    if (ok) {
    await deleteDoc(doc(db, "twits", `/${id}`));
      if (attachmentUrl !== "") {
        const desertRef = ref(storage, attachmentUrl);
        await deleteObject(desertRef);
      }
    }
  };
  
  const toggleEditing = () => setEditing((prev) => !prev)
  
  const onChange = e => {
    const {target:{value}} = e
    setNewTwit(value);
  }

  const onSubmit = async(e) =>{
    e.preventDefault();
    const newTwitRef = doc(db, "twits", id);

    await updateDoc(newTwitRef, {
      text: newTwit,
      createdAt: Date.now(),
    });
    setEditing(false);
  }

  useEffect(() =>{
    let timeStamp = createdAt;
    const now = new Date(timeStamp)
    setNowDate(now.toDateString())

  }, [])
  return (
  
    <div className='twit'>
      {editing ? (
        <>
          <form onSubmit={onSubmit} className='container twitEdit'>
            <input className='formInput' type="text" onChange={onChange} value={newTwit} required />
            <input className='formBtn' type="submit" value = "Update twit" />
          </form>
          <button className='formBtn cancelBtn' onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{text}</h4>
          {attachmentUrl && (
          <img src={attachmentUrl} width="50" height="50" alt="" />
          )}
          <span>{nowDate}</span>
          {isOwner && (
            <div className='twit__actions'>
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon="fa-solid fa-trash"/>
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon="fa-solid fa-pencil" />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Twit
