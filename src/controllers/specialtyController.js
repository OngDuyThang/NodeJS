import specialtyService from '../services/specialtyService'

let handleCreateSpecialty = async (req, res) => {
    try {
        let result = await specialtyService.createSpecialty(req.body);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(200).json({ errCode: 2 })
    }
}

let handleGetAllSpecialty = async (req, res) => {
    try {
        let result = await specialtyService.getAllSpecialty();
        return res.status(200).json(result);
    } catch (e) {
        return res.status(200).json({ errCode: 2 })
    }
}

let handleGetDetailSpecialtyById = async (req, res) => {
    try {
        let result = await specialtyService.getDetailSpecialtyById(req.query.id, req.query.location);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(200).json({ errCode: 2 })
    }
}

module.exports = {
    handleCreateSpecialty: handleCreateSpecialty,
    handleGetAllSpecialty: handleGetAllSpecialty,
    handleGetDetailSpecialtyById: handleGetDetailSpecialtyById,
}