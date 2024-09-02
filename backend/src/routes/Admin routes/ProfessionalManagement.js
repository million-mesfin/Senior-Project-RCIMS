const express = require("express");
const { addProfessional, getProfessionals, updateProfessional, deleteProfessional, getProfessionalById, checkPhoneNumber } = require("../../controller/AdminController/ProfessionalController");

const router = express.Router();

router.post("/add-professional", addProfessional);
router.get("/get-professionals", getProfessionals);
router.put("/update-professional/:id", updateProfessional);
router.delete("/delete-professional/:id", deleteProfessional);
router.get("/professional-details/:id", getProfessionalById);
router.get("/check-phone/:phoneNumber", checkPhoneNumber);

module.exports = router;