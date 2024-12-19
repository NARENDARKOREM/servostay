import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { GoArrowDown, GoArrowUp } from 'react-icons/go';
import { FaPen, FaTrash } from "react-icons/fa";
import PaymentGatewayHeader from './PaymentGatewayHeader';
import axios from 'axios';
import { useLoading } from '../Context/LoadingContext';
import { useLocation } from 'react-router-dom';
import Loader from '../common/Loader';
import { handleSort } from '../utils/sorting';
import { DeleteEntity } from '../utils/Delete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { NotificationContainer } from 'react-notifications';
import api from '../utils/api';

const PaymentGatewayList = () => {
    const [paymentGateway, setpaymentGateway] = useState([]);
    const [filteredpaymentGateway, setFilteredpaymentGateway] = useState(paymentGateway);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const location = useLocation();
    const { isLoading, setIsLoading } = useLoading();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get("/payment-methods/", );
                console.log("API Response:", response.data);
                setpaymentGateway(response.data);
                setFilteredpaymentGateway(response.data);
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
        const searchQuery = event.target.value.toLowerCase();
        const filteredResults = paymentGateway.filter(gateway =>
            Object.values(gateway).some(value =>
                String(value).toLocaleLowerCase().includes(searchQuery)
            )
        );
        setFilteredpaymentGateway(filteredResults);
        setCurrentPage(1);
    };


    // for sorting
    const sortData = (key) => {
        handleSort(filteredpaymentGateway, key, sortConfig, setSortConfig, setFilteredpaymentGateway);
    };

    // Calculate paginated paymentGateway
    const indexOfLastpaymentgatway = currentPage * itemsPerPage;
    const indexOfFirstpaymentgatway = indexOfLastpaymentgatway - itemsPerPage;
    const currentpaymentGateway = filteredpaymentGateway.slice(indexOfFirstpaymentgatway, indexOfLastpaymentgatway);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredpaymentGateway.length / itemsPerPage);


    // for delete
    const handledelete = async (id) => {
        const success = await DeleteEntity('PaymentGateWay', id);
        if (success) {
            const updatedPaymentGateWay = paymentGateway.filter((item) => paymentGateway.id !== id);
            setpaymentGateway(updatedPaymentGateWay);
            setFilteredpaymentGateway(updatedPaymentGateWay)
        }
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
                    <PaymentGatewayHeader onSearch={handleSearch} />
                    {/* Card */}
                    <div className="py-6 px-6 h-full w-[1000px] overflow-scroll scrollbar-none">
                        <div className="bg-white w-full rounded-xl border border-[#EAE5FF] py-4 px-3 overflow-x-auto scrollbar-none">
                            <div className="relative sm:rounded-lg">
                                <table className="min-w-full text-sm text-left text-gray-700">
                                    <thead className="bg-gray-50 text-xs uppercase font-medium text-gray-500">
                                        <tr>
                                            <th className="px-4 py-3 min-w-[120px]">
                                                Sr. No
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => sortData('id')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => sortData('id')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[250px]">
                                                PaymentGateway Name
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => sortData('title')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => sortData('title')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[250px]">
                                                PaymentGateway SubTitle
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => sortData('subtitle')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => sortData('subtitle')} />
                                                </div>
                                            </th>

                                            <th className="px-4 py-1 min-w-[220px]">  PaymentGateway Image  </th>
                                            <th className="px-4 py-1 min-w-[220px]">  Show On Wallet  </th>
                                            <th className="px-4 py-1 min-w-[200px]">  Show On Subscribe  </th>
                                            <th className="px-4 py-1 min-w-[220px]">  PaymentGateway Status </th>
                                            <th className="px-4 py-1 min-w-[150px]"> Action </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {currentpaymentGateway.length > 0 ? (
                                            currentpaymentGateway.map((paymentgatway, index) => (

                                                <tr key={paymentgatway.id}>
                                                    <td className="px-4 py-1">{index + 1 + indexOfFirstpaymentgatway}</td>
                                                    <td className="px-4 py-1">{paymentgatway?.title || "N/A"}</td>
                                                    <td className="px-4 py-1">{paymentgatway?.subtitle || "N/A"}</td>
                                                    <td className="px-4 py-1">
                                                        {paymentgatway.img && paymentgatway.img.trim() !== '' ? (
                                                            <img src={paymentgatway.img} className="w-16 h-16 object-cover rounded-full" height={50} width={50} loading="lazy" alt="" onError={(e) => {
                                                                if (e.target.src !== 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg') {
                                                                    e.target.src = 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg';
                                                                }
                                                            }} />
                                                        ) : (
                                                            <img src={'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'} height={50} width={50} loading="lazy" alt="" />
                                                        )}
                                                    </td>
                                                    <td className={` px-4 py-1 `}>
                                                        {paymentgatway.status === 1 ?
                                                            <FontAwesomeIcon className='h-7 w-16 ' style={{ color: '#0064DC' }} icon={faToggleOn} />
                                                            :
                                                            <FontAwesomeIcon className='h-7 w-16' style={{ color: '#e9ecef' }} icon={faToggleOff} />
                                                        }
                                                    </td>
                                                    <td className="px-4 py-1">
                                                        {paymentgatway.status === 1 ?
                                                            <FontAwesomeIcon className='h-7 w-16 ' style={{ color: '#0064DC' }} icon={faToggleOn} />
                                                            :
                                                            <FontAwesomeIcon className='h-7 w-16' style={{ color: '#e9ecef' }} icon={faToggleOff} />
                                                        }
                                                    </td>
                                                    <td className="px-4 py-1">
                                                        {paymentgatway.s_show === 1 ?
                                                            <FontAwesomeIcon className='h-7 w-16 ' style={{ color: '#0064DC' }} icon={faToggleOn} />
                                                            :
                                                            <FontAwesomeIcon className='h-7 w-16' style={{ color: '#e9ecef' }} icon={faToggleOff} />
                                                        }
                                                    </td>

                                                    <td className="px-4 py-1">
                                                        <NotificationContainer />
                                                        <button className="bg-[#2dce89] text-white p-2 rounded-full hover:bg-green-600 transition mr-2">
                                                            <FaPen />
                                                        </button>
                                                        <button className="bg-[#f5365c] text-white p-2 rounded-full hover:bg-red-600 transition " onClick={() => { handledelete(paymentgatway.id) }}>
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))

                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-3 text-center">No data available </td>
                                            </tr>
                                        )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="bottom-0 left-0 w-full bg-[#f7fbff] py-4 flex justify-between items-center">
                            <span className="text-sm font-normal text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{indexOfFirstpaymentgatway + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(indexOfLastpaymentgatway, filteredpaymentGateway.length)}</span> of <span className="font-semibold text-gray-900">{filteredpaymentGateway.length}</span>
                            </span>
                            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                                <li>
                                    <button
                                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                        className={`previous-button ${filteredpaymentGateway.length === 0 ? 'cursor-not-allowed' : ''}`}
                                        disabled={currentPage === 1 || filteredpaymentGateway.length === 0}
                                        title={filteredpaymentGateway.length === 0 ? 'No data available' : ''}
                                    >
                                        <img src="/image/action/Left Arrow.svg" alt="Left" /> Previous
                                    </button>
                                </li>
                                <li>
                                    <span className="current-page">
                                        Page {filteredpaymentGateway.length > 0 ? currentPage : 0} of {filteredpaymentGateway.length > 0 ? totalPages : 0}
                                    </span>
                                </li>
                                <li>
                                    <button
                                        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                        className={`next-button ${filteredpaymentGateway.length === 0 ? 'cursor-not-allowed' : ''}`}
                                        disabled={currentPage === totalPages || filteredpaymentGateway.length === 0}
                                        title={filteredpaymentGateway.length === 0 ? 'No data available' : ''}
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

export default PaymentGatewayList;