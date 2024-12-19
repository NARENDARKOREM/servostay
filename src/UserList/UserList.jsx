import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import { GoArrowDown, GoArrowUp } from 'react-icons/go';
import { FaPen, FaTrash } from "react-icons/fa";
import { searchFunction } from '../Entity/SearchEntity';
import axios from 'axios';
import UseListHeader from './UseListHeader';
import { handleSort } from '../utils/sorting';
import { DeleteEntity } from '../utils/Delete';
import { useLoading } from '../Context/LoadingContext';
import Loader from '../common/Loader';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import api from '../utils/api';

const UserList = () => {
    const hasFetched = useRef(false);
    const [user, setuser] = useState([]);
    const [filtereduser, setFiltereduser] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const { isLoading, setIsLoading } = useLoading();

    useEffect(() => {
        setIsLoading(true);

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [setIsLoading]);


    useEffect(() => {
        async function userlist() {
            try {
                const response = await api.get("/users/user/getalluser");
                console.log(response.data);
                setuser(response.data);
                setFiltereduser(response.data);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        }

        userlist();
    }, []);


    // Search functionality
    const handleSearch = (event) => {
        const querySearch = event.target.value.toLowerCase();
        const filteredData = user.filter(item =>
            Object.values(item).some(value =>
                typeof value === 'object' && value !== null
                    ? Object.values(value).some(nestedValue =>
                        String(nestedValue).toLowerCase().includes(querySearch)
                    )
                    : String(value).toLowerCase().includes(querySearch)
            )
        );
        setFiltereduser(filteredData);
        setCurrentPage(1);
    };

    const sortData = (key) => {
        handleSort(filtereduser, key, sortConfig, setSortConfig, setFiltereduser)
    };

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentuser = filtereduser.slice(indexOfFirst, indexOfLast);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filtereduser.length / itemsPerPage);

    // for delete
    const handledelete = async (id) => {

        try {
            const success = await DeleteEntity('UserList', id);

            if (success) {
                setuser((prevUserList) => {
                    const updatedUserList = prevUserList.filter((user) => user.id !== id);
                    setFiltereduser(updatedUserList); // Update filtered users
                    return updatedUserList;
                });
            } else {
                console.error("Failed to delete the user.");
            }
        } catch (error) {
            console.error("Error while deleting user:", error);

        }
    };

    const handleToggleChange = async (id, field, currentValue) => {
        const newValue = currentValue === 1 ? 0 : 1;

        try {
            const response = await axios.put(`http://localhost:5000/users/user/toggle-update`, {
                id,
                field,
                value: newValue, // Ensure this matches the backend
            });

            if (response.status === 200) {
                // Update state
                setuser((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === id ? { ...user, [field]: newValue } : user
                    )
                );

                setFiltereduser((prevFilteredUsers) =>
                    prevFilteredUsers.map((user) =>
                        user.id === id ? { ...user, [field]: newValue } : user
                    )
                );

                NotificationManager.success('Status updated successfully!');
            } else {
                NotificationManager.error('Failed to update status.');
            }
        } catch (error) {
            console.error('Error updating toggle:', error);
            NotificationManager.error('Error updating toggle.');
        }
    };

    return (
        <div>
            {isLoading && <Loader />}
            <div className="h-screen flex">
                <div className="flex flex-1 flex-col bg-[#f7fbff]">
                    <Header />
                    <UseListHeader onSearch={handleSearch} />
                    <div className="py-6 px-6 h-full w-[1000px] overflow-scroll scrollbar-none">
                        <div className="bg-white w-full rounded-xl border border-[#EAE5FF] py-4 px-3 overflow-x-auto">
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
                                            <th className="px-4 py-3 min-w-[150px]">
                                                Name
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('name')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('name')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[150px]">
                                                Email
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('email')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('email')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[150px]">
                                                Mobile
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('mobile')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('mobile')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[150px]">
                                                Join Date
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('start_date')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('start_date')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[150px]">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 min-w-[150px]">
                                                Refer Code
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('refercode')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('refercode')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[180px]">
                                                Parent Code
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('parentcode')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('parentcode')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[150px]">
                                                Wallet
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('wallet')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('wallet')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[180px]">
                                                IsSubscribe
                                            </th>
                                            <th className="px-4 py-3 min-w-[180px]">
                                                Package  Name
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('pack_id')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('pack_id')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[180px]">
                                                Start Date
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('start_date')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('start_date')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[180px]">
                                                Expired Date
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('end_date')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('end_date')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[150px]">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {currentuser.length > 0 ? (
                                            currentuser.map((userList, index) => (

                                                <tr key={userList.id}>
                                                    <td className="px-4 py-2">{index + 1 + indexOfFirst}</td>
                                                    <td className="px-4 py-2">{userList?.name || "N/A"}</td>
                                                    <td className="px-4 py-2">{userList?.email || "N/A"}</td>
                                                    <td className="px-4 py-2">{userList?.mobile || "N/A"}</td>
                                                    <td className="px-4 py-2">{userList?.reg_date.split("T")[0] || "N/A"}</td>
                                                    {/* <td className="px-4 py-2">
                                                    {userList.status === 1 ? 
                                                        <FontAwesomeIcon className='h-7 w-16 ' style={{color:'#0064DC'}} icon={faToggleOn} /> 
                                                        : 
                                                        <FontAwesomeIcon className='h-7 w-16' style={{color:'#e9ecef'}} icon={faToggleOff} />
                                                    }

                                                </td> */}
                                                    <td className="px-4 py-2">
                                                        <FontAwesomeIcon
                                                            className="h-7 w-16"
                                                            style={{ color: userList.status === 1 ? '#0064DC' : '#e9ecef' }}
                                                            icon={userList.status === 1 ? faToggleOn : faToggleOff}
                                                            onClick={() => handleToggleChange(userList.id, 'status', userList.status)}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2">{userList?.refercode || "N/A"}</td>
                                                    <td className="px-4 py-2">{userList?.parentcode || "N/A"}</td>
                                                    <td className="px-4 py-2">{userList?.wallet || "N/A"}</td>
                                                    {/* <td className="px-4 py-2">
                                                        {userList.is_subscribe === 1 ?
                                                            <FontAwesomeIcon className='h-7 w-16 ' style={{ color: '#0064DC' }} icon={faToggleOn} /> : <FontAwesomeIcon className='h-7 w-16' style={{ color: '#e9ecef' }} icon={faToggleOff} />
                                                        }
                                                    </td> */}
                                                    <td className="px-4 py-2">
                                                        <FontAwesomeIcon
                                                            className="h-7 w-16"
                                                            style={{ color: userList.is_subscribe === 1 ? '#0064DC' : '#e9ecef' }}
                                                            icon={userList.is_subscribe === 1 ? faToggleOn : faToggleOff}
                                                            onClick={() => handleToggleChange(userList.id, 'is_subscribe', userList.is_subscribe)}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2">{userList?.pack_id || "N/A"}</td>
                                                    <td className="px-4 py-2">{userList?.start_date || "N/A"}</td>
                                                    <td className="px-4 py-2">{userList?.end_date || "N/A"}</td>
                                                    <td className="px-4 py-2">
                                                        <button className="bg-[#2dce89] text-white p-2 rounded-full hover:bg-green-600 transition mr-2">
                                                            <FaPen />
                                                        </button>
                                                        <NotificationContainer />
                                                        <button className="bg-[#f5365c] text-white p-2 rounded-full hover:bg-red-600 transition" onClick={() => { handledelete(userList.id) }}>
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
                                Showing <span className="font-semibold text-gray-900">{indexOfFirst + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(indexOfLast, filtereduser.length)}</span> of <span className="font-semibold text-gray-900">{filtereduser.length}</span>
                            </span>
                            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                                <li>
                                    <button
                                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                        className={`previous-button ${filtereduser.length === 0 ? 'cursor-not-allowed' : ''}`}
                                        disabled={currentPage === 1 || filtereduser.length === 0}
                                        title={filtereduser.length === 0 ? 'No data available' : ''}
                                    >
                                        <img src="/image/action/Left Arrow.svg" alt="Left" /> Previous
                                    </button>
                                </li>
                                <li>
                                    <span className="current-page">
                                        Page {filtereduser.length > 0 ? currentPage : 0} of {filtereduser.length > 0 ? totalPages : 0}
                                    </span>
                                </li>
                                <li>
                                    <button
                                        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                        className={`next-button ${filtereduser.length === 0 ? 'cursor-not-allowed' : ''}`}
                                        disabled={currentPage === totalPages || filtereduser.length === 0}
                                        title={filtereduser.length === 0 ? 'No data available' : ''}
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

export default UserList;
