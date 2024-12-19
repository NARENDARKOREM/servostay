import React from 'react';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import { generateInvoicePdf } from '../utils/pdfUtils';

const OrderPreviewModal = ({ isOpen, closeModal, downloadModalAsImage }) => {
    if (!isOpen) return null;

    const PdfFormat=()=>{
        generateInvoicePdf()
    }
    return (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true" >
            <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true" ></div>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                        <div className="bg-white px-6 py-4">
                            <h3 className="text-lg font-semibold text-gray-900" id="modal-title">Order Preview</h3>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                                aria-label="Close"
                                title='close'
                            >
                                &times; 
                            </button>
                            {/* Order Details */}
                            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 ">
                                <div className="text-sm font-medium text-gray-700">Order No:</div>
                                <div>#5</div>
                                <div className="text-sm font-medium text-gray-700">Order date:</div>
                                <div>25-11-2024</div>
                                <div className="text-sm font-medium text-gray-700">Mobile Number:</div>
                                <div>+916305836115</div>
                                <div className="text-sm font-medium text-gray-700">Customer Name:</div>
                                <div>Mega Star</div>
                            </div>
                            {/* Buttons */}
                            <div className="flex justify-end gap-2 mt-4">
                                <button className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-md text-white" onClick={downloadModalAsImage}>
                                    <CameraAltOutlinedIcon />
                                </button>
                                <button className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-md text-white" onClick={PdfFormat}>
                                    <PictureAsPdfOutlinedIcon />
                                </button>
                            </div>
                            {/* Total Order */}
                            <div className="mt-6">
                                <h4 className="text-lg font-semibold text-gray-900">Total Order</h4>
                                <table className="mt-2 w-full border border-gray-300 text-sm">
                                    <tbody>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium text-gray-700">Subtotal</td>
                                            <td className="px-4 py-2 text-right">30,000 ₹</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium text-gray-700">Total Day</td>
                                            <td className="px-4 py-2 text-right">3 Days</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium text-gray-700">Tax</td>
                                            <td className="px-4 py-2 text-right">1,500 ₹</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-medium text-gray-700">Net Amount (Paid)</td>
                                            <td className="px-4 py-2 text-right">0 ₹</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Payment & Property Details & Check In and Out Information */}
                            <div className="mt-6">
                                <h4 className="text-lg font-semibold text-gray-900">Payment & Property Details & Check In and Out Information</h4>
                                <table className="mt-2 w-full border border-gray ```javascript
                                -300 text-sm">
                                    <tbody>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium text-gray-700">Payment Gateway?</td>
                                            <td className="px-4 py-2 text-right">30,000 ₹</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium text-gray-700">Property Title?</td>
                                            <td className="px-4 py-2 text-right">3 Days</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium text-gray-700">Property Image?</td>
                                            <td className="px-4 py-2 text-right">1,500 ₹</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-medium text-gray-700">Property Check In Date?</td>
                                            <td className="px-4 py-2 text-right">0 ₹</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-medium text-gray-700">Property Check Out Date?</td>
                                            <td className="px-4 py-2 text-right">0 ₹</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Property & Booking Owner & Booking Status Details */}
                            <div className="mt-6">
                                <h4 className="text-lg font-semibold text-gray-900">Property & Booking Owner & Booking Status Details</h4>
                                <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-4 mt-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-start text-[12px] font-[Montserrat]">Property Address:</span>
                                        <span>Lingampalli, Hyderabad, Telangana</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-start text-[12px] font-[Montserrat]">Booking Owner's Name:</span>
                                        <span>Mega Star</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-start text-[12px] font-[Montserrat]">Booking Owner Mobile:</span>
                                        <span>+916305836115</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-start text-[12px] font-[Montserrat]">Transaction Id:</span>
                                        <span>#AD9DEND070</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-start text-[12px] font-[Montserrat]">Booking Status:</span>
                                        <span>Booked</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                                type="button" onClick={closeModal}
                                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPreviewModal;