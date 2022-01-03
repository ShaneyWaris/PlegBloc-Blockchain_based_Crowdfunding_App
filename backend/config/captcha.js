const svgCaptcha = require('svg-captcha');

const generateCaptcha = () => {
    let captcha = svgCaptcha.create({
        size: 5,
        noise: 3,
        ignoreChars: 'o0lI',
        color: true,
        background: '#cc9966'
    });
    return captcha;  // {text: "code", data: "<svg></svg>"}
}


const verifyCaptcha = (captcha, enteredValue) => {
    if (captcha.text === enteredValue) return true;
    else return false;
}
