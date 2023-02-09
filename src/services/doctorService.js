import db from "../models/index";
require('dotenv').config();
import _ from 'lodash';
import emailService from '../services/emailService';

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (inputLimit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                limit: inputLimit,
                where: {
                    roleId: 'R2'
                },
                order: [
                    ['createdAt', 'ASC'],
                ],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true
            })
            resolve(doctors);
        } catch (e) {
            reject(e);
        }
    })
}

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: {
                    roleId: 'R2'
                },
                attributes: {
                    exclude: ['password', 'image']
                },
            });
            resolve(doctors);
        } catch (e) {
            reject(e);
        }
    });
}

let checkRequire = (inputData) => {
    let arr = ['doctorId', 'contentHTML', 'contentMarkdown', 'action',
        'selectedPrice', 'selectedPayment', 'selectedProvince', 'clinicName',
        'clinicAddress', 'note', 'specialtyId'//, 'clinicId',
    ]
    for (let i = 0; i < arr.length; i++) {
        if (!inputData[arr[i]]) {
            return false;
        }
    }
    return true;
}

let saveInfoDoctors = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!checkRequire(inputData)) {
                resolve({
                    error: 'Missing input'
                })
            } else {
                if (inputData.action === 'CREATE') {
                    await db.Markdowns.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId
                    });
                } else if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdowns.findOne({
                        where: {
                            doctorId: inputData.doctorId
                        },
                        raw: false
                    })
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        await doctorMarkdown.save();
                    }
                }
                let doctorInfo = await db.Doctor_Info.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                    },
                    raw: false,
                })
                if (doctorInfo) {
                    doctorInfo.priceId = inputData.selectedPrice;
                    doctorInfo.provinceId = inputData.selectedProvince;
                    doctorInfo.paymentId = inputData.selectedPayment;
                    doctorInfo.clinicName = inputData.clinicName;
                    doctorInfo.clinicAddress = inputData.clinicAddress;
                    doctorInfo.note = inputData.note;
                    doctorInfo.specialtyId = inputData.specialtyId;
                    doctorInfo.clinicId = inputData.clinicId;
                    await doctorInfo.save();
                } else {
                    await db.Doctor_Info.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvince,
                        paymentId: inputData.selectedPayment,
                        clinicName: inputData.clinicName,
                        clinicAddress: inputData.clinicAddress,
                        note: inputData.note,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId
                    });
                }
                resolve({
                    message: 'Save doctor info success'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}

let getDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctor = await db.User.findOne({
                where: {
                    id: inputId,
                },
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Markdowns, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    {
                        model: db.Doctor_Info,
                        attributes: {
                            exclude: ['id', 'doctorId', 'contentMarkdown']
                        },
                        include: [
                            { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                        ]
                    },
                ],
                raw: false,
                nest: true
            })
            if (doctor && doctor.image) {
                doctor.image = new Buffer(doctor.image, 'base64').toString('Binary');
            }
            if (!doctor) {
                doctor = {};
            }
            resolve(doctor);
        } catch (e) {
            reject(e);
        }
    })
}

let bulkCreateSchedule = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (inputData.arrSchedule && inputData.doctorId && inputData.date) {
                let schedule = inputData.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map((item) => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        item.date = String(new Date(item.date).getTime());
                        return item;
                    })
                }
                let existing = await db.Schedule.findAll({
                    where: {
                        doctorId: inputData.doctorId,
                        date: new Date(inputData.date).getTime()
                    },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true,
                })
                // if (existing && existing.length > 0) {
                //     existing = existing.map((item) => {
                //         item.date = new Date(item.date).getTime();
                //         return item;
                //     })
                // }
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && a.date === b.date;
                });
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }
                resolve({
                    message: 'OK'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (doctorId, date) {
                let schedules = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date,
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    schedules: schedules
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getExtraInfoById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let info = await db.Doctor_Info.findOne({
                where: {
                    doctorId: inputId,
                },
                attributes: {
                    exclude: ['id', 'doctorId']
                },
                include: [
                    { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: false,
                nest: true
            })
            if (!info) info = {};
            resolve(info);
        } catch (e) {
            reject(e);
        }
    })
}

let getProfileById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctor = await db.User.findOne({
                where: {
                    id: inputId,
                },
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Markdowns, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    {
                        model: db.Doctor_Info,
                        attributes: {
                            exclude: ['id', 'doctorId']
                        },
                        include: [
                            { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                        ]
                    },
                ],
                raw: false,
                nest: true
            })
            if (doctor && doctor.image) {
                doctor.image = new Buffer(doctor.image, 'base64').toString('Binary');
            }
            if (!doctor) {
                doctor = {};
            }
            resolve(doctor);
        } catch (e) {
            reject(e);
        }
    })
}

let getListPatient = (id, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Booking.findAll({
                where: {
                    statusId: 'S2',
                    doctorId: id,
                    date: date
                },
                include: [
                    {
                        model: db.User,
                        as: 'patientData',
                        attributes: ['email', 'firstName', 'address', 'gender'],
                        include: [
                            { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                        ]
                    },
                    {
                        model: db.Allcode,
                        as: 'timeTypeDataPatient',
                        attributes: ['valueEn', 'valueVi'],
                    }
                ],
                raw: false,
                nest: true
            });
            resolve(data)
        } catch (e) {
            reject(e);
        }
    })
}

let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let appointment = await db.Booking.findOne({
                where: {
                    doctorId: data.doctorId,
                    patientId: data.patientId,
                    timeType: data.timeType,
                    statusId: 'S2'
                },
                raw: false
            })
            if (appointment) {
                appointment.statusId = 'S3';
                await appointment.save();
            }
            await emailService.sendAttachment(data)
            resolve({
                errCode: 0
            })
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveInfoDoctors: saveInfoDoctors,
    getDoctorById: getDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInfoById: getExtraInfoById,
    getProfileById: getProfileById,
    getListPatient: getListPatient,
    sendRemedy: sendRemedy,
}