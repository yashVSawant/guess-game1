const bcrypt = require('bcrypt');
const saltRound = 10;
exports.createHash = (password)=>{
    return new Promise(async(res,rej) =>{
        try {
            const salt = await bcrypt.genSalt(saltRound);
            const hash = await bcrypt.hash(password ,salt);
            res(hash);
        } catch (err) {
            rej(err)
        }
    })
}

exports.compareHash = (password ,hash)=>{
    return new Promise(async(res,rej)=>{
        try {
            const isMatch = await bcrypt.compare(password ,hash);
            res(isMatch)
        } catch (err) {
            rej(err);
        }
    })
}