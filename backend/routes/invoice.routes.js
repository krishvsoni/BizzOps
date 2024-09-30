import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addInvoice, countInvoices, getInvoice, getPaidInvoices, getUnpaidInvoices } from "../controllers/invoice.controller.js";


const router = Router()

router.route('/add-invoice').post(verifyJWT,addInvoice)
router.route('/get-invoice').get(verifyJWT,getInvoice)
router.route('/paid-invoice').get(verifyJWT,getPaidInvoices)
router.route('/unpaid-invoice').get(verifyJWT,getUnpaidInvoices)
router.route('/count-invoice').get(verifyJWT,countInvoices)

export default router