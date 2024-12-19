import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import SidebarMenu from '../components/SideBar';
import { GoArrowDown, GoArrowUp } from 'react-icons/go';
import axios from 'axios';
import PendingBookHeader from './PendingBookHeader';
import 'jspdf-autotable';
import OrderPreviewModal from './OrderPreviewModal';
import { handleSort } from '../utils/sorting';
import api from '../utils/api';

const CompletedBook = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [completed, setcompleted] = useState([]);
    const [filteredcompleted, setFilteredcompleted] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const status = 'Check_in'
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await api.get(`/bookings/status/${status}`, );
                setcompleted(response.data);
                setFilteredcompleted(response.data);
            } catch (error) {
                console.error('Error fetching bookings:', error.message);
            }
        };
        fetchBookings();
    }, []);
    // console.log(completed)
    // Search functionality
    const handleSearch = (event) => {
        const querySearch = event.target.value.toLowerCase();
        const filteredData = completed.filter(item =>
            Object.values(item).some(value =>
                typeof value === 'object' && value !== null
                    ? Object.values(value).some(nestedValue =>
                        String(nestedValue).toLowerCase().includes(querySearch)
                    )
                    : String(value).toLowerCase().includes(querySearch)
            )
        );
        setFilteredcompleted(filteredData);
        setCurrentPage(1);
    };

    const sortData = (key) => {
        handleSort(filteredcompleted, key, sortConfig, setSortConfig, setFilteredcompleted)
    };


    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentcompleted = filteredcompleted.slice(indexOfFirst, indexOfLast);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredcompleted.length / itemsPerPage);

    const openModal = (property) => {
        setSelectedProperty(property);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProperty(null);
    };

    const openModal2 = () => {
        setIsModalOpen2(true);
    };

    const closeModal2 = () => {
        setIsModalOpen2(false);
        setSelectedProperty(null);
    };


    return (
        <div>
            <div className="h-screen flex">

                <div className="flex flex-1 flex-col bg-[#f7fbff]">
                    <Header />
                    <PendingBookHeader onSearch={handleSearch} />
                    <div className="py-6 px-6 h-full w-[1000px] overflow-scroll scrollbar-none">
                        <div className="bg-white w-full rounded-xl border border-[#EAE5FF] py-4 px-3 overflow-x-auto scrollbar-none">
                            <div className="relative sm:rounded-lg">
                                <table className="min-w-full text-sm text-left text-gray-700">
                                    <thead className="bg-gray-50 text-xs uppercase font-medium text-gray-500">
                                        <tr>
                                            <th className="px-4 py-3 min-w-[130px]">
                                                Sr. No
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('slno')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('slno')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[180px]">
                                                Property Title
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('prop_title')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('prop_title')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[180px]">
                                                Property Image
                                            </th>
                                            <th className="px-4 py-3 min-w-[180px]">
                                                Property Price
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('prop_price')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('prop_price')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[250px]">
                                                Property Total Day
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('total_day')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('total_day')} />
                                                </div>
                                            </th>

                                            <th className="px-4 py-3 min-w-[150px]">
                                                Action
                                            </th>

                                </tr>
                                </thead>


                                    <tbody className="divide-y divide-gray-200">
                                        {currentcompleted.length > 0 ? (
                                            currentcompleted.map((completedList, index) => (
                                                <tr key={index + 1}>
                                                    <td className="px-4 py-3">{index + 1 + indexOfFirst}</td>
                                                    <td className="px-4 py-3">{completedList?.prop_title || 'N/A'}</td>
                                                    <td className="px-4 py-3">
                                                        {completedList.prop_img ? (
                                                            <img src={completedList.prop_img} className="w-16 h-16 object-cover rounded-full" alt="Coupon"
                                                                onError={(e) => {
                                                                    e.target.src = 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg';
                                                                }}
                                                            />
                                                        ) : (
                                                            <img src="https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg" className="w-16 h-16 object-cover rounded-full" alt="Placeholder" />
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">{completedList?.prop_price || 'N/A'}</td>
                                                    <td className="px-4 py-3">{completedList?.total_day || 'N/A'}</td>
                                                    <td className="px-4 py-3">
                                                        <span className='px-2 py-1 text-sm rounded-full bg-green-400 cursor-pointer text-white mr-2' onClick={() => openModal(completedList)}>View Details</span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td className="px-4 py-3 text-center" colSpan="6">
                                                    No data available
                                                </td>
                                            </tr>
                                        )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="bottom-0 left-0 w-full bg-[#f7fbff] py-4 flex justify-between items-center">
                            <span className="text-sm font-normal text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{indexOfFirst + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(indexOfLast, filteredcompleted.length)}</span> of <span className="font-semibold text-gray-900">{filteredcompleted.length}</span>
                            </span>
                            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                                <li>
                                    <button onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)} className={`previous-button ${filteredcompleted.length === 0 ? 'cursor-not-allowed' : ''}`}
                                        disabled={currentPage === 1 || filteredcompleted.length === 0}
                                        title={filteredcompleted.length === 0 ? 'No data available' : ''}
                                    >
                                        <img src="/image/action/Left Arrow.svg" alt="Left" /> Previous
                                    </button>
                                </li>
                                <li>
                                    <span className="current-page">
                                        Page {filteredcompleted.length > 0 ? currentPage : 0} of {filteredcompleted.length > 0 ? totalPages : 0}
                                    </span>
                                </li>
                                <li>
                                    <button onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                        className={`next-button ${filteredcompleted.length === 0 ? 'cursor-not-allowed' : ''}`}
                                        disabled={currentPage === totalPages || filteredcompleted.length === 0}
                                        title={filteredcompleted.length === 0 ? 'No data available' : ''}
                                    >
                                        Next <img src="/image/action/Right Arrow (1).svg" alt="Right" />
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <OrderPreviewModal isOpen={isModalOpen} closeModal={closeModal} />
                        {isModalOpen2 && (
                            <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                                <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
                                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                                        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                                            <div className="bg-white px-6 py-4">
                                                <h2 className="text-lg font-semibold text-gray-900" id="modal-title">Why Cancel?</h2>
                                                <button
                                                    type="button"
                                                    onClick={closeModal2}
                                                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                                                    aria-label="Close"
                                                    title='Close'
                                                >
                                                    &times;
                                                </button>
                                                <form onSubmit={(e) => { e.preventDefault(); }}>
                                                    <div className="mb-4">
                                                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Enter Reason:</label>
                                                        <input
                                                            type="text"
                                                            id="reason"
                                                            name="reason"
                                                            placeholder="Type your reason here"
                                                            className="mt-3 block w-full rounded-md  shadow-sm "

                                                        />
                                                    </div>
                                                    <div className="flex ">
                                                        <button
                                                            type="submit"
                                                            className=" rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                                                        >
                                                            Submit
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                <button
                                                    type="button"
                                                    onClick={closeModal2}
                                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompletedBook;