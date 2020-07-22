const redis = require("redis");

const get = async (id) => {

    var client = redis.createClient();
    client.on('connect', () => {
        console.log("Connected....");
    })

    let obj = await new Promise((resolve, reject) => {
        client.getall(id, async (err, obj) => {
            resolve(obj);
            reject(err);
        })
    })
    return obj;
}

const set = async (id, objct) => {

    var client = redis.createClient();
    client.on('connect', () => {
        console.log("Redis Connected....");
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