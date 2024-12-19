import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { GoArrowDown, GoArrowUp } from 'react-icons/go';
import { FaPen, FaTrash } from "react-icons/fa";
import PropotiesHeader from './PropotiesHeader';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DeleteEntity } from '../utils/Delete';
import { NotificationContainer } from 'react-notifications';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";

import api from '../utils/api';


const PropotiesList = () => {
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await api.get('/properties' );
                console.log(response.data);
                setProperties(response.data);
                setFilteredProperties(response.data);
            } catch (error) {
                console.error('Error fetching properties:', error.response ? error.response.data : error.message);
            }
        };
        fetchProperties();
    }, []);

    // Search functionality
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        const filteredData = properties.filter(property =>
            Object.values(property).some(value =>
                typeof value === 'object' && value !== null
                    ? Object.values(value).some(nestedValue =>
                        String(nestedValue).toLowerCase().includes(query)
                    )
                    : String(value).toLowerCase().includes(query)
            )
        );
        setFilteredProperties(filteredData);
        setCurrentPage(1);
    };

    // Sorting functionality
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        const sortedData = [...filteredProperties].sort((a, b) => {
            if (key === 'id' || key === 'totalProperties') {
                return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
            }
            return a[key] < b[key]
                ? direction === 'asc' ? -1 : 1
                : direction === 'asc' ? 1 : -1;
        });

        setFilteredProperties(sortedData);
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const propertyUpdate = (id) => {
        navigate("/create-property", { state: { id: id } })
    }

    const deleteProperty = async (id) => {
        const success = await DeleteEntity('Property', id);
        if (success) {
            const updatedProperties = properties.filter((property) => property.id !== id);
            setProperties(updatedProperties);
            setFilteredProperties(updatedProperties)
        }
    }

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProperties = filteredProperties.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <div className="h-screen flex">
                {/* Sidebar */}


                <div className="flex flex-1 flex-col bg-[#f7fbff]">
                    {/* Header */}
                    <Header />
                    {/* Searching, sorting, and main content area */}
                    <PropotiesHeader onSearch={handleSearch} />
                    {/* Card */}
                    <div className="py-6 px-6 h-full w-[1000px] overflow-scroll scrollbar-none">
                        <div className="bg-white w-full rounded-xl border border-[#EAE5FF] py-4 px-3 overflow-x-auto">
                            <div className="relative sm:rounded-lg">
                                <table className="min-w-full text-sm text-left text-gray-700">
                                    <thead className="bg-gray-50 text-xs uppercase font-medium text-gray-500">
                                        <tr>
                                            <th className="px-2 py-3 min-w-[120px]">
                                                Sr. No
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('slno')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('slno')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[190px]">
                                                Property Image
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('image')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('image')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[190px]">
                                                property Tittle
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyTittle')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyTittle')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[190px]">
                                                property Type
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyType')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyType')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[200px]">
                                                Description
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyDescription')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyDescription')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[200px]">
                                                Address
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyAddress')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyAddress')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[150px]">
                                                City
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('city')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('city')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[180px]">
                                                Listing Date
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('listing_date')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('listing_date')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[130px]">
                                                Is_Sell
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('is_sell')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('is_sell')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[150px]">
                                                Factility
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyFacility')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyFacility')} />
                                                </div>
                                            </th>

                                            <th className="px-4 py-3 min-w-[230px]">
                                                Property Price(/Night)
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyPrice')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyPrice')} />
                                                </div>
                                            </th>

                                            <th className="px-4 py-3 min-w-[130px]">
                                                Mobile
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('mobile')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('mobile')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[150px]">
                                                Conutry
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('country_id')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('country_id')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[180px]">
                                                Add_User_Id
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('user_id')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('user_id')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[150px]">
                                                Total Beds
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('totalBeds')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('totalBeds')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[200px]">
                                                Total BathRooms
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('totalBathrooms')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('totalBathrooms')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[180px]">
                                                total SQFT.
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('totalSQFT')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('totalSQFT')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[150px]">
                                                Rating
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('rating')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('rating')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[100px]">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 min-w-[150px]">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {currentProperties.length > 0 ? (
                                            currentProperties.map((property, index) => (
                                                <tr key={property.id}>
                                                    <td className="px-4 py-3">{index + 1 + indexOfFirstItem}</td>
                                                    <td className="px-4 py-3">
                                                        {property.image && property.image.trim() !== '' ? (
                                                            <img src={property.image} className="w-16 h-16 object-cover rounded-full" height={50} width={50} loading="lazy" alt="" onError={(e) => {
                                                                if (e.target.src !== 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg') {
                                                                    e.target.src = 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg';
                                                                }
                                                            }} />
                                                        ) : (
                                                            <img src={'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'} height={50} width={50} loading="lazy" alt="" />
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">{property.title || 'N/A'}</td>
                                                    <td className="px-4 py-3">{property.category?.title || 'N/A'}</td>
                                                    <td className="px-4 py-3">{property?.description || 'N/A'}</td>
                                                    <td className="px-4 py-3">{property?.address || 'N/A'}</td>
                                                    <td className="px-4 py-3">{property?.city || 'N/A'}</td>
                                                    <td className="px-4 py-3">{property?.listing_date || 'N/A'}</td>
                                                    <td className="px-4 py-3">{property?.is_sell || 'N/A'}</td>
                                                    <td className="px-4 py-3 flex flex-col">
                                                        {property.facilities?.map((item) => (
                                                            <span className='bg-lime-100 font-bold p-1 m-1 flex justify-center' key={item.id}>
                                                                {item.title}
                                                            </span>
                                                        )) || 'N/A'}
                                                    </td>
                                                    <td className="px-4 py-3">₹{property?.price || 'N/A'}</td>
                                                    <td className="px-4 py-3">{property?.mobile || 'N/A'}</td>
                                                    <td className="px-4 py-3">{property.country?.title || 'N/A'}</td>
                                                    <td className="px-4 py-3">{property?.add_user_id || 'N/A'}</td>
                                                    <td className="px-4 py-3">{property?.beds || 'N/A'}</td>
                                                    <td className="px-4 py-3">{property?.bathroom || 'N/A'}</td>
                                                    <td className="px-4 py-3">{property?.sqrft || 'N/A'}</td>
                                                    <td className="px-4 py-3">{property?.rate || 'N/A'}</td>
                                                    <td className="px-4 py-3">
                                                    {property.status === 1 ? 
                                                        <FontAwesomeIcon className='h-7 w-16 ' style={{color:'#0064DC'}} icon={faToggleOn} /> 
                                                        : 
                                                        <FontAwesomeIcon className='h-7 w-16' style={{color:'#e9ecef'}} icon={faToggleOff} />
                                                    }
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <NotificationContainer />
                                                        <button className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition mr-2" onClick={() => propertyUpdate(property.id)}>
                                                            <FaPen />
                                                        </button>
                                                        <button className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition" onClick={() => deleteProperty(property.id)}>
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="20" className="text-center py-4">
                                                    No properties found.

                                                </td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table>
                            </div>
                        </div>
                        <div className="bottom-0 left-0 w-full bg-[#f7fbff] py-4 flex justify-between items-center">
                            <span className="text-sm font-normal text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{indexOfFirstItem + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(indexOfLastItem, filteredProperties.length)}</span> of <span className="font-semibold text-gray-900">{filteredProperties.length}</span>
                            </span>
                            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                                <li>
                                    <button
                                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                        className={`previous-button ${filteredProperties.length === 0 ? 'cursor-not-allowed' : ''}`}
                                        disabled={currentPage === 1 || filteredProperties.length === 0}
                                        title={filteredProperties.length === 0 ? 'No data available' : ''}
                                    >
                                        <img src="/image/action/Left Arrow.svg" alt="Left" /> Previous
                                    </button>
                                </li>
                                <li>
                                    <span className="current-page">
                                        Page {filteredProperties.length > 0 ? currentPage : 0} of {filteredProperties.length > 0 ? totalPages : 0}
                                    </span>
                                </li>
                                <li>
                                    <button
                                        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                        className={`next-button ${filteredProperties.length === 0 ? 'cursor-not-allowed' : ''}`}
                                        disabled={currentPage === totalPages || filteredProperties.length === 0}
                                        title={filteredProperties.length === 0 ? 'No data available' : ''}
                                    >
                                        Next <img src="/image/action/Right Arrow (1).svg" alt="Right" />
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropotiesList;