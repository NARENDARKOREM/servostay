import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import CountryHeader from './CountryHeader';
import { GoArrowDown, GoArrowUp } from 'react-icons/go';
import { FaPen, FaTrash } from "react-icons/fa";
import { DeleteEntity } from '../utils/Delete';
import { useNavigate } from 'react-router-dom';
import { handleSort } from '../utils/sorting';
import api from '../utils/api';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

const CountryList = () => {
    const navigate = useNavigate();
    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchCountries();
    }, []);

    const fetchCountries = async () => {
        try {
            const response = await api.get("/countries/all")
            console.log(response.data)
            setCountries(response.data);
            setFilteredCountries(response.data);
        } catch (error) {
            console.error("Error fetching countries:", error);
        }
    };

    const handleSearch = (event) => {
        const searchQuery = event.target.value.toLowerCase();
        const filteredData = countries.filter(country =>
            Object.values(country).some(value =>
                String(value).toLocaleLowerCase().includes(searchQuery)
            )
        )
        setFilteredCountries(filteredData)
        setCurrentPage(1)
    }

    // for sorting
    const sortData = (key) => {
        handleSort(filteredCountries, key, sortConfig, setSortConfig, setFilteredCountries);
    };

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentCountries = filteredCountries.slice(indexOfFirst, indexOfLast);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);

    const handledelete = async (id) => {
        const success = await DeleteEntity("Country", id);
        if (success) {
            const updatedCountries = countries.filter((country) => country.id !== id);
            setCountries(updatedCountries);
            setFilteredCountries(updatedCountries);
        }
    };

    // for update
    const updateCountry = (id) => {
        navigate('/add-country', { state: { id: id } })
    }

    return (
        <div>
            <div className="h-screen flex">

                <div className="flex flex-1 flex-col bg-[#f7fbff]">
                    <Header />
                    <CountryHeader onSearch={handleSearch} />
                    <div className="py-6 px-6 h-full w-[1000px] overflow-scroll scrollbar-none">
                        <div className="bg-white w-full rounded-xl border border-[#EAE5FF] py-4 px-3 overflow-x-auto scrollbar-none">
                            <div className="relative sm:rounded-lg">
                                <table className="min-w-full text-sm text-left text-gray-700">
                                    <thead className="bg-gray-50 text-xs uppercase font-medium text-gray-500">
                                        <tr>
                                            <th className="px-4 py-3 min-w-[100px]">
                                                Sr. No
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('slno')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('slno')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[150px]">
                                                Country Title Name
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('title')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('title')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[150px]">Country Image</th>
                                            <th className="px-4 py-3 min-w-[100px]">
                                                Total Properties
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('totalProperties')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('totalProperties')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[100px]">
                                                Country Status
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('totalProperties')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('totalProperties')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[120px]">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">

                                        {filteredCountries.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4">
                                                    No countries found.

                                                </td>
                                            </tr>
                                        ) : (
                                            currentCountries.map((country, index) => (
                                                <tr key={country.id}>
                                                    <td className="px-4 py-3">{index + 1 + indexOfFirst}</td>
                                                    <td className="px-4 py-3">{country?.title || "N/A"}</td>
                                                    <td className="px-4 py-3">
                                                        {country.img && country.img.trim() !== '' ? (
                                                            <img src={country.img} className="w-16 h-16 object-cover rounded-full" height={50} width={50} loading="lazy" alt="" onError={(e) => {
                                                                if (e.target.src !== 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg') {
                                                                    e.target.src = 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg';
                                                                }
                                                            }} />
                                                        ) : (
                                                            <img src={'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'} height={50} width={50} loading="lazy" alt="" />
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">{country?.totalProperties || 0}</td>
                                                    <td className="px-4 py-3">
                                                        <span
                                                            className={`px-3 py-1 text-sm rounded-full ${country.status === 1 ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}
                                                        >
                                                            {country.status === 1 ? "publish" : "unpublish"}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <button className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition mr-2" onClick={() => { updateCountry(country.id) }}>
                                                            <FaPen />
                                                        </button>
                                                        <button className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition" onClick={() => { handledelete(country.id) }}>
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="bottom-0 left-0 w-full bg-[#f7fbff] py-4 flex justify-between items-center">
                            <span className="text-sm font-normal text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{indexOfFirst + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(indexOfLast, filteredCountries.length)}</span> of <span className="font-semibold text-gray-900">{filteredCountries.length}</span>
                            </span>
                            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                                <li>
                                    <button
                                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                        className={`previous-button ${filteredCountries.length === 0 ? 'cursor-not-allowed' : ''}`}
                                        disabled={currentPage === 1 || filteredCountries.length === 0}
                                        title={filteredCountries.length === 0 ? 'No data available' : ''}
                                    >
                                        <img src="/image/action/Left Arrow.svg" alt="Left" /> Previous
                                    </button>
                                </li>
                                <li>
                                    <span className="current-page">
                                        Page {filteredCountries.length > 0 ? currentPage : 0} of {filteredCountries.length > 0 ? totalPages : 0}
                                    </span>
                                </li>
                                <li>
                                    <button
                                        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                        className={`next-button ${filteredCountries.length === 0 ? 'cursor-not-allowed' : ''}`}
                                        disabled={currentPage === totalPages || filteredCountries.length === 0}
                                        title={filteredCountries.length === 0 ? 'No data available' : ''}
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

export default CountryList;
