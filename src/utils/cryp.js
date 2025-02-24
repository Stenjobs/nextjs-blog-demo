import CryptoJS from 'crypto-js';

// 密钥
const SECRET_KEY = 'cssyx@nc';

// md5加密
const md5 = (content) => CryptoJS.MD5(content).toString();

// 加密函数
const genPassword = (password) => {
    const str = `password=${password}&key=${SECRET_KEY}`;
    return md5(str);
};

export default genPassword
