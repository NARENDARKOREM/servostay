import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import SidebarMenu from "../components/SideBar";
import { GoArrowDown, GoArrowUp } from "react-icons/go";
import { FaPen, FaTrash } from "react-icons/fa";
import { searchFunction } from "../Entity/SearchEntity";
import CategoryHeader from "./CategoryHeader";
import axios from "axios";
import { useLoading } from '../Context/LoadingContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../common/Loader';
import { DeleteEntity } from '../utils/Delete';
import { handleSort } from "../utils/sorting";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { StatusEntity } from "../utils/Status";

import api from "../utils/api";


const CategoryList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const location = useLocation();
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await api.get("/categories/all");

        console.log("Fetched categories:", response.data);
        setCategories(response.data);
        setFilteredCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location, setIsLoading]);

  // Handle search
  // Search functionality
  const handleSearch = (event) => {
    const querySearch = event.target.value.toLowerCase();
    const filteredData = categories.filter(item =>
      Object.values(item).some(value =>
        typeof value === 'object' && value !== null
          ? Object.values(value).some(nestedValue =>
            String(nestedValue).toLowerCase().includes(querySearch)
          )
          : String(value).toLowerCase().includes(querySearch)
      )
    );
    setFilteredCategories(filteredData);
    setCurrentPage(1);
  };

  // Handle sorting
  const sortData = (key) => {
    handleSort(filteredCategories, key, sortConfig, setSortConfig, setFilteredCategories);
  };

  const indexOfLastCategory = currentPage * itemsPerPage;
  const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const handledelete = async (id) => {
    const success = await DeleteEntity('Category', id);
    if (success) {
      const updatedCategories = categories.filter((category) => category.id !== id);
      setCategories(updatedCategories);
      setFilteredCategories(updatedCategories);
    }
  };

  // for update 
  const updateCategory = (id) => {
    navigate('/add-category', { state: { id: id } })
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      const success = await StatusEntity('Category', id, currentStatus, setFilteredCategories, filteredCategories);
  
      if (success) {
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === id ? { ...category, status: newStatus } : category
          )
        );
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };
  

  return (
    <div>
      {isLoading && <Loader />}
      <div className="h-screen flex">
        {/* Sidebar */}
        <div className="flex flex-1 flex-col bg-[#f7fbff]">
          {/* Header */}
          <Header />
          {/* Searching, sorting, and main content area */}
          <CategoryHeader onSearch={handleSearch} />
          {/* Card */}
          <div className="py-6 px-6 h-full w-[1000px] overflow-scroll scrollbar-none">
            <div className="bg-white  w-full rounded-xl border border-[#EAE5FF] py-4 px-3 overflow-x-auto scrollbar-none">
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
                      <th className="px-4 py-3 min-w-[130px]">
                        Category Title
                        <div className="inline-flex items-center ml-2">
                          <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => sortData('title')} />
                          <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => sortData('title')} />
                        </div>
                      </th>
                      <th className="px-4 py-3 min-w-[150px]">
                        Category Image
                      </th>
                      <th className="px-4 py-3 min-w-[100px]">
                        Category Status
                      </th>
                      <th className="px-4 py-3 min-w-[100px]">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">

                    {currentCategories.length > 0 ? (
                      currentCategories.map((category, index) => (
                        <tr key={category.id}>
                          <td className="px-4 py-3">{index + 1 + indexOfFirstCategory}</td>
                          <td className="px-4 py-3">{category?.title || "N/A"}</td>
                          <td className="px-4 py-3">
                            {category.img && category.img.trim() !== '' ? (
                              <img src={category.img} className="w-16 h-16 object-cover rounded-full" height={50} width={50} loading="lazy" alt="" onError={(e) => {
                                if (e.target.src !== 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg') {
                                  e.target.src = 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg';
                                }
                              }} />
                            ) : (
                              <img src={'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'} height={50} width={50} loading="lazy" alt="" />
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {category.status === 1 ? (
                              <FontAwesomeIcon
                                className="h-7 w-16 cursor-pointer"
                                style={{ color: '#0064DC' }}
                                icon={faToggleOn}
                                onClick={() => toggleStatus(category.id, category.status)} // Call toggleStatus here
                              />
                            ) : (
                              <FontAwesomeIcon
                                className="h-7 w-16 cursor-pointer"
                                style={{ color: '#e9ecef' }}
                                icon={faToggleOff}
                                onClick={() => toggleStatus(category.id, category.status)} // Call toggleStatus here
                              />
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <NotificationContainer />
                            <button className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition mr-2" onClick={() => { updateCategory(category.id) }}>
                              <FaPen />
                            </button>
                            <button className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition" onClick={() => { handledelete(category.id) }}>
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-gray-500">No categories found</td>

                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bottom-0 left-0 w-full bg-[#f7fbff] py-4 flex justify-between items-center">
              <span className="text-sm font-normal text-gray-500">
                Showing <span className="font-semibold text-gray-900">{indexOfFirstCategory + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(indexOfLastCategory, filteredCategories.length)}</span> of <span className="font-semibold text-gray-900">{filteredCategories.length}</span>
              </span>
              <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                <li>
                  <button
                    onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                    className={`previous-button ${filteredCategories.length === 0 ? 'cursor-not-allowed' : ''}`}
                    disabled={currentPage === 1 || filteredCategories.length === 0}
                    title={filteredCategories.length === 0 ? 'No data available' : ''}
                  >
                    <img src="/image/action/Left Arrow.svg" alt="Left" /> Previous
                  </button>
                </li>
                <li>
                  <span className="current-page">
                    Page {filteredCategories.length > 0 ? currentPage : 0} of {filteredCategories.length > 0 ? totalPages : 0}
                  </span>
                </li>
                <li>
                  <button
                    onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    className={`next-button ${filteredCategories.length === 0 ? 'cursor-not-allowed' : ''}`}
                    disabled={currentPage === totalPages || filteredCategories.length === 0}
                    title={filteredCategories.length === 0 ? 'No data available' : ''}
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
    // </div>
  );
};

export default CategoryList;
