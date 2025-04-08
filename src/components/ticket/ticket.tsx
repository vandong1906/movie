
import { useEffect } from 'react';
import * as React from 'react'
import './index.css'
import axios from 'axios';
const MovieTicket = () => {
const [data1, setdata1] = React.useState();
  useEffect(()=>{
const respon = async ()=>{
  const data = await axios.get("https://backendmovie-10gn.onrender.com/api/tickets/1" );
  console.log(data.data.ticket_id);
  setdata1(data.data);
}
respon();
  },[])
  console.log(data1)
  return ( <>
    <div className="flex gap-2 items-center justify-center min-h-screen">
      <div className="bg-gray-800 bg-opacity-80 rounded-lg p-6 shadow-lg text-white w-80">
        <div className="mb-4">  
          <p className="text-sm text-gray-400">Date</p>
          <p className="text-lg font-semibold">Mon, 23 Oct 2023</p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-400">Movie Title</p>
          <p className="text-xl font-bold uppercase">Spider-Man: No Way Home</p>
        </div>
        <div className="flex justify-between mb-4">
          <div>
            <p className="text-sm text-gray-400">Ticket(s)</p>
            <p className="text-lg font-semibold">C8, C9, C10</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Hours</p>
            <p className="text-lg font-semibold">14:40</p>
          </div>
        </div>
        <button className="w-full  text-white py-2 rounded-lg transition duration-300">
          Download Ticket
        </button>
      </div>
      <div className="bg-gray-800 bg-opacity-80 rounded-lg p-6 shadow-lg text-white w-80">
        <div className="mb-4">
          <p className="text-sm text-gray-400">Date</p>
          <p className="text-lg font-semibold">Mon, 23 Oct 2023</p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-400">Movie Title</p>
          <p className="text-xl font-bold uppercase">Spider-Man: No Way Home</p>
        </div>
        <div className="flex justify-between mb-4">
          <div>
            <p className="text-sm text-gray-400">Ticket(s)</p>
            <p className="text-lg font-semibold">C8, C9, C10</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Hours</p>
            <p className="text-lg font-semibold">14:40</p>
          </div>
        </div>
        <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300">
          Download Ticket
        </button>
      </div>
      <div className="bg-gray-800 bg-opacity-80 rounded-lg p-6 shadow-lg text-white w-80">
        <div className="mb-4">
          <p className="text-sm text-gray-400">Date</p>
          <p className="text-lg font-semibold">Mon, 23 Oct 2023</p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-400">Movie Title</p>
          <p className="text-xl font-bold uppercase">Spider-Man: No Way Home</p>
        </div>
        <div className="flex justify-between mb-4">
          <div>
            <p className="text-sm text-gray-400">Ticket(s)</p>
            <p className="text-lg font-semibold">C8, C9, C10</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Hours</p>
            <p className="text-lg font-semibold">14:40</p>
          </div>
        </div>
        <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300">
          Download Ticket
        </button>
      </div>
    </div>
    <div className='flex justify-center '>Back to Homepage</div>
  </>
  
  );
};

export default MovieTicket;