import db from "../models/index";
let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Specialty.create({
                name: data.name,
                image: data.imageBase64,
                descriptionHTML: data.descriptionHTML,
                descriptionMarkdown: data.descriptionMarkdown,
            })
            resolve({
                errCode: 0
            })
        } catch (e) {
            reject(e);
        }
    })
}

let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll();
            if (data && data.length > 0) {
                data.map((item) => {
                    item.image = new Buffer(item.image, 'base64').toString('Binary');
                    return item;
                })
            }
            resolve({
                data: data,
                errCode: 0
            })
        } catch (e) {
            reject(e);
        }
    })
}

let getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findOne({
                where: { id: inputId },
                attributes: ['descriptionHTML', 'descriptionMarkdown']
            });
            if (data) {
                let doctorSpecialty = [];
                if (location === 'ALL') {
                    doctorSpecialty = await db.Doctor_Info.findAll({
                        where: { specialtyId: inputId },
                        attributes: ['doctorId', 'provinceId']
                    });
                } else {
                    doctorSpecialty = await db.Doctor_Info.findAll({
                        where: {
                            specialtyId: inputId,
                            provinceId: location
                        },
                        attributes: ['doctorId', 'provinceId']
                    });
                }
                data.doctorSpecialty = doctorSpecialty;
            } else {
                data = {};
            }
            resolve(data);
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById
}