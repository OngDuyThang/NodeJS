import express from "express";
import homeController from "../controllers/homeController"
import userController from "../controllers/userController"
import doctorController from "../controllers/doctorController"
import patientController from "../controllers/patientController"
import specialtyController from "../controllers/specialtyController"
import clinicController from "../controllers/clinicController"

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage);
    router.get("/link1", (req, res) => {
        return res.send("Hello World 1!");
    });
    router.get("/crud", homeController.getCRUD);
    router.post("/post-crud", homeController.postCRUD);
    router.get('/get-crud', homeController.displayGetCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);

    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    router.get('/api/allcode', userController.handleGetAllCode);

    router.get('/api/top-doctor-home', doctorController.handleGetTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.handleGetAllDoctors);
    router.post('/api/save-info-doctors', doctorController.handleSaveInfoDoctors);
    router.get('/api/get-detail-doctor-by-id', doctorController.handleGetDoctorById);
    router.post('/api/bulk-create-schedule', doctorController.handleBulkCreateSchedule);
    router.get('/api/get-schedule-by-date', doctorController.handleGetScheduleByDate);
    router.get('/api/get-extra-info-by-id', doctorController.handleGetExtraInfoById);
    router.get('/api/get-profile-doctor-by-id', doctorController.handleGetProfileById);
    router.get('/api/get-list-patient', doctorController.handleGetListPatient);
    router.post('/api/send-remedy', doctorController.handleSendRemedy);

    router.post('/api/patient-book-appointment', patientController.handleBookAppointment);
    router.post('/api/verify-book-appointment', patientController.handleVerifyAppointment);

    router.post('/api/create-new-specialty', specialtyController.handleCreateSpecialty);
    router.get('/api/get-all-specialty', specialtyController.handleGetAllSpecialty);
    router.get('/api/get-detail-specialty-by-id', specialtyController.handleGetDetailSpecialtyById);

    router.post('/api/create-new-clinic', clinicController.handleCreateClinic);
    router.get('/api/get-all-clinic', clinicController.handleGetAllClinic);
    router.get('/api/get-detail-clinic-by-id', clinicController.handleGetDetailClinicById);

    return app.use("/", router);
}

module.exports = initWebRoutes;