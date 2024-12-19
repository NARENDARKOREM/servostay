import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { GoArrowDown, GoArrowUp } from 'react-icons/go';
import { FaPen, FaTrash } from "react-icons/fa";
import { searchFunction } from '../Entity/SearchEntity';
import axios from 'axios';
import { DeleteEntity } from '../utils/Delete';
import { useNavigate } from 'react-router-dom';
import { handleSort } from '../utils/sorting';
import RoleHeader from './RoleHeader';
import api from '../utils/api';

const RoleChange = () => {
    const navigate = useNavigate();
    const [role, setrole] = useState([]);
    const [filteredrole, setFilteredrole] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchrole();
    }, []);



    // Search functionality
    const handleSearch = (event) => {
        const querySearch = event.target.value.toLowerCase();
        const filteredData = role.filter(item =>
            Object.values(item).some(value =>
                typeof value === 'object' && value !== null
                    ? Object.values(value).some(nestedValue =>
                        String(nestedValue).toLowerCase().includes(querySearch)
                    )
                    : String(value).toLowerCase().includes(querySearch)
            )
        );
        setFilteredrole(filteredData);
        setCurrentPage(1);
    };

  const fetchrole = async () => {
      try {
          const response = await api.get("/rollrequest/all");
          console.log(response.data)
          setrole(response.data);
          setFilteredrole(response.data); 
      } catch (error) {
          console.error("Error fetching role:", error);
      }
  };


    // for sorting
    const sortData = (key) => {
        handleSort(filteredrole, key, sortConfig, setSortConfig, setFilteredrole);
    };

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentrole = filteredrole.slice(indexOfFirst, indexOfLast);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredrole.length / itemsPerPage);

    const handledelete = async (id) => {
        const success = await DeleteEntity("Role", id);
        if (success) {
            const updatedrole = role.filter((country) => country.id !== id);
            setrole(updatedrole);
            setFilteredrole(updatedrole);
        }
    };

    return (
        <div>
            <div className="h-screen flex">

                <div className="flex flex-1 flex-col bg-[#f7fbff]">
                    <Header />
                    <RoleHeader onSearch={handleSearch} />
                    <div className="py-6 px-6 h-full w-[1000px] overflow-scroll scrollbar-none">
                        <div className="bg-white w-full rounded-xl border border-[#EAE5FF] py-4 px-3 overflow-x-auto scrollbar-none">
                            <div className="relative sm:rounded-lg">
                                <table className="min-w-full text-sm text-left text-gray-700">
                                    <thead className="bg-gray-50 text-xs uppercase font-medium text-gray-500">
                                        <tr>
                                            <th className="px-4 py-3 min-w-[120px]">
                                                Sr. No
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('id')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('id')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[120px]">
                                                Name
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('requested_role')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('requested_role')} />
                                                </div>
                                            </th>

                                            <th className="px-4 py-3 min-w-[100px]">
                                                Email
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('requested_role')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('requested_role')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[120px]">
                                                 Role
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('requested_role')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('requested_role')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[180px]">
                                                Request Role
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('requested_role')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('requested_role')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[100px]">
                                                 Status
                                            </th>

                                            <th className="px-4 py-3 min-w-[150px]">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {currentrole.length > 0 ? (
                                            currentrole.map((role, index) => (
                                            <tr key={role.id}>
                                                <td className="px-4 py-2">{index + 1 + indexOfFirst}</td>
                                                <td className="px-4 py-2">{role.user?.name|| "N/A"}</td>
                                                <td className="px-4 py-2">{role.user?.email || "N/A"}</td>
                                                <td className="px-4 py-2">{role.user?.role|| "N/A"}</td>
                                                <td className="px-4 py-2">{role?.requested_role || "N/A"}</td>
                                                <td className="px-4 py-2">
                                                    <span
                                                        className={`px-2 py-1 text-sm rounded-full ${role.status === "pending" ? 'bg-yellow-500 text-white' : 'bg-green-400 text-white'}`}
                                                    >
                                                        {role.status === "pending" ? "Accept" : "approved"}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-2">
                                                    <button className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition " onClick={()=>{handledelete(role.id)}}>

                                                        <FaTrash />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-3 text-center text-gray">No Data available</td>
                                        </tr>
                                    )
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="bottom-0 left-0 w-full bg-[#f7fbff] py-4 flex justify-between items-center">
                            <span className="text-sm font-normal text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{indexOfFirst + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(indexOfLast, filteredrole.length)}</span> of <span className="font-semibold text-gray-900">{filteredrole.length}</span>
                            </span>
                            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                                <li>
                                    <button
                                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                        className={`previous-button ${filteredrole.length === 0 ? 'cursor-not-allowed' : ''}`}
                                        disabled={currentPage === 1 || filteredrole.length === 0}
                                        title={filteredrole.length === 0 ? 'No data available' : ''}
                                    >
                                        <img src="/image/action/Left Arrow.svg" alt="Left" /> Previous
                                    </button>
                                </li>
                                <li>
                                    <span className="current-page">
                                        Page {filteredrole.length > 0 ? currentPage : 0} of {filteredrole.length > 0 ? totalPages : 0}
                                    </span>
                                </li>
                                <li>
                                    <button
                                        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                        className={`next-button ${filteredrole.length === 0 ? 'cursor-not-allowed' : ''}`}
                                        disabled={currentPage === totalPages || filteredrole.length === 0}
                                        title={filteredrole.length === 0 ? 'No data available' : ''}
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
    )
}

export default RoleChange