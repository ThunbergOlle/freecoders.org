const nodemailer = require('nodemailer');

var transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'freecodersbot@gmail.com',
        pass: '',
    }
})
module.exports.sendreq = function sendreq(target, subject, text){
    var mailOptions = {
        from: 'freecodersbot@gmail.com',
        to: target,
        subject: subject,
        text: text
    }
    transport.sendMail(mailOptions, function (err, result){
        if(err) throw err;
        console.log('Email sent to: ' + result.response);
        
    });
}