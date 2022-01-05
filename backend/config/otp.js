require("dotenv").config();
const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const initVector = Buffer.from(process.env.initVector, "hex"); // crypto.randomBytes(16);
const Securitykey = Buffer.from(process.env.security_key, "hex"); //crypto.randomBytes(32);
// const initVector = Buffer.from("900b83d3d56c4e0fc339a7ad44a15fd5", "hex"); // crypto.randomBytes(16);
// const Securitykey = Buffer.from("d363ec372aaa56519b003374d2e43f0737a3a7653fa2ffb47f841cf790b78262", "hex"); //crypto.randomBytes(32);
const timeWindow = 60000+60000; // 1+1 minute


const encrypt = async (message) => {
    console.log("=>", message)
    console.log(typeof message)
    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
    let encrypted = cipher.update(message, "utf-8", "hex");
    encrypted += cipher.final("hex");

    // return {
    //     iv: initVector.toString("hex"),
    //     content: encrypted.toString("hex"),
    // };
    return encrypted.toString("hex");
};


const decrypt = async (encoded) => {
    const decipher = crypto.createDecipheriv(
        algorithm,
        Securitykey,
        initVector
    );
    let decrypted = decipher.update(
        Buffer.from(encoded, "hex"),
        "hex",
        "utf-8"
    );
    decrypted += decipher.final("utf-8");
    return decrypted.toString();
};


const genOtp = async (_email) => {
    const userObj = {
        name: _email,
        time: Date.now(),
    };

    let encoded = await encrypt(JSON.stringify(userObj));
    return encoded;
};


const verifyOtp = async (otp, _email) => {
    try {
        // const decipher = crypto.createDecipheriv(
        //     algorithm,
        //     Securitykey,
        //     initVector
        // );
        // let decrypted = decipher.update(
        //     Buffer.from(otp, "hex"),
        //     "hex",
        //     "utf-8"
        // );
        // decrypted += decipher.final("utf-8");
        let decrypted = await decrypt(otp);
        decrypted = JSON.parse(decrypted);
        if (
            decrypted.name == _email &&
            Date.now() - decrypted.time <= timeWindow
        )
            return true;
        return false;
    } catch (e) {
        return false;
    }
};


// async function main() {
    // let obj = {
    //     name: "abc def",
    //     roll_no: 999999
    // };
    // let enc_obj = await encrypt(JSON.stringify(obj));
    // console.log(enc_obj)
    // let dec_obj = await decrypt(enc_obj);
    // console.log(dec_obj)

    // let x = await genOtp("abc@gmail.com");
    // console.log(x)
    // let y = await verifyOtp(x, "abc@gmail.com");
    // console.log(y)
// }
// main();


module.exports = {
    genOtp,
    verifyOtp,
    encrypt,
    decrypt
};
