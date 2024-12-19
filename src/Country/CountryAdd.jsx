import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { Link, useNavigate, useParams } from "react-router-dom";
import SidebarMenu from "../components/SideBar";
import axios from "axios";
import { useLoading } from "../Context/LoadingContext";
import { useLocation } from "react-router-dom";
import Loader from "../common/Loader";
import ImageUploader from "../common/ImageUploader";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import api from "../utils/api";

const CountryAdd = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const id = location.state ? location.state.id : null;
  const { isLoading, setIsLoading } = useLoading();
  const [formData, setFormData] = useState({
    id: id || null,
    title: "",
    img: "",
    status: 0,
  });

  useEffect(() => {
    setIsLoading(true);
    if (id) {
      getCountry(id);
    }
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [id, location, setIsLoading]);

  const getCountry = async (id) => {
    try {
      const response = await api.get(`/countries/${id}`);
      const country = response.data;
      setFormData({
        id: country.id,
        title: country.title,
        img: country.img,
        status: country.status,
      });
    } catch (error) {
      console.error("Error fetching country data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      id: prevData.id
    }));
  };

  const handleImageUploadSuccess = (imageUrl) => {
    setFormData((prevData) => ({
      ...prevData,
      img: imageUrl,
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiEndpoint = id  ? `http://localhost:5000/countries/upsert`  : `http://localhost:5000/countries/upsert`;

      const method = id ? "post" : "post";

      const response = await axios[method](apiEndpoint, formData, {
        withCredentials: true,
      });

      const successMessage = id ? "Country updated successfully!" : "Country added successfully!";
      if(response.status === 200 || response.status === 201){
        NotificationManager.removeAll();
        NotificationManager.success(successMessage);
        setTimeout(() => {
          navigate("/country-list");
        }, 2000);
      }
      
    } catch (error) {
      NotificationManager.removeAll();
      console.error("Error submitting country data:", error);
      NotificationManager.error("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      {isLoading && <Loader />}
      <div className="flex bg-[#f7fbff]">
        <main className="flex-grow">
          <Header />
          <div className="container mx-auto">
            <div className="flex items-center mt-6  mb-4">
              {/* <Link to="/rolesList" className="cursor-pointer ml-6">
              
            </Link> */}
              <h2 className="text-lg font-semibold ml-4 " style={{ color: '#000000', fontSize: '24px', fontFamily: 'Montserrat' }}>Country Management</h2>
            </div>
            <div className="h-full px-6 max-w-5xl"  style={{ paddingTop: "24px" }} >
              <div className="bg-white h-[70vh] w-full rounded-xl border border-[#EAE5FF] py-4 px-6 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-1 mt-6">
                    {/* Country Name */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="country_name"
                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                      >
                        Country Name
                      </label>
                      <input id="country_name" value={formData.title} onChange={handleChange} name="title" type="text" required className="border rounded-lg p-3 mt-1 w-full h-14"
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #EAEAFF",
                        }}
                        placeholder="Enter Country name"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-1 mt-6">
                    {/* Country Image */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="country_image"
                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                      >
                        Country Image
                      </label>
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
                    {/* Country Status */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="country_status"
                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                      >
                        Status
                      </label>
                      <select
                        name="status"
                        id="country_status"
                        value={formData.status}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value={1}>Publish</option>
                        <option value={0}>Unpublish</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-start mt-6 gap-3">
                    <button
                      type="submit"
                      className={`py-2 ${id ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}  text-white rounded-lg  w-[150px] h-12 font-[Montserrat] font-bold`}
                      style={{ borderRadius: "8px" }}
                    >
                      {id ? "Update Country" : "Add Country"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
        <NotificationContainer />
      </div>
    </div>
  );
};

export default CountryAdd;