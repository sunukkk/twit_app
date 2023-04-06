import React, { useEffect, useState } from 'react'
import { collection, getDocs, onSnapshot, query, orderBy } from "firebase/firestore";
import { db, storage } from 'fbase';
import Twit from 'components/Twit';
import TwitInsert from 'components/TwitInsert';


function Home({userObj}) {

  const [twits, setTwits] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "twits"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newArray = [];
      querySnapshot.forEach((doc) => {
        newArray.push({ ...doc.data(), id: doc.id });
      });
      setTwits(newArray);
    });
    return () => unsubscribe();
  },[]);

 
  return (
    <div className='container'>
      <TwitInsert userObj ={userObj}/>
      {twits.map(twit => (
        // <div key = {twit.id}>
        //    <h4>{twit.text}</h4>
        // </div>
      
      <Twit key={twit.id} twitObj={twit} isOwner={twit.creatorId === userObj.uid}/>
      ))}
      <footer>&copy; {new Date().getFullYear()} Twit app</footer>
    </div>
  )
}

export default Home

