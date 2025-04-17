import { useEffect } from "react";
import * as React from "react";
import "./index.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
interface ticket {
  ticket_id: number;
  orderInfo: number;
  seat_number: string;
  price: number;
}
const MovieTicket = () => {
  const [data1, setdata1] = React.useState<ticket[] | null>();
  useEffect(() => {
    const respon = async () => {
      const data = await axios.get(
        "https://backendmovie-10gn.onrender.com/api/admins/1"
      );
      const { tickets } = data.data;

      setdata1(tickets);
    };
    respon();
  }, []);
  const navigator=useNavigate();
  console.log(data1);
  return (
    <>
    <button 
        onClick={()=>navigator('/')}
        className="text-white cursor-pointer bg-orange-300 border-2  ">
          Back To HomePage
        </button>
      <div className=" flex justify-center items-center  flex-col bg-cover bg-[url(https://s3-alpha-sig.figma.com/img/ac26/65e1/7e7536becff2727e8b3e5763e0b700ae?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=JbvtTeD8NFSWKsTwp4RNhmzNwySMCqihKtDd7vysoOXzh21SReSrw~kjTfiTFJKrlIwlH2fs33HPc1zjElAAHa7c~Qm8hou4kYJg6AMGJIz~SxtoyvnbdFAyt8hkwesWaocxHpG0Xlu5XhJYKBkuspF5ZsoaH5xVjrDuVNsFGooSkvWxKoIdqnIRJMdD-nJ5b4QmObvn3Mnsz2~6fSSciVmsXEp4A7GiSfHuStup0YJJRo-O4wZMqkXW2sMCKLLPxsJhoLgyW5XQFOwNnHPCtjRCI0MUhcvlOLJFDwy1VgvICYAcMO5fr4Parbc0fAIR2chpx0gk2qT16LwyoEXUlw__)]">
        
        <span className="text-amber-600 size-7 border-2 bg-white text-center ">
          My TICKET
        </span>
        <div className="flex gap-2 items-center justify-center min-h-screen ">
          <div className="bg-gray-800 bg-opacity-80 rounded-lg p-6 shadow-lg text-white w-80">
            {data1?.map((ticket) => (
              <div key={ticket.ticket_id} className="mb-4">
                <p className="text-sm text-gray-400">Date</p>
                <p className="text-lg font-semibold">Mon, 23 Oct 2023</p>
                <div className="mb-4">
                  <p className="text-sm text-gray-400">Movie Title</p>
                  <p className="text-xl font-bold uppercase">
                    Spider-Man: No Way Home
                  </p>
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
                {/* <div className="flex justify-center mb-4">
                    <p className="text-xl font-bold uppercase"> {ticket.price}</p>
                  </div> */}
                <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300">
                  Download Ticket
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieTicket;
