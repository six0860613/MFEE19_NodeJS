const bcrypt = require('bcryptjs');

(async ()=>{
    const salt = await bcrypt.genSalt(8); //加密方式salt
    console.log(`salt: ${salt}`);

    const hash1 = await bcrypt.hash('ray', salt);
    const hash2 = await bcrypt.hash('ray', 10);
    const hash3 = await bcrypt.hash('ray', salt);

    console.log(`hash1: ${hash1}`);
    console.log(`hash2: ${hash2}`);
    console.log(`hash3: ${hash3}`);

    console.log('----------------');
    console.log('compare 1:',await bcrypt.compare('ray', hash1));
    console.log('compare 2:',await bcrypt.compare('ray', hash2));
    console.log('compare 3:',await bcrypt.compare('ray', hash3));
    console.log('compare 1 2:',await bcrypt.compare(hash1, hash2));
    console.log('compare 2 3 :',await bcrypt.compare(hash2, hash3));
})();