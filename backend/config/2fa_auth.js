const speakeasy = require('speakeasy');
const qrcode = require('qrcode');


const generateSecret = () => {
    let secret = speakeasy.generateSecret({
        name: "PlegBloc"
    });
    return secret;
}


const generateQRCode = async (_secret) => {
    let image_data = await qrcode.toDataURL(_secret.otpauth_url);
    return image_data;
}


const isVerified = (_secret, _encoding, _otp) => {
    let verify = speakeasy.totp.verify({
        secret: _secret,
        encoding: _encoding,
        token: _otp
    });
    return verify;
}

// async function main() {
    // let s = generateSecret();
    // console.log(s);
    // let qr_code = await generateQRCode(s);
    // console.log(qr_code);
}
// main();

module.exports = {
    generateSecret,
    isVerified,
    generateQRCode
}