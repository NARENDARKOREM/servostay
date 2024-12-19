import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { Link, useNavigate } from 'react-router-dom'
import SidebarMenu from '../components/SideBar'
import axios from 'axios'
import ImageUploader from '../common/ImageUploader';
import { useLoading } from '../Context/LoadingContext';
import { useLocation } from 'react-router-dom';
import Loader from '../common/Loader';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import api from '../utils/api'

const Settings = () => {
  const [formData, setFormData] = useState({id:'',  webname: '',weblogo:'',  timezone: '',  currency: '',  tax: '',  sms_type: '',  auth_key: '',  twilio_number: '',  auth_token: '',  acc_id: '',otp_id:'', otp_auth:'', show_property:'', one_key:'', one_hash:'', rcredit:'', rcredit:'',scredit:'', wlimit:''});
  const location = useLocation();
  const { isLoading, setIsLoading } = useLoading();
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/settings");

        if (response.status === 200) {
          const settingsData = response.data;
          setFormData({
            ...formData,
            ...settingsData, 
          });
        }
      } catch (error) {
        console.error("Error fetching settings:", error.response?.data || error.message);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); 

    return () => clearTimeout(timer);
  }, [location, setIsLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

const handleImageUploadSuccess = (imageUrl) => {
  setFormData((prevData) => ({
    ...prevData,
    weblogo: imageUrl,
  }));
  
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
 
    try {
      const response = await axios.put(
        `http://localhost:5000/settings/update/${formData.id}`, 
        formData, 
        {
          withCredentials: true,
          
        }
      );
      // console.log(response.data);
      if (response.status === 200) {
        NotificationManager.removeAll();
        NotificationManager.success('Settings updated successfully');
      }
    } catch (error) {
        NotificationManager.removeAll();
        NotificationManager.error(error);
    }
  };

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
            <div className="flex items-center mt-6  mb-4">
                    <Link onClick={()=>{navigate(-1)}}  className="cursor-pointer ml-6">
                    <ArrowBackIosNewIcon />
                    </Link>
                    <h2 className="text-lg font-semibold ml-4 header" >Settings Management</h2>
                </div>
          </div>

          {/* Form Container */}
          <div className="h-full px-6 max-w-5xl" style={{paddingTop:'24px'}}> 
            <div className="bg-white h-[70vh] w-full rounded-xl border border-[#EAE5FF] py-4 px-6 overflow-y-auto scrollbar-none">
              <form className="mt-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-3 mt-6">
                        {/* website Name*/}
                        <div className="flex flex-col">
                            <label  htmlFor="webname"  className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> <span style={{color:'red'}}>*</span> Website Name </label>
                            <input id="webname" name="webname" type="text" value={formData.webname} required className="border rounded-lg p-3 mt-1 w-full h-14" style={{  borderRadius: '8px',border: '1px solid #EAEAFF'}}
                                onChange={handleChange}
                            />
                        </div>

                        {/* website image */}
                        <div className="flex flex-col">
                            <label  htmlFor="weblogo"  className="text-sm font-medium text-start text-[12px] font-[Montserrat]"><span style={{color:'red'}}>*</span>Website Image</label>
                            <ImageUploader onUploadSuccess={handleImageUploadSuccess}/>
                            <img width={400} src={formData.weblogo} alt="" />
                        </div>

                        {/* time zone */}
                        <div className="flex flex-col">
                            <label  htmlFor="timezone"   className="text-sm font-medium text-start text-[12px] font-[Montserrat]" ><span style={{color:'red'}}>*</span> Select Timezone </label>
                            <select  name="timezone"  id="timezone" value={formData.timezone}  className="mt-1 block w-full p-4  bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm" onChange={handleChange} >
                                <option value="" disabled selected>Select TimeZone</option>
                                <option value="asia/kolkata" >Asia/Kolkata</option>
                            </select>
                        </div>
                        {/* currency*/}
                        <div className="flex flex-col">
                            <label  htmlFor="currency"  className="text-sm font-medium text-start text-[12px] font-[Montserrat]"><span style={{color:'red'}}>*</span> Currency</label>
                            <input  id="currency"  name="currency"  type="text" value={formData.currency}  required  className="border rounded-lg p-3 mt-1 w-full h-14" style={{  borderRadius: '8px', border: '1px solid #EAEAFF'}}
                                onChange={handleChange}
                            />
                        </div>
                    
                    {/* tax */}
                    <div className="flex flex-col">
                        <label  htmlFor="tax"  className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> <span style={{color:'red'}}>*</span>Tax</label>
                        <input id="tax" name="tax" type="text" required value={formData.tax} className="border rounded-lg p-3 mt-1 w-full h-14" style={{  borderRadius: '8px',border: '1px solid #EAEAFF'}}
                            onChange={handleChange}
                            placeholder="e.g 5"
                        />
                    </div>
                    {/* sms type */}
                    <div className="flex flex-col">
                        <label  htmlFor="sms_type"   className="text-sm font-medium text-start text-[12px] font-[Montserrat]" ><span style={{color:'red'}}>*</span> Sms Type </label>
                            <select  name="sms_type"  id="sms_type" value={formData.sms_type}  className="mt-1 block w-full p-4  bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"  onChange={handleChange}>
                                <option value="" disabled selected>Select sms type</option>
                                <option value="msg91">Msg91</option>
                                <option value="twilo">Twilo</option>
                            </select>
                    </div>
                </div>
                <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-2  mt-6">
                  {/* msg91 auth key */}
                  <div className="flex flex-col">
                      <label  htmlFor="auth_key"  className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> <span style={{color:'red'}}>*</span>Msg91 Auth Key</label>
                      <input id="auth_key" name="auth_key" type="text" required value={formData.auth_key} className="border rounded-lg p-3 mt-1 w-full h-14" style={{  borderRadius: '8px',border: '1px solid #EAEAFF'}}
                        onChange={handleChange}
                        placeholder="*****"
                      />
                    </div>
                  {/* Msg91Otp Template Id */}
                  <div className="flex flex-col">
                      <label  htmlFor="Msg91Otp"  className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> <span style={{color:'red'}}>*</span> Msg91 Otp Template Id </label>
                      <input id="otp_id" name="otp_id" type="text" required value={formData.otp_id} className="border rounded-lg p-3 mt-1 w-full h-14" style={{  borderRadius: '8px',border: '1px solid #EAEAFF'}}
                        onChange={handleChange}
                        placeholder="*****"
                      />
                    </div>
    
                </div>
                <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-3  mt-6">
                    {/* *Twilio Account SID */}
                    <div className="flex flex-col">
                      <label  htmlFor="acc_id"  className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> <span style={{color:'red'}}>*</span>Twilio Account SID</label>
                      <input id="acc_id" name="acc_id" type="text" required value={formData.acc_id} className="border rounded-lg p-3 mt-1 w-full h-14" style={{  borderRadius: '8px',border: '1px solid #EAEAFF'}}
                        onChange={handleChange}
                        placeholder='*****'
                      />
                    </div>

                  {/* Twilio Auth Token */}
                  <div className="flex flex-col">
                      <label  htmlFor="auth_token"  className="text-sm font-medium text-start text-[12px] font-[Montserrat]"><span style={{color:'red'}}>*</span>Twilio Auth Token</label>
                      <input id="auth_token" name="auth_token" type="text" required value={formData.auth_token} className="border rounded-lg p-3 mt-1 " style={{  borderRadius: '8px',border: '1px solid #EAEAFF'}}
                        onChange={handleChange}
                        placeholder='*****'
                      />
                  </div>

                  {/* Twilio Phone Number */}
                  <div className="flex flex-col">
                      <label  htmlFor="twilio_number"  className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> <span style={{color:'red'}}>*</span>Twilio Phone Number</label>
                      <input id="twilio_number" name="twilio_number" type="text" required value={formData.twilio_number} className="border rounded-lg p-3 mt-1 " style={{  borderRadius: '8px',border: '1px solid #EAEAFF'}}
                        onChange={handleChange}
                        placeholder='*****'
                      />
                  </div>
                </div>

                <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-2  mt-6">
                    {/** Otp Auth In Signup ? */}
                    <div className="flex flex-col">
                      <label  htmlFor="otp_auth"  className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> <span style={{color:'red'}}>*</span> Show Add Property Button ? </label>
                      <input id="otp_auth" name="otp_auth" type="text" required value={formData.otp_auth} className="border rounded-lg p-3 mt-1 w-full h-14" style={{  borderRadius: '8px',border: '1px solid #EAEAFF'}}
                        onChange={handleChange}
                        placeholder='*****'
                      />
                    </div>

                    {/** Show Add PropertyButton ? */}
                    <div className="flex flex-col">
                      <label  htmlFor="show_property"  className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> <span style={{color:'red'}}>*</span> Show Add Property Button ? </label>
                      <input id="show_property" name="show_property" type="text" value={formData.show_property} required className="border rounded-lg p-3 mt-1 w-full h-14" style={{  borderRadius: '8px',border: '1px solid #EAEAFF'}}
                        onChange={handleChange}
                        placeholder='*****'
                      />
                    </div>
                </div>

                <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-2  mt-6">
                    {/** User App OnesignalAppId*/}
                    <div className="flex flex-col">
                      <label  htmlFor="one_key"  className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> <span style={{color:'red'}}>*</span> User App Onesignal App Id</label>
                      <input id="one_key" name="one_key" type="text" required value={formData.one_key} className="border rounded-lg p-3 mt-1 w-full h-14" style={{  borderRadius: '8px',border: '1px solid #EAEAFF'}}
                        onChange={handleChange}
                        placeholder='*****'
                      />
                    </div>

                    {/** User App Onesignal RestApiKey */}
                    <div className="flex flex-col">
                      <label  htmlFor="one_hash"  className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> <span style={{color:'red'}}>*</span> User App Onesignal Rest Api Key </label>
                      <input id="one_hash" name="one_hash" type="text" required value={formData.one_hash} className="border rounded-lg p-3 mt-1 w-full h-14" style={{  borderRadius: '8px',border: '1px solid #EAEAFF'}}
                        onChange={handleChange}
                        placeholder='*****'
                      />
                    </div>
                </div>

                <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-3  mt-6">                   
                  {/* * SignUpCredit*/}
                  <div className="flex flex-col">
                      <label  htmlFor="scredit"  className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> <span style={{color:'red'}}>*</span> Sign Up Credit</label>
                      <input id="scredit" name="scredit" type="text" required value={formData.scredit} className="border rounded-lg p-3 mt-1 " style={{  borderRadius: '8px',border: '1px solid #EAEAFF'}}
                        onChange={handleChange}
                        placeholder='*****'
                      />
                  </div>

                  {/* * ReferCredit*/}
                  <div className="flex flex-col">
                      <label  htmlFor="rcredit"  className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> <span style={{color:'red'}}>*</span> Refer Credit</label>
                      <input id="rcredit" name="rcredit" type="text" required value={formData.rcredit} className="border rounded-lg p-3 mt-1 " style={{  borderRadius: '8px',border: '1px solid #EAEAFF'}}
                        onChange={handleChange}
                        placeholder='*****'
                      />
                  </div>

                  {/* *  Payout Withdraw Limit*/}
                  <div className="flex flex-col">
                      <label  htmlFor="wlimit"  className="text-sm font-medium text-start text-[12px] font-[Montserrat]"> <span style={{color:'red'}}>*</span> Payout Withdraw Limit </label>
                      <input id="wlimit" name="wlimit" type="text" required value={formData.wlimit} className="border rounded-lg p-3 mt-1 " style={{  borderRadius: '8px',border: '1px solid #EAEAFF'}}
                        onChange={handleChange}
                        placeholder='*****'
                      />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-start mt-6 gap-3">
                  <button  type="submit" className=" py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 w-[150px] h-12 font-[Montserrat] font-bold" style={{ borderRadius: "8px", }} >Edit Setting </button>
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

export default Settings