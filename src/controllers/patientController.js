import patientService from '../services/patientService'

let handleBookAppointment = async (req, res) => {
    try {
        let user = await patientService.postBookAppointment(req.body);
        return res.status(200).json(user)
    } catch (e) {
        return res.status(200).json({
            error: e
        })
    }
}

let handleVerifyAppointment = async (req, res) => {
    try {
        let info = await patientService.postVerifyAppointment(req.body);
        return res.status(200).json(info)
    } catch (e) {
        return res.status(200).json(e)
    }
}

module.exports = {
    handleBookAppointment: handleBookAppointment,
    handleVerifyAppointment: handleVerifyAppointment,
}