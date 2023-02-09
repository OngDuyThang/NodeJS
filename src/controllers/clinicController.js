import clinicService from '../services/clinicService';

let handleCreateClinic = async (req, res) => {
    try {
        let result = await clinicService.createClinic(req.body);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(200).json({ errCode: 2 })
    }
}

let handleGetAllClinic = async (req, res) => {
    try {
        let result = await clinicService.getAllClinic();
        return res.status(200).json(result);
    } catch (e) {
        return res.status(200).json({ errCode: 2 })
    }
}

let handleGetDetailClinicById = async (req, res) => {
    try {
        let result = await clinicService.getDetailClinicById(req.query.id);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(200).json({ errCode: 2 })
    }
}

module.exports = {
    handleCreateClinic: handleCreateClinic,
    handleGetAllClinic: handleGetAllClinic,
    handleGetDetailClinicById: handleGetDetailClinicById,

}