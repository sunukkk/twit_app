import React, { useState } from 'react'
import { db, storage } from 'fbase';
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { addDoc, collection } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'styles/TwitInsert.scss'

function TwitInsert({userObj}) {
  
  const [attachment, setAttachment] = useState("")
  const [twit, setTwit] = useState("");

  console.log({userObj})
  const onChange = (e) =>{
    e.preventDefault();
    const {target: {value}} = e;
    setTwit(value);
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    
    try {
      let attachmentUrl = "";  
      if(attachment !== ""){
        const storageRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
        const response = await uploadString(storageRef, attachment, 'data_url'); 
        console.log('response ->>', response)
        attachmentUrl = await getDownloadURL(ref(storage, response.ref));
      }
      if(twit === "")return;
        const docRef = await addDoc(collection(db, "twits"), {
          text: twit,
          createdAt: Date.now(),
          creatorId: userObj.uid,
          attachmentUrl
        });
      console.log("Document written with ID: ", docRef.id);
      
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setTwit("");
    setAttachment("");
  }


  const onFilechange = (e) =>{
    console.log('e->',e);
    const {target: {files}} = e;

    const theFile = files[0]
    console.log('theFile ->', theFile)

    const reader = new FileReader();
    reader.onloadend = (finishedEvent) =>{
      console.log('f.e =>', finishedEvent)
      const {currentTarget:{result}} = finishedEvent;
      setAttachment(result);
    }
    reader.readAsDataURL(theFile)
  }

  const onclearAttachment = () =>{
    setAttachment("");
  }
  
  return (
    <form onSubmit={onSubmit} className='InsertForm'>
      <div className='InsertInput__container'>
        <input type="text" placeholder="What's on yoru mind?" value={twit} onChange={onChange} maxLength={120} className='InsertInput__input'/>
        <input type="submit" value = '&rarr;' className='InsertInput__arrow'/>
      </div>
      <label htmlFor="" className='InsertInput__label'>
        <span>Add Photos<FontAwesomeIcon icon="fa-solid fa-plus" />
          <input type="file" accept='image/*' onChange={onFilechange}
             id='attach-file' style={{opacity:0}}/>
        </span>
      </label>
      {attachment &&(
      <div className= 'Insertform__attachment'>
        <img src={attachment} width="50" height ="50"  style={{backgroundImage:attachment}} alt=""/>
        <div className='Insertform__clear' onClick={onclearAttachment}>
          <span>Remove</span>
          <FontAwesomeIcon icon="fa-solid fa-xmark" />
        </div>
      </div>
    )}
  </form>
  )
}

export default TwitInsert