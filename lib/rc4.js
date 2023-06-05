const rc4Encrypt = (str, key = "jawa") => {
    return str && key ? rc4Crypt(str, key) : null;
}

const rc4Decrypt = (str, key = "jawa") => {
    return str && key ? rc4Crypt(str, key) : null;
}

const rc4Crypt = (str, key) => {

    let s = [], j = 0, x, result = '';
    for (let i = 0; i < 256; i++) {
        s[i] = i;
    }

    for (let i = 0; i < 256; i++) {
        j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
        x = s[i];
        s[i] = s[j];
        s[j] = x;
    }

    i = 0;
    j = 0;

    for (let y = 0; y < str.length; y++) {
        i = (i + 1) % 256;
        j = (j + s[i]) % 256;
        x = s[i];
        s[i] = s[j];
        s[j] = x;
        result += String.fromCharCode(str.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
    }
    return result;
}