import doctorService from '../services/doctorService'

let handleGetTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) {
        limit = 10;
    }
    try {
        let doctors = await doctorService.getTopDoctorHome(+limit);
        return res.status(200).json({ doctors });
    } catch (e) {
        return res.status(200).json({
            errMessage: 'Error'
        })
    }
}

let handleGetAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json({
            doctors
        })
    } catch (e) {
        return res.status(200).json({
            error: e,
        })
    }
}

let handleSaveInfoDoctors = async (req, res) => {
    let inputData = req.body;
    try {
        let result = await doctorService.saveInfoDoctors(inputData);
        res.status(200).json({
            result
        })
    } catch (e) {
        res.status(200).json({
            error: e,
        })
    }
}

let handleGetDoctorById = async (req, res) => {
    let inputId = req.query.id;
    try {
        let doctor = await doctorService.getDoctorById(inputId);
        return res.status(200).json(doctor)
    } catch (e) {
        return res.status(200).json({
            error: e
        })
    }
}

let handleBulkCreateSchedule = async (req, res) => {
    let inputData = req.body;
    try {
        let result = await doctorService.bulkCreateSchedule(inputData);
        return res.status(200).json(result)
    } catch (e) {
        return res.status(200).json({
            error: e
        })
    }
}

let handleGetScheduleByDate = async (req, res) => {
    try {
        let result = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date);
        return res.status(200).json(result)
    } catch (e) {
        return res.status(200).json({
            error: e
        })
    }
}

let handleGetExtraInfoById = async (req, res) => {
    try {
        let info = await doctorService.getExtraInfoById(req.query.doctorId);
        return res.status(200).json(info)
    } catch (e) {
        return res.status(200).json({
            error: e
        })
    }
}

let handleGetProfileById = async (req, res) => {
    try {
        let profile = await doctorService.getProfileById(req.query.doctorId);
        return res.status(200).json(profile)
    } catch (e) {
        return res.status(200).json({
            error: e
        })
    }
}

let handleGetListPatient = async (req, res) => {
    try {
        let data = await doctorService.getListPatient(req.query.doctorId, req.query.date);
        return res.status(200).json(data)
    } catch (e) {
        return res.status(200).json({
            error: e,
        })
    }
}

let handleSendRemedy = async (req, res) => {
    try {
        let data = await doctorService.sendRemedy(req.body);
        return res.status(200).json(data)
    } catch (e) {
        return res.status(200).json({
            error: e,
        })
    }
}

module.exports = {
    handleGetTopDoctorHome: handleGetTopDoctorHome,
    handleGetAllDoctors: handleGetAllDoctors,
    handleSaveInfoDoctors: handleSaveInfoDoctors,
    handleGetDoctorById: handleGetDoctorById,
    handleBulkCreateSchedule: handleBulkCreateSchedule,
    handleGetScheduleByDate: handleGetScheduleByDate,
    handleGetExtraInfoById: handleGetExtraInfoById,
    handleGetProfileById: handleGetProfileById,
    handleGetListPatient: handleGetListPatient,
    handleSendRemedy: handleSendRemedy,
}