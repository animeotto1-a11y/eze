import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Card from './components/Card'

const App = () => {
//axios.get -> get use to get data through API
//axios.post -> to send request to backend to fetch data 
//axios.patch -> to send request to update data 
//axios.delete -> to send request to delete something and get back response

const [userData, setUserData] = useState([])
const [index, setIndex] = useState(1)


const getData = async () =>{
  const response = await axios.get(`https://picsum.photos/v2/list?page=${index}&limit=35`);
  setUserData(response.data)
  console.log(response.data)
}

useEffect(function(){
  getData();
},[index])

let printUserData = <h3 className='text-gray-400 text-semibold text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>Loading...</h3>

if(userData.length>0){
  printUserData = userData.map(function(elem,idx){

    return<div key={idx}>
     <Card elem={elem} />
    </div>
  })
}

  return (
    <div className='bg-black overflow-auto h-screen text-white'>
      <diV className='flex flex-wrap h-[82] gap-8 p-8'>{printUserData}</diV>  

      <div className='flex justify-center gap-6 item-center p-4'>
        <button style={{ opacity: index == 1 ? 0.6 : 1 }} className='bg-white text-sm cursor-pointer px-4 py-2 rounded-2xl font-semibold text-black active:scale-95'
        onClick={()=>{
          if(index>1){
            setIndex(index - 1)
            setUserData([])
          }
        }}>Prev</button>
        <h4>Page {index}</h4>
        <button className='bg-white text-sm cursor-pointer px-4 py-2 rounded-2xl font-semibold text-black active:scale-95'
        onClick={()=>{
         setUserData([])

          setIndex(index + 1)
        }}>Next</button>
      </div>
    </div>
  )
}

export default App
