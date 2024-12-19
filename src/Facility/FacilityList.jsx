import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { GoArrowDown, GoArrowUp } from 'react-icons/go';
import { FaPen, FaTrash } from "react-icons/fa";
import FacilityHeader from './FacilityHeader';
import axios from 'axios';
import { useLoading } from '../Context/LoadingContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../common/Loader';
import { handleSort } from '../utils/sorting';
import { DeleteEntity } from '../utils/Delete';
import { NotificationContainer } from 'react-notifications';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";

import api from '../utils/api';


const FacilityList = () => {
    const navigate = useNavigate()
    const [facility, setfacility] = useState([]);
    const [filterData, setFilterData] = useState(facility);
    const [filteredfacility, setFilteredfacility] = useState(facility);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();
    const { isLoading, setIsLoading } = useLoading();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get("/facilities/all", );
                console.log("API Response:", response.data);
                setfacility(response.data);
                setFilterData(response.data);
                setFilteredfacility(response.data);
            } catch (error) {
                console.error("API Error:", error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        setIsLoading(true);

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [location, setIsLoading]);

    // for sorting
    const sortData = (key) => {
        handleSort(filteredfacility, key, sortConfig, setSortConfig, setFilteredfacility)
    };

    // Search functionality
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        const filteredData = facility.filter(feature =>
            Object.values(feature).some(value =>
                String(value).toLowerCase().includes(query)
            )
        );
        setFilteredfacility(filteredData);
        setCurrentPage(1);
    };

    // Calculate paginated facility
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentfacility = filteredfacility.slice(indexOfFirst, indexOfLast);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredfacility.length / itemsPerPage);

    const handledelete = async (id) => {
        const success = await DeleteEntity('Facility', id);
        if (success) {
            const updatedFacility = facility.filter((item) => item.id !== id);
            setfacility(updatedFacility);
            setFilterData(updatedFacility);
            setFilteredfacility(updatedFacility);
        }
    };

    // for update
    const updateFacility = (id) => {
        navigate('/create-facility', { state: { id: id } })
    }

    return (
        <div>
            {isLoading && <Loader />}
            <div className="h-screen flex">
                {/* Sidebar */}
                <div className="flex flex-1 flex-col bg-[#f7fbff]">
                    {/* Header */}
                    <Header />
                    {/* Searching, sorting, and main content area */}
                    <FacilityHeader onSearch={handleSearch} />
                    {/* Card */}
                    <div className="py-6 px-6 h-full w-[1000px] overflow-scroll scrollbar-none">
                        <div className="bg-white w-full rounded-xl border border-[#EAE5FF] py-4 px-3 overflow-x-auto scrollbar-none">
                            <div className="relative sm:rounded-lg">
                                <table className="min-w-full text-sm text-left text-gray-700">
                                    <thead className="bg-gray-50 text-xs uppercase font-medium text-gray-500">
                                        <tr>
                                            <th className="px-4 py-3 min-w-[100px]">
                                                Sr. No
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => sortData('slno')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => sortData('slno')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[150px]">
                                                Facility Title
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => sortData('title')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => sortData('title')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[150px]">
                                                Facility Image
                                            </th>

                                            <th className="px-4 py-3 min-w-[100px]">
                                                Facility Status
                                            </th>
                                            <th className="px-4 py-3 min-w-[100px]">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {currentfacility.length > 0 ? (
                                            currentfacility.map((facility, index) => (

                                                <tr key={facility.id}>
                                                    <td className="px-4 py-3">{index + 1 + indexOfFirst}</td>
                                                    <td className="px-4 py-3">{facility?.title || "N/A"}</td>
                                                    <td className="px-4 py-3">
                                                        {facility.img && facility.img.trim() !== '' ? (
                                                            <img src={facility.img} className="w-16 h-16 object-cover rounded-full" height={50} width={50} loading="lazy" alt="" onError={(e) => {
                                                                if (e.target.src !== 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg') {
                                                                    e.target.src = 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg';
                                                                }
                                                            }} />
                                                        ) : (
                                                            <img src={'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'} height={50} width={50} loading="lazy" alt="" />
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-3">
                                                    {facility.status === 1 ? 
                                                        <FontAwesomeIcon className='h-7 w-16 ' style={{color:'#0064DC'}} icon={faToggleOn} /> 
                                                        : 
                                                        <FontAwesomeIcon className='h-7 w-16' style={{color:'#e9ecef'}} icon={faToggleOff} />
                                                    }
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <NotificationContainer />
                                                        <button className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition mr-2" onClick={() => { updateFacility(facility.id) }}>
                                                            <FaPen />
                                                        </button>
                                                        <button className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition" onClick={() => handledelete(facility.id)}>
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))

                                        ) : (
                                            <tr>
                                                <td colSpan="10" className="text-center">
                                                    No data available
                                                </td>
                                            </tr>
                                        )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* for pagination */}
                        <div className="bottom-0 left-0 w-full bg-[#f7fbff] py-4 flex justify-between items-center">
                            <span className="text-sm font-normal text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{indexOfFirst + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(indexOfLast, filteredfacility.length)}</span> of <span className="font-semibold text-gray-900">{filteredfacility.length}</span>
                            </span>
                            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                                <li>
                                    <button
                                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                        className={`previous-button ${filteredfacility.length === 0 ? 'cursor-not-allowed' : ''}`}
                                        disabled={currentPage === 1 || filteredfacility.length === 0}
                                        title={filteredfacility.length === 0 ? 'No data available' : ''}
                                    >
                                        <img src="/image/action/Left Arrow.svg" alt="Left" /> Previous
                                    </button>
                                </li>
                                <li>
                                    <span className="current-page">
                                        Page {filteredfacility.length > 0 ? currentPage : 0} of {filteredfacility.length > 0 ? totalPages : 0}
                                    </span>
                                </li>
                                <li>
                                    <button
                                        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                        className={`next-button ${filteredfacility.length === 0 ? 'cursor-not-allowed' : ''}`}
                                        disabled={currentPage === totalPages || filteredfacility.length === 0}
                                        title={filteredfacility.length === 0 ? 'No data available' : ''}
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

export default FacilityList;