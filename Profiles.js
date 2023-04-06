import React, { useEffect, useState } from 'react'
import { authService, db, storage } from 'fbase'
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadString, getDownloadURL } from "firebase/storage";

import Twit from 'components/Twit';

function Profiles({userObj}) {
  const navigate = useNavigate();

  const [twits, setTwits] = useState([]);
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [profileAttachment, setProfileAttachment] = useState("");

  const onLogOutClick = () =>{
    authService.signOut();
    navigate('/')
  }

  useEffect(() => {
    const q = query(collection(db, "twits"),
                where("creatorId", "==", `${userObj.uid}`),
                orderBy("createdAt","desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newArray = [];
      querySnapshot.forEach((doc) => {
          newArray.push({...doc.data(), id:doc.id});
      });
      setTwits(newArray)
    });
  }, []);
  
  const onSubmit = async (e) =>{
    e.preventDefault();
    
    try{
      let profileAttachmentUrl = "";
    if(userObj.displayName !== newDisplayName || profileAttachment!==""){
      const storageRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(storageRef, profileAttachment, 'data_url');
      profileAttachmentUrl = await getDownloadURL(ref(storage, response.ref))
      await updateProfile(userObj,{
        displayName:newDisplayName,
        photoURL : profileAttachmentUrl
      });
    }
  } catch (e) {
    console.error("Error adding document: ", e);
  }
    console.log('userObj-->', userObj)
    setProfileAttachment("");
  };

  const onChange = (e) => {
    const {target: {value}} = e;
    setNewDisplayName(value);
  };

  const onFilechange = (e) =>{
    console.log('e->',e);
    const {target: {files}} = e;

    const theFile = files[0]
    console.log('theFile ->', theFile)

    const reader = new FileReader();
    reader.onloadend = (finishedEvent) =>{
      console.log('finishedEvent =>', finishedEvent)
      const {currentTarget:{result}} = finishedEvent;
      setProfileAttachment(result);
    }
    reader.readAsDataURL(theFile)
  }

  const onclearProfileAttachment = () =>{
    setProfileAttachment("");
  }
  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="text" onChange={onChange} value={newDisplayName} placeholder='Display name'/>
        <input type="file" accept='image/*' onChange={onFilechange}/>
        <input type="submit" value = "Update Profile" />
        {profileAttachment&& (
          <div>
            <img src={profileAttachment} width="100" height = "100" alt="" />
            <button onClick={onclearProfileAttachment}>Remove</button>
          </div>
        )}
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
      <div>
      {twits.map(twit => (
        <Twit key={twit.id} twitObj={twit} isOwner={twit.creatorId === userObj.uid} />
      ))}
      </div>
    </>
  )
}

export default Profiles