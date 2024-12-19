import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import ExtraImageHeader from "./ExtraImageHeader";
import { GoArrowDown, GoArrowUp } from "react-icons/go";
import { FaPen, FaTrash } from "react-icons/fa";
import Loader from "../common/Loader";
import axios from "axios";
import { handleSort } from "../utils/sorting";
import { DeleteEntity } from "../utils/Delete";
import { useNavigate } from "react-router-dom";
import { NotificationContainer } from "react-notifications";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";

import api from "../utils/api";


const ExtraImageList = () => {
    const navigate = useNavigate()
    const [extraImages, setExtraImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchExtraImages = async () => {
            setIsLoading(true);
            try {
                const response = await api.get("/extra");
                console.log(response.data);
                setExtraImages(response.data);
                setFilteredImages(response.data);
            } catch (error) {
                console.error(
                    "Error fetching extra images:",
                    error.response ? error.response.data : error.message
                );
            } finally {
                setIsLoading(false);
            }
        };
        fetchExtraImages();
    }, []);

    // Search functionality
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        const filteredData = extraImages.filter(extraImage =>
            Object.values(extraImage).some(value =>
                typeof value === 'object' && value !== null
                    ? Object.values(value).some(nestedValue =>
                        String(nestedValue).toLowerCase().includes(query)
                    )
                    : String(value).toLowerCase().includes(query)
            )
        );
        setFilteredImages(filteredData);
        setCurrentPage(1);
    };

    // for sorting
    const sortData = (key) => {
        handleSort(filteredImages, key, sortConfig, setSortConfig, setFilteredImages)
    };

    const indexOfLastImage = currentPage * itemsPerPage;
    const indexOfFirstImage = indexOfLastImage - itemsPerPage;
    const currentImages = filteredImages.slice(indexOfFirstImage, indexOfLastImage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredImages.length / itemsPerPage);

    // for delete
    const handledelete = async (id) => {
        const success = await DeleteEntity('ExtraImages', id);
        if (success) {
            const updatedExtraImage = extraImages.filter((extraImages) => extraImages.id !== id);
            setExtraImages(updatedExtraImage)
            setFilteredImages(updatedExtraImage)
        }
    }

    const updateExtraImage = (id) => {
        if(!id){
            return;
        }
        navigate("/create-extra-image", { state: { id: id } })
    }

    return (
        <div>
            {isLoading && <Loader />}
            <div className="h-screen flex">
                {/* Sidebar */}

                <div className="flex flex-1 flex-col bg-[#f7fbff]">
                    <Header />
                    <ExtraImageHeader onSearch={handleSearch} />
                    <div className="py-6 px-6 h-full w-[1000px] overflow-scroll scrollbar-none">
                        <div className="bg-white w-full rounded-xl border border-[#EAE5FF] py-4 px-3 overflow-x-auto scrollbar-none">
                            <div className="relative sm:rounded-lg">
                                <table className="min-w-full text-sm text-left text-gray-700">
                                    <thead className="bg-gray-50 text-xs uppercase font-medium text-gray-500">
                                        <tr>
                                            <th className="px-4 py-3 min-w-[100px]">
                                                Sr. No
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => sortData("slno")} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => sortData("slno")} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[150px]">
                                                Gallery Image
                                            </th>
                                            <th className="px-4 py-3 min-w-[150px]">
                                                Property Title
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => sortData("name")} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => sortData("name")} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[100px]">
                                                Gallery Status
                                            </th>
                                            <th className="px-4 py-3 min-w-[100px]">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {currentImages.length > 0 ? (
                                            currentImages.map((extraImage, index) => (
                                                <tr key={extraImage.id}>
                                                    <td className="px-4 py-3">{index + 1 + indexOfFirstImage}</td>
                                                    <td className="px-4 py-3">
                                                        {extraImage.images && extraImage.images.length > 0 ? (
                                                            <div className="flex space-x-2">
                                                                {extraImage.images.map((image, index) => (
                                                                    <img
                                                                        key={index}
                                                                        src={image.url}
                                                                        className="w-16 h-16 object-cover rounded-full"
                                                                        height={50}
                                                                        width={50}
                                                                        loading="lazy"
                                                                        alt={`Image ${index + 1}`}
                                                                        onError={(e) => {
                                                                            if (
                                                                                e.target.src !==
                                                                                "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
                                                                            ) {
                                                                                e.target.src =
                                                                                    "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg";
                                                                            }
                                                                        }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <img
                                                                src={
                                                                    "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
                                                                }
                                                                height={50}
                                                                width={50}
                                                                loading="lazy"
                                                                alt="No images available"
                                                            />
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">{extraImage?.Property?.title || "No Title"}</td>
                                                    <td className="px-4 py-3">
                                                    {extraImage.status === 1 ? 
                                                        <FontAwesomeIcon className='h-7 w-16 ' style={{color:'#0064DC'}} icon={faToggleOn} /> 
                                                        : 
                                                        <FontAwesomeIcon className='h-7 w-16' style={{color:'#e9ecef'}} icon={faToggleOff} />
                                                    }
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <NotificationContainer />
                                                        <button className="bg-[#2dce89] text-white p-2 rounded-full hover:bg-green-600 transition mr-2" onClick={() => { updateExtraImage(extraImage.id) }}>
                                                            <FaPen />
                                                        </button>
                                                        <button className="bg-[#f5365c] text-white p-2 rounded-full hover:bg-red-600 transition" onClick={() => { handledelete(extraImage.id) }}>
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
                        <div className="bottom-0 left-0 w-full bg-[#f7fbff] py-4 flex justify-between items-center">
                            <span className="text-sm font-normal text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{indexOfFirstImage + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(indexOfLastImage, filteredImages.length)}</span> of <span className="font-semibold text-gray-900">{filteredImages.length}</span>
                            </span>
                            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                                <li>
                                    <button
                                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                        className={`previous-button ${filteredImages.length === 0 ? 'cursor-not-allowed' : ''}`}
                                        disabled={currentPage === 1 || filteredImages.length === 0}
                                        title={filteredImages.length === 0 ? 'No data available' : ''}
                                    >
                                        <img src="/image/action/Left Arrow.svg" alt="Left" /> Previous
                                    </button>
                                </li>
                                <li>
                                    <span className="current-page">
                                        Page {filteredImages.length > 0 ? currentPage : 0} of {filteredImages.length > 0 ? totalPages : 0}
                                    </span>
                                </li>
                                <li>
                                    <button
                                        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                        className={`next-button ${filteredImages.length === 0 ? 'cursor-not-allowed' : ''}`}
                                        disabled={currentPage === totalPages || filteredImages.length === 0}
                                        title={filteredImages.length === 0 ? 'No data available' : ''}
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

export default ExtraImageList;