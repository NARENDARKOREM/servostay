import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SidebarMenu from "../components/SideBar";
import axios from "axios";
import ImageUploader from "../common/ImageUploader";
import Select from 'react-select';
import api from "../utils/api";

const PropertiesAdd = () => {
  const location = useLocation()
  const id = location.state ? location.state.id : null;
  const [formData, setFormData] = useState({
    id: 0 || null,
    title: '',
    image: '',
    price: 0,
    status: 0,
    address: '',
    facility: '',
    description: '',
    beds: 0,
    bathroom: 0,
    sqrft: 0,
    rate: 0,
    ptype: 0,
    latitude: '',
    longtitude: '',
    mobile: '',
    city: '',
    listing_date: '',
    add_user_id: 1,
    rules: '',
    country_id: 0,  // New country field
    plimit: 0,
    is_sell: 0
  });

  const [countries, setCountries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getProperty();
    }
  }, []);

  const getProperty = async () => {
    try {
      const response = await api.get(`/properties/${id}`)
      const Property = response.data;
      console.log(Property, "Property Data");
      setFormData({
        id,
        title: Property.title,
        image: Property.image,
        price: Property.price,
        status: Property.status,
        address: Property.address,
        facility: Property.facility,
        description: Property.description,
        beds: Property.beds,
        bathroom: Property.bathroom,
        sqrft: Property.sqrft,
        rate: Property.rate,
        ptype: Property.ptype,
        latitude: Property.latitude,
        longtitude: Property.longtitude,
        mobile: Property.mobile,
        city: Property.city,
        listing_date: Property.listing_date,
        add_user_id: Property.add_user_id,
        rules: Property.rules,
        country_id: Property.country_id,
        plimit: Property.plimit,
        is_sell: Property.is_sell,

      })
    } catch (error) {
      console.error("Error fetching Property:", error);
    }
  }

  useEffect(() => {
    // Fetch countries
    api.get('/countries/all')
      .then(response => setCountries(response.data))
      .catch(error => console.error('Error fetching countries:', error));

    // Fetch categories
    api.get('/categories/all')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));

    api.get('/facilities/all')
      .then(response => setFacilities(response.data))
      .catch(error => console.error('Error fetching facilities:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };



  const handleBlur = (e) => {

  }

  const handleFocus = (e) => {

  }


  const handleImageUploadSuccess = (imageUrl) => {
    setFormData((prevData) => ({
      ...prevData,
      image: imageUrl,
    }));

  };
  console.log(formData, "from formdata");
  const handleSubmit = async (e) => {
    e.preventDefault();


    console.log(formData, "from formdata");
    try {
      await api.post('/properties/upsert',
        formData,
       );
      alert('Property submitted successfully');
      navigate("/property-list")

    } catch (error) {
      console.error('Error submitting property:', error);
      alert('Error submitting property');
    }
  };

  const [selectedOption, setSelectedOption] = useState(null);


  return (
    <div>
      <div className="flex bg-[#f7fbff]">
        {/* Sidebar */}

        <main className="flex-grow">
          <Header />
          <div className="container mx-auto">
            <div className="flex items-center mt-6  mb-4">
              {/* <Link to="/rolesList" className="cursor-pointer ml-6">
              
            </Link> */}
              <h2
                className="text-lg font-semibold ml-4 "
                style={{
                  color: "#000000",
                  fontSize: "24px",
                  fontFamily: "Montserrat",
                }}
              >
                Create Property
              </h2>
            </div>

            {/* Form Container */}
            <div
              className="h-full px-6 max-w-5xl"
              style={{ paddingTop: "24px" }}
            >
              <div
                className="bg-white h-[70vh] w-full rounded-xl border border-[#EAE5FF] py-4 px-6"
                style={{
                  maxHeight: "calc(100vh - 100px)",
                  overflowY: "auto",
                  scrollbarWidth: "none",
                }}
              >
                <form className="mt-4" onSubmit={handleSubmit}>
                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-3 mt-6">
                    {/* property title */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="title"
                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                      >
                        {" "}
                        Property Title{" "}
                      </label>
                      <input
                        id="title"
                        name="title"
                        type="text"
                        value={formData.title}
                        required
                        className="border rounded-lg p-3 mt-1 w-full h-14"
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #EAEAFF",
                        }}
                        onFocus={() => handleFocus("title")}
                        onBlur={() => handleBlur("title")}
                        onChange={handleChange}
                        placeholder="Enter property title"
                      />
                    </div>

                    {/* property image*/}
                    <div className="flex flex-col">
                      <label
                        htmlFor="image"
                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                      >
                        Property Image
                      </label>
                      <ImageUploader
                        onUploadSuccess={handleImageUploadSuccess}
                      />
                    </div>



                    {/* property price per night */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="cupponCode"
                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                      >
                        {" "}
                        Property Price Per Night{" "}
                      </label>
                      <input
                        id="PropertyPricePerNight"
                        value={formData.price}
                        name="price"
                        type="text"
                        required
                        className="border rounded-lg p-3 mt-1 w-full h-14"
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #EAEAFF",
                        }}
                        onFocus={() => handleFocus("PropertyPricePerNight")}
                        onBlur={() => handleBlur("PropertyPricePerNight")}
                        onChange={handleChange}
                        placeholder="Enter  Price Per Night"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-3  mt-6">
                    {/*property country*/}
                    <div className="flex flex-col">
                      <label
                        htmlFor="country_id"
                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                      >
                        {" "}
                        Property Country ?
                      </label>
                      <select
                        name="country_id"
                        value={formData.country_id}
                        onChange={handleChange}
                        id="country_id"
                        className="mt-1 block w-full p-4  bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value={0} disabled selected>
                          Select Country
                        </option>
                        {countries &&
                          countries.map((item) => {
                            return (
                              <option key={item.id} value={item.id}>{item.title}</option>
                            );
                          })}
                      </select>
                    </div>

                    {/* propert status */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="propertySellOrRent"
                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                      >
                        {" "}
                        property Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        id="propertySellOrRent"
                        className="mt-1 block w-full p-4  bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="" disabled selected>
                          Select Staus
                        </option>
                        <option value={1}>Publish</option>
                        <option value={0}>Unpublish</option>
                      </select>
                    </div>

                    {/* Property Total Person Allowed? */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="PropertyTotalPersonAllowed"
                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                      >
                        Property Total Person Allowed?
                      </label>
                      <input
                        id="PropertyTotalPersonAllowed?"
                        name="plimit"
                        type="number"
                        required
                        value={formData.plimit}
                        onChange={handleChange}
                        className="border rounded-lg p-3 mt-1 w-full h-14"
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #EAEAFF",
                        }}
                        onFocus={() =>
                          handleFocus("PropertyTotalPersonAllowed")
                        }
                        onBlur={() => handleBlur("PropertyTotalPersonAllowed")}
                        placeholder="Enter Person Limit "
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-2  mt-6">
                    {/* Property address */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="address"
                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                      >
                        Property Address
                      </label>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}
                        required
                        className="border rounded-lg p-3 mt-1 w-full h-14"
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #EAEAFF",
                        }}
                        onFocus={() => handleFocus("address")}
                        onBlur={() => handleBlur("address")}
                        onChange={handleChange}
                        placeholder="Enter Property Address "
                      />
                    </div>

                    {/* Select Property Facility */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="facility"
                        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
                      >
                        Select Property Facility
                      </label>

                      <Select
                        isMulti
                        name="facility"
                        value={facilities.filter((facility) =>
                          formData.facility.split(",").includes(facility.id.toString())
                        ).map(facility => ({ value: facility.id, label: facility.title }))}


                        options={facilities.map((facility) => ({
                          value: facility.id,
                          label: facility.title,
                        }))}

                        // Update formData when selection changes
                        onChange={(selectedOptions) => {
                          const selectedIds = selectedOptions.map((option) => option.value);
                          setFormData((prevData) => ({
                            ...prevData,
                            facility: selectedIds.join(","), // Store selected IDs as comma-separated string
                          }));
                        }}

                        className="mt-1 block w-full text-sm border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        classNamePrefix="select"
                        placeholder="Select Facilities"
                      />
                    </div>



                  </div>

                  <div className="grid gap-6 w-full sm:grid-cols-1 md:grid-cols-3 mt-6">
                    {/* Property description */}


                    <div className="md:col-span-3 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                      {/* Total Beds */}
                      <div>
                        <label
                          htmlFor="beds"
                          className="text-sm font-medium  float-left text-[12px] font-[Montserrat]"
                        >
                          Total Beds
                        </label>
                        <input
                          type="number"
                          id="beds"
                          name="beds"
                          value={formData.beds}
                          className="border rounded-lg p-3 mt-1 w-full focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter Beds Count"
                          onChange={handleChange}
                        />
                      </div>

                      {/* Total bathrooms */}
                      <div>
                        <label
                          htmlFor="bathroom"
                          className="text-sm font-medium float-left text-[12px] font-[Montserrat]"
                        >
                          Total Bathroom
                        </label>
                        <input
                          type="text"
                          id="bathroom"
                          name="bathroom"
                          value={formData.bathroom}
                          className="border rounded-lg p-3 mt-1 w-full focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter Bathroom Count"
                          onChange={handleChange}
                        />
                      </div>

                      {/* Property SQFT */}
                      <div>
                        <label
                          htmlFor="sqrft"
                          className="text-sm font-medium float-left text-[12px] font-[Montserrat]"
                        >
                          Property SQFT
                        </label>
                        <input
                          type="text"
                          id="sqrft"
                          value={formData.sqrft}
                          name="sqrft"
                          className="border rounded-lg p-3 mt-1 w-full focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter Property SQFT"
                          onChange={handleChange}
                        />
                      </div>

                      {/* Property Rating */}
                      <div>
                        <label
                          htmlFor="rate"
                          className="text-sm font-medium float-left text-[12px] font-[Montserrat]"
                        >
                          Property Rating
                        </label>
                        <input
                          type="text"
                          id="rate"
                          value={formData.rate}
                          name="rate"
                          className="border rounded-lg p-3 mt-1 w-full focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter Property Rating"
                          onChange={handleChange}
                        />
                      </div>

                      {/* Property Type */}
                      <div className="sm:col-span-2 md:col-span-1">
                        <label
                          htmlFor="ptype"
                          className="text-sm font-medium float-left text-[12px] font-[Montserrat]"
                        >
                          Select Property Type
                        </label>
                        <select
                          name="ptype"
                          id="ptype"
                          value={formData.ptype}
                          className="mt-1 block w-full p-4 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                          onChange={handleChange}
                        >
                          <option value="">Select Property Type</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Latitude */}
                      <div>
                        <label
                          htmlFor="latitude"
                          className="text-sm font-medium float-left text-[12px] font-[Montserrat]"
                        >
                          Latitude
                        </label>
                        <input
                          type="text"
                          id="latitude"
                          value={formData.latitude}
                          name="latitude"
                          className="border rounded-lg p-3 mt-1 w-full focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter Latitude"
                          onChange={handleChange}
                        />
                      </div>

                      {/* Longitude */}
                      <div>
                        <label
                          htmlFor="longitude"
                          className="text-sm font-medium float-left te  xt-[12px] font-[Montserrat]"
                        >
                          Longitude
                        </label>
                        <input
                          type="text"
                          id="longitude"
                          value={formData.longtitude}
                          name="longtitude"
                          className="border rounded-lg p-3 mt-1 w-full focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter Longitude"
                          onChange={handleChange}
                        />
                      </div>

                      {/* Mobile Number */}
                      <div>
                        <label
                          htmlFor="mobile"
                          className="text-sm font-medium float-left text-[12px] font-[Montserrat]"
                        >
                          Mobile Number
                        </label>
                        <input
                          type="text"
                          id="mobile"
                          name="mobile"
                          value={formData.mobile}
                          className="border rounded-lg p-3 mt-1 w-full focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter Mobile Number"
                          onChange={handleChange}
                        />
                      </div>

                      {/* City, Country */}
                      <div>
                        <label
                          htmlFor="city"
                          className="text-sm font-medium float-left text-[12px] font-[Montserrat]"
                        >
                          City, Country
                        </label>
                        <input
                          type="text"
                          id="city"
                          value={formData.city}
                          name="city"
                          className="border rounded-lg p-3 mt-1 w-full focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Like New York, US"
                          onChange={handleChange}
                        />
                      </div>

                      {/* listing date */}
                      <div>
                        <label
                          htmlFor="listing_date"
                          className="text-sm font-medium float-left text-[12px] font-[Montserrat]"
                        >
                          Listing Date
                        </label>
                        <input
                          type="date"
                          id="listing_date"
                          value={formData.listing_date}
                          name="listing_date"
                          className="border rounded-lg p-3 mt-1 w-full focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Date"
                          onChange={handleChange}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label
                          htmlFor="description"
                          className="text-sm font-medium float-left text-[12px] font-[Montserrat]"
                        >
                          Property Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          className="border rounded-lg p-3 mt-1 w-full resize-none h-64 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter Property Description"
                          onChange={handleChange}
                        ></textarea>
                      </div>
                      <div className="md:col-span-1 mb-7">
                        <label
                          htmlFor="description"
                          className="text-sm font-medium float-left text-[12px] font-[Montserrat]"
                        >
                          Property Rules
                        </label>
                        <textarea
                          id="description"
                          name="rules"
                          value={formData.rules}
                          className="border rounded-lg p-3 mt-1 w-full resize-none h-64 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter Property Rules"
                          onChange={handleChange}
                        ></textarea>
                      </div>


                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-start mt-6 gap-3">
                    {/* <button
                      type="submit"
                      className=" py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-[150px] h-12 font-[Montserrat] font-bold"
                      style={{ borderRadius: "8px" }}
                    >
                      {" "}
                      Add Property{" "}
                    </button> */}
                    <button type="submit" className={`py-2 mt-6 float-start ${id ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg w-[150px] h-12 font-[Montserrat] font-bold`} style={{ borderRadius: '8px' }}   >
                      {id ? 'Update Property' : 'Add  Property'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PropertiesAdd;
