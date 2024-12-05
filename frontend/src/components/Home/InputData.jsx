import axios from "axios";
import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";

function InputData({InputDiv, setInputDiv, UpdatedData, setUpdatedData}){
  const [Data, setData] = useState({
    title:"", 
    desc: "",
  });
  useEffect(() => {
    setData({title:UpdatedData.title, desc:UpdatedData.desc});
  },[UpdatedData]);

  const headers = {
    id:localStorage.getItem("id"), 
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  const change = (e) =>{
    const {name, value} = e.target;
    setData({ ...Data, [name]:value });
  };
  const submitData = async () => {
    if(Data.title === "" || Data.desc === ""){
      alert("All fields are required");
    }else{
      await axios.post("http://localhost:1000/api/v2/create-task", Data, {headers,});
      setData({title:"", desc: ""});
      setInputDiv("hidden");
    }
  };
  const UpdateTask = async () => {
    if(Data.title === "" || Data.desc === ""){
      alert("All fields are required");
    }else{
      await axios.put(`http://localhost:1000/api/v2/update-task/${UpdatedData.id}`, Data, {headers,});
      setUpdatedData({
        id: "",
        title: "",
        desc: "",
      });
      setData({title:"", desc: ""});
      setInputDiv("hidden");
    }
  };
  return (
    <>
      {/* ek layer bna diye hai pure screen pr blur type ka */}
      <div className={`${InputDiv} top-0 left-0 bg-gray-800 opacity-80 h-screen w-full`}></div>

      {/* ye blur ke upr ek or div jo center me hai or iske ek div lekr form type ka kuch bna rhe hai. */}
      <div className={`${InputDiv} top-0 left-0 flex items-center justify-center h-screen w-full`}>

        {/* ab iss div ke andr hm form banayenge */}

        <div className="w-2/6 bg-gray-900 p-4 rounded">
          
          {/* close button right side me */}
          <div className="flex justify-end">
            <button 
              className="text-2xl" 
              onClick={() => {
                setInputDiv("hidden");
                setData({
                  title: "",
                  desc: "",
                })
                setUpdatedData({
                  id: "",
                  title: "",
                  desc: "",
                });
              }}
            ><RxCross2 />
            </button>
          </div>
          
          {/* ye input or description k liy */}
          <input 
            type="text" 
            placeholder="Title" 
            name="title" 
            className="px-3 py-2 bg-gray-700 rounded w-full my-3"
            value={Data.title}
            onChange={change}
          />

          <textarea 
            name="desc" 
            cols="30" 
            rows="10" 
            placeholder="Description..." 
            className="px-3 py-2 rounded w-full bg-gray-700 my-3"
            value={Data.desc}
            onChange={change}
          />
          {UpdatedData.id === "" ? (<button 
            className="px-3 py-2 bg-blue-500 rounded text-black text-xl font-semibold"
            onClick={submitData}
          >Submit
          </button>) : (<button 
            className="px-3 py-2 bg-blue-500 rounded text-black text-xl font-semibold"
            onClick={UpdateTask}
          >Update
          </button>
          )}
          


          {/* ye button k liy */}
          
        </div>
        
      </div>
      
    </>
  );
}

export default InputData;