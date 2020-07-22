const redis = require("redis");

const get = async (id) => {

    var client = redis.createClient();
    client.on('connect', () => {
        console.log("JWT Token Found in Redis.");
    })

    let obj = await new Promise((resolve, reject) => {
        client.get(id, async (err, obj) => {
            resolve(obj);
            reject(err);
        })
    })
    return obj;
}

const set = async (id, objct) => {

    var client = redis.createClient();
    client.on('connect', () => {
        console.log("JWT Token Reset in Redis.");
    })

    let obj = await new Promise((resolve, reject) => {
        client.set(id, objct, async (err, obj) => {
            resolve(obj);
            reject(err);
        })
    })
    return obj;
}


module.exports = {
    get,
    set
};