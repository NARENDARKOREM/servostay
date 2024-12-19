import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { Link, useNavigate } from 'react-router-dom'
import ImageUploader from '../common/ImageUploader'
import axios from 'axios'
import { useLoading } from '../Context/LoadingContext';
import { useLocation } from 'react-router-dom';
import Loader from '../common/Loader';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import api from '../utils/api'

const FacilityAdd = () => {
  const location=useLocation()
  const navigate=useNavigate()
  const id=location.state ? location.state.id : null
  const[formData, setFormData] = useState({id : id || null,title:"",img:"",status:0});
  const { isLoading, setIsLoading } = useLoading();

  useEffect(()=>{
    if(id){
      fetchFacility(id)
    }
  },[id])

  const fetchFacility=async(id)=>{
    try {
      const response = await api.get(`/facilities/${id}`);
      const facility=response.data
      setFormData({
        id,
        title:facility.title,
        img:facility.img,
        status:facility.status

      })
    } catch (error) {
        console.error("Error fetching country data:", error);
    } 
  }

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); 

    return () => clearTimeout(timer);
  }, [location, setIsLoading]);


  const handleImageUploadSuccess = (imageUrl) => {
    setFormData((prevData) => ({
      ...prevData,
      img: imageUrl,
    })); 
  };

  const handleChange=(e)=>{
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      id: prevData.id
    }));
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
    console.log(formData)

    try {
      const apiEndpoint = id
        ? `${api}/facilities/upsert`
        : `${api}/facilities/upsert`;

      const method = id ? "post" : "post";
      const response = await api.post('/facilities/upsert',formData);

      const successMessage = id
        ? "facility updated successfully!"
        : "facility added successfully!";
      if (response.status === 200 || response.status === 201) {
              NotificationManager.removeAll();
              NotificationManager.success(successMessage);
                setTimeout(() => {
                  navigate("/facility-list");
                }, 2000);
            } else {
              NotificationManager.success("Something went wrong. Please try again.");
            }
    } catch (error) {
      NotificationManager.removeAll();
      console.error("Error submitting facility data:", error);
      NotificationManager.error("An error occurred. Please try again.");
    }
  }

  return (
    <div>
      {isLoading && <Loader />}
      <div className="flex bg-[#f7fbff]">
      {/* Sidebar */}
      <main className="flex-grow">
        <Header />
        <div className="container mx-auto">
          <div className="flex items-center mt-6  mb-4">
            {/* <Link to="/rolesList" className="cursor-pointer ml-6">
              
            </Link> */}
            <h2 className="text-lg font-semibold ml-4 header" >Facility Management</h2>
          </div>

          {/* Form Container */}
          <div className="h-full px-6 max-w-5xl" style={{paddingTop:'24px'}}> 
            <div className="bg-white h-[70vh] w-full rounded-xl border border-[#EAE5FF] py-4 px-6 overflow-y-auto scrollbar-none" >
              {/* <p className='text-left font-bold font-[Montserrat]' >Create Service</p> */}
              <form  onSubmit={handleSubmit} className="mt-4">
                <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-1  mt-6">
                  {/* facility name */}
                  <div className="flex flex-col">
                        <label  htmlFor="title"  className="text-sm font-medium text-start text-[12px] font-[Montserrat]">Facility Name</label>
                        <input  id="title"  name="title"  type="text" value={formData.title}  required  className="border rounded-lg p-3 mt-1 w-full h-14" style={{  borderRadius: '8px', border: '1px solid #EAEAFF'}}
                          onChange={handleChange}
                        />
                  </div>
                 
                </div>
                <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-1 mt-6">
                    {/* facility image*/}
                    <div className="flex flex-col">
                      <label  htmlFor="img"  className="text-sm font-medium text-start text-[12px] font-[Montserrat]">Facility Image</label>
                      <ImageUploader onUploadSuccess={handleImageUploadSuccess}/>
                      {formData.img && (
                      <div className="mt-4">
                        <img
                          src={formData.img}
                          alt="Uploaded Preview"
                          className="w-32 h-32 object-cover rounded"
                        />
                      </div>
                    )}
                    </div>
                    
                </div>

                <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-1 mt-6">
                  {/* facility image Status */}
                  <div className="flex flex-col">
                    <label  htmlFor="status"   className="text-sm font-medium text-start text-[12px] font-[Montserrat]" >Facility Status </label>
                    <select  name="status" value={formData.status} onChange={handleChange} id="status"  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"  >
                      <option value="" disabled selected>Select Status</option>
                      <option value={1}>Publish</option>
                      <option value={0}>Unpublish</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-start mt-6 gap-3">
                  <button  type="submit" className={`py-2 ${ id ? ' bg-green-500 hover:bg-green-600 ' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg  w-[150px] h-12 font-[Montserrat] font-bold`} style={{ borderRadius: "8px", }} > {id ? 'Update Facility' : 'Add Facility'} </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </main>
      <NotificationContainer />
    </div>
    </div>
  )
}

export default FacilityAdd