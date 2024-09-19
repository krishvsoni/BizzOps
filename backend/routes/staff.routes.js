import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addStaff, getStaff, staffCredit, staffDebit } from "../controllers/staff.controller.js";

const router = Router()

router.route('/add-staff').post(verifyJWT,addStaff)
router.route('/get-staff').get(verifyJWT,getStaff)
router.route('/staff-credit').post(verifyJWT,staffCredit)
router.route('/staff-debit').post(verifyJWT,staffDebit)

export default router