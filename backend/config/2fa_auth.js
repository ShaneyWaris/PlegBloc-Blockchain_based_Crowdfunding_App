const speakeasy = require('speakeasy');
const qrcode = require('qrcode');


const generateSecret = () => {
    let secret = speakeasy.generateSecret({
        name: "PlegBloc"
    });
    return secret;
}


const generateQRCode = (_secret) => {
    qrcode.toDataURL(_secret.otpauth_url, (err, image_data) => {
        if (err) throw err;
        return image_data;
    });
}


const isVerified = (_secret, _encoding, _otp) => {
    let verify = speakeasy.totp.verify({
        secret: _secret,
        encoding: _encoding,
        token: _otp
    });
    return verify;
}

// function main() {
//     console.log(generateSecret());
// }
// main();

module.exports = {
    generateSecret,
    isVerified,
    generateQRCode
}