import db from "../models/index";
require('dotenv').config();
import _ from 'lodash';
import emailService from '../services/emailService';
import { v4 as uuidv4 } from 'uuid';

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let buildUrlEmail = (doctorId, token) => {
    return `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
}

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let token = uuidv4();
            await emailService.sendSimpleEmail({
                receiverEmail: data.email,
                patientName: data.fullName,
                time: data.timeString,
                doctorName: data.doctorName,
                language: data.language,
                // redirectLink: 'asdjasdj',
                redirectLink: buildUrlEmail(data.doctorId, token),
            });
            let users = await db.User.findOrCreate({
                where: { email: data.email },
                defaults: {
                    email: data.email,
                    roleId: 'R3',
                    gender: data.selectedGender,
                    address: data.address,
                    firstName: data.firstName,
                },
            });
            if (users && users[0]) {
                await db.Booking.findOrCreate({
                    where: { patientId: users[0].id },
                    defaults: {
                        statusId: 'S1',
                        doctorId: data.doctorId,
                        patientId: users[0].id,
                        date: data.date,
                        timeType: data.timeType,
                        token: token,
                    },
                })
            }
            resolve(users[0]);
        } catch (err) {
            reject(err);
        }
    })
}

let postVerifyAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let appointment = await db.Booking.findOne({
                where: {
                    doctorId: data.doctorId,
                    token: data.token,
                    statusId: 'S1'
                },
                raw: false,
            });
            if (appointment) {
                appointment.statusId = 'S2';
                await appointment.save();
                resolve({
                    errCode: 0
                })
            } else {
                resolve({
                    errCode: 2
                })
            }
        } catch (err) {
            reject(err);
        }
    })
}

module.exports = {
    postBookAppointment: postBookAppointment,
    buildUrlEmail: buildUrlEmail,
    postVerifyAppointment: postVerifyAppointment,
}