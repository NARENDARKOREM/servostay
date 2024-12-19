import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { GoArrowDown, GoArrowUp } from 'react-icons/go';
import { useLoading } from '../Context/LoadingContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../common/Loader';
import { FaPen, FaTrash } from "react-icons/fa";
import CupponHeader from './CupponHeader';
import { DeleteEntity } from '../utils/Delete';
import axios from 'axios';
import { handleSort } from '../utils/sorting';
import { NotificationContainer } from 'react-notifications';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";

import api from '../utils/api';


const CupponList = () => {
    const navigate = useNavigate();
    const [cuppons, setcuppons] = useState([]);
    const [filteredcuppons, setFilteredcuppons] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const location = useLocation();
    const { isLoading, setIsLoading } = useLoading();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get("/coupons/all",{
                    withCredentials: true, 
                } );
                console.log("API Response:", response.data);
                setcuppons(response.data);
                setFilteredcuppons(response.data);
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

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        const filteredData = cuppons.filter(coppon =>
            Object.values(coppon).some(value =>
                String(value).toLocaleLowerCase().includes(query)
            )
        )
        setFilteredcuppons(filteredData)
        setCurrentPage(1)
    }

    // Handle sorting
    const sortData = (key) => {
        handleSort(filteredcuppons, key, sortConfig, setSortConfig, setFilteredcuppons)
    };

    // Pagination logic
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentcuppons = filteredcuppons.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredcuppons.length / itemsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // for dalete
    const handledelete = async (id) => {
        const success = await DeleteEntity('Cuppon', id)
        if (success) {
            const updatedCuppon = cuppons.filter((cuppons) => cuppons.id !== id);
            setcuppons(updatedCuppon);
            setFilteredcuppons(updatedCuppon)
        }
    }

    // for update
    const updateCuppon = (id) => {
        navigate('/add-cuppon', { state: { id: id } })
    }

    return (
        <div>
            {isLoading && <Loader />}
            <div className="h-screen flex">
                {/* Sidebar */}
                <div className="flex flex-1 flex-col bg-[#f7fbff]">
                    {/* Header */}
                    <Header />
                    <CupponHeader onSearch={handleSearch} />
                    {/* Main Content */}
                    <div className="py-6 px-6 h-full w-[1000px] overflow-scroll scrollbar-none">
                        <div className="bg-white w-full rounded-xl border border-[#EAE5FF] py-4 px-3 overflow-x-auto scrollbar-none">
                            <div className="relative sm:rounded-lg">
                                <table className="min-w-full text-sm text-left text-gray-700">
                                    <thead className="bg-gray-50 text-xs uppercase font-medium text-gray-500">
                                        <tr>
                                            {['slno', 'title', 'subtitle', 'code', 'image', 'expiredDate', 'minAmount', 'discount', 'status'].map((key) => (
                                                <th key={key} className="px-4 py-3 min-w-[150px]">
                                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                                    <div className="inline-flex items-center ml-2">
                                                        <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => sortData(key)} />
                                                        <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => sortData(key)} />
                                                    </div>
                                                </th>
                                            ))}
                                            <th className="px-4 py-3 min-w-[150px]">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {currentcuppons.length > 0 ? (
                                            currentcuppons.map((cuppon, index) => (
                                                <tr key={cuppon.id}>
                                                    <td className="px-4 py-3">{index + 1 + indexOfFirst}</td>
                                                    <td className="px-4 py-3">{cuppon?.ctitle || "N/A"}</td>
                                                    <td className="px-4 py-3">{cuppon?.subtitle || "N/A"}</td>
                                                    <td className="px-4 py-3">{cuppon?.c_title || "N/A"}</td>
                                                    <td className="px-4 py-3">
                                                        {cuppon.c_img ? (
                                                            <img src={cuppon.c_img} className="w-16 h-16 object-cover rounded-full" alt="Coupon"
                                                                onError={(e) => { e.target.src = 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'; }}
                                                            />
                                                        ) : (
                                                            <img src="https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg" className="w-16 h-16 object-cover rounded-full" alt="Placeholder" />
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">{cuppon?.cdate.split(" ")[0] || "N/A"}</td>
                                                    <td className="px-4 py-3">{cuppon?.min_amt || "N/A"}</td>
                                                    <td className="px-4 py-3">{cuppon?.c_value || "N/A"}</td>
                                                    <td className="px-4 py-3">
                                                        {cuppon.status === 1 ? 
                                                            <FontAwesomeIcon className='h-7 w-16 ' style={{color:'#0064DC'}} icon={faToggleOn} /> 
                                                            : 
                                                            <FontAwesomeIcon className='h-7 w-16' style={{color:'#e9ecef'}} icon={faToggleOff} />
                                                        }
                                                    </td>
                                                    <td className="px-4 py-3">

                                                        <NotificationContainer />
                                                        <button className="bg-[#2dce89] text-white p-2 rounded-full hover:bg-green-600 transition mr-2" onClick={()=>{updateCuppon(cuppon.id)}}>
                                                            <FaPen />
                                                        </button>
                                                        <button className="bg-[#f5365c] text-white p-2 rounded-full hover:bg-red-600 transition" onClick={()=>{handledelete(cuppon.id)}}>
                                                        <FaTrash />
                                                    </button>

                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="10" className="text-center">
                                                    Coupon not found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        <div className="bottom-0 left-0 w-full bg-[#f7fbff] py-4 flex justify-between items-center">
                            <span className="text-sm font-normal text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{indexOfFirst + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(indexOfLast, filteredcuppons.length)}</span> of <span className="font-semibold text-gray-900">{filteredcuppons.length}</span>
                            </span>
                            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                                <li>
                                    <button
                                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                        className={`previous-button ${filteredcuppons.length === 0 ? 'cursor-not-allowed' : ''}`}
                                        disabled={currentPage === 1 || filteredcuppons.length === 0}
                                        title={filteredcuppons.length === 0 ? 'No data available' : ''}
                                    >
                                        <img src="/image/action/Left Arrow.svg" alt="Left" /> Previous
                                    </button>
                                </li>
                                <li>
                                    <span className="current-page">
                                        Page {filteredcuppons.length > 0 ? currentPage : 0} of {filteredcuppons.length > 0 ? totalPages : 0}
                                    </span>
                                </li>
                                <li>
                                    <button
                                        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                        className={`next-button ${filteredcuppons.length === 0 ? 'cursor-not-allowed' : ''}`}
                                        disabled={currentPage === totalPages || filteredcuppons.length === 0}
                                        title={filteredcuppons.length === 0 ? 'No data available' : ''}
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

export default CupponList;
