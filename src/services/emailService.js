require('dotenv').config()
const nodemailer = require("nodemailer");

let sendSimpleEmail = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Customer Services" <odt8169@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "thong tin dat lich kham benh", // Subject line
        html: getBodyHTMLEmail(dataSend),
    });
}

let getBodyHTMLEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới để xác nhân</p>
        <div>
            <a href="${dataSend.redirectLink}" target="_blank">click here</a>
        </div>
        <div>Xin chân thành cảm ơn!</div>
        `
    }
    if (dataSend.language === 'en') {
        result = `
        <h3>Hello ${dataSend.patientName}!</h3>
        <p>You have received this email because of your online booking on our website</p>
        <p>Booking informations:</p>
        <div><b>Times: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>
        <p>If these informations above is true, please click the link below to confirm your booking</p>
        <div>
            <a href="${dataSend.redirectLink}" target="_blank">Click here</a>
        </div>
        <div>Thank you!</div>
        `
    }
    return result;
}

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh thành công</p>
        <p>Thông tin hóa đơn trong file đính kèm:</p>
        
        <div>Xin chân thành cảm ơn</div>
        `
    }
    if (dataSend.language === 'en') {
        result = `
        <h3>Hello ${dataSend.patientName}!</h3>
        <p>You have received this email because of your successful booking on our website</p>
        <p>Paycheck informations:</p>
        <div>Thank you!</div>
        `
    }
    return result;
}

let sendAttachment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_APP, // generated ethereal user
                    pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Customer Services" <odt8169@gmail.com>', // sender address
                to: dataSend.email, // list of receivers
                subject: "ket qua dat lich kham benh", // Subject line
                html: getBodyHTMLEmailRemedy(dataSend),
                attachments: [
                    {
                        filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                        content: dataSend.imgBase64.split('base64,')[1],
                        encoding: 'base64'
                    }
                ]
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    sendSimpleEmail,
    sendAttachment
}