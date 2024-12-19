// pdfUtils.js
import { jsPDF } from "jspdf";

export const generateInvoicePdf = () => {
    // alert(1)
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("InVoice", 14, 22);
    doc.setFontSize(12);
    doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 30);

    doc.setLineWidth(0.5);
    doc.line(10, 35, 200, 35); 

    doc.setFontSize(14);
    doc.text("Order Details", 14, 45);
    doc.setFontSize(12);
    doc.text(`Order No: #5`, 14, 55);
    doc.text(`Order Date: 25-11-2024`, 14, 65);
    doc.text(`Mobile Number: +916305836115`, 14, 75);
    doc.text(`Customer Name: Mega Star`, 14, 85);

    doc.line(10, 90, 200, 90); // Horizontal line

    doc.setFontSize(14);
    doc.text("Total Order", 14, 100);
    const totalOrderData = [
        ["Description", "Amount"],
        ["Subtotal", "30,000 ₹"],
        ["Total Day", "3 Days"],
        ["Tax", "1,500 ₹"],
        ["Net Amount (Paid)", "0 ₹"],
    ];

    const startY = 110;
    const rowHeight = 10;
    totalOrderData.forEach((row, index) => {
        doc.text(row[0], 14, startY + index * rowHeight);
        doc.text(row[1], 160, startY + index * rowHeight, { align: "right" });
    });

    doc.line(10, startY + totalOrderData.length * rowHeight + 5, 200, startY + totalOrderData.length * rowHeight + 5); // Horizontal line

    doc.setFontSize(14);
    doc.text("Payment & Property Details", 14, startY + totalOrderData.length * rowHeight + 15);
    const paymentDetailsData = [
        ["Description", "Amount"],
        ["Payment Gateway", "30,000 ₹"],
        ["Property Title", "3 Days"],
        ["Property Image", "1,500 ₹"],
        ["Property Check In Date", "0 ₹"],
        ["Property Check Out Date", "0 ₹"],
    ];

    const paymentStartY = startY + totalOrderData.length * rowHeight + 25;
    paymentDetailsData.forEach((row, index) => {
        doc.text(row[0], 14, paymentStartY + index * rowHeight);
        doc.text(row[1], 160, paymentStartY + index * rowHeight, { align: "right" });
    });

    doc.setFontSize(14);
    doc.text("Property Address", 14, paymentStartY + paymentDetailsData.length * rowHeight + 15);
    doc.setFontSize(12);
    doc.text("Lingampalli, Hyderabad, Telangana", 14, paymentStartY + paymentDetailsData.length * rowHeight + 25);
    doc.text("Booking Owner Name: Mega Star", 14, paymentStartY + paymentDetailsData.length * rowHeight + 35);
    doc.text("Booking Owner Mobile: +916305836115", 14, paymentStartY + paymentDetailsData.length * rowHeight + 45);
    doc.text("Transaction Id: #AD9DEND070", 14, paymentStartY + paymentDetailsData.length * rowHeight + 55);
    doc.text("Booking Status: Booked", 14, paymentStartY + paymentDetailsData.length * rowHeight + 65);

    doc.save("order_preview.pdf");
};
