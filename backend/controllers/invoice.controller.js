import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Invoice } from "../models/invoice.model.js";

const addInvoice = asyncHandler(async(req, res) => {
    const { name, items, paid } = req.body;
    const owner = req.user?._id;

    if (!name || !items || items.length === 0) {
        throw new ApiError(400, "Customer name and items are required.");
    }

    if (!owner) {
        throw new ApiError(401, "Unauthorized request");
    }

    // Calculate subTotal and grandTotal for all items
    let subTotal = 0;
    let grandTotal = 0;

    items.forEach((item) => {
        if (!item.itemName || !item.qty || !item.price || item.tax === undefined) {
            throw new ApiError(400, "Each item must have a name, qty, price, and tax");
        }
        const itemSubTotal = item.qty * item.price;
        const itemGrandTotal = itemSubTotal * (1 + item.tax / 100);

        subTotal += itemSubTotal;
        grandTotal += itemGrandTotal;
    });

    const invoice = await Invoice.create({
        owner,
        name,
        items,
        subTotal,
        grandTotal,
        paid
    });

    return res
        .status(200)
        .json(new ApiResponse(200, { invoice }, "Invoice added successfully"));
});

const getInvoice = asyncHandler(async(req,res)=>{
    const owner = req.user?._id
    if(!owner){
        throw new ApiError(400,"Unauthorized User")
    }

    const invoice = await Invoice.find({owner})

    if(!invoice){
        throw new ApiError(400,"No invoices found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,{invoice},"invoice retrived successful"))
})

const getPaidInvoices = asyncHandler(async(req, res) => {
    const owner = req.user?._id;

    if (!owner) {
        throw new ApiError(401, "Unauthorized request");
    }

    // Fetch all paid invoices for the logged-in user
    const paidInvoices = await Invoice.find({ owner, paid: true });

    if (!paidInvoices || paidInvoices.length === 0) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "No paid invoices found"));
    }

    // Calculate the total paid amount
    const totalPaidAmount = paidInvoices.reduce((acc, invoice) => {
        return acc + invoice.grandTotal;
    }, 0);

    return res
        .status(200)
        .json(new ApiResponse(200, { totalPaidAmount, paidInvoices }, "Paid invoices retrieved successfully"));
});

const getUnpaidInvoices = asyncHandler(async(req, res) => {
    const owner = req.user?._id;

    if (!owner) {
        throw new ApiError(401, "Unauthorized request");
    }

    // Fetch all unpaid invoices for the logged-in user
    const unpaidInvoices = await Invoice.find({ owner, paid: false });

    if (!unpaidInvoices || unpaidInvoices.length === 0) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "No unpaid invoices found"));
    }

    // Calculate the total unpaid amount
    const totalUnpaidAmount = unpaidInvoices.reduce((acc, invoice) => {
        return acc + invoice.grandTotal;
    }, 0);

    return res
        .status(200)
        .json(new ApiResponse(200, { totalUnpaidAmount, unpaidInvoices }, "Unpaid invoices retrieved successfully"));
});


export {
    addInvoice,
    getInvoice,
    getPaidInvoices,
    getUnpaidInvoices,
}