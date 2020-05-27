const config = require('../config.json')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../_helpers/db')

const User = db.User;

module.exports = {
    authenticate,
    create,
    getAll,
    getById,
    update,
    _delete,
    subscribe,
    deleteSB
}

async function deleteSB(id, sbid) {

    const user = await User.findById(id);

    if (!user) throw 'User not found';

    user.subscribe.pull({ _id: sbid })

    user.save()

    console.log('deleted subscription : ' + sbid)
}

async function subscribe(id, subscribe) {

    console.log("user.service : id : " + id)

    const user = await User.findById(id)

    if (!user) throw 'User not found'

    user.subscribe.push(subscribe)

    await user.save(user)
}

async function _delete(id) {
    await User.findByIdAndDelete(id);
}

async function update(id, userParam) {
    //console.log("user.service.js , id: " + id + "userParam: " + JSON.stringify(userParam))

    const user = await User.findById(id);

    console.log("user.service.js , user found: " + JSON.stringify(user))

    if (!user) throw 'User not found';

    // if (user.name !== userParam.username &&
    //     await User.findOne({ username: userParam.username })) {
    //     throw 'Username "' + userParam.username + '" is already taken';
    // }

    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    Object.assign(user, userParam);
    await user.save()

}

async function getById(id) {
    console.log("###user.service -> getById : " + id)
    return await User.findById(id).select('-hash');
}

async function getAll() {
    return await User.find().select('-hash');
}

async function authenticate({ username, password }) {
    const user = await User.findOne({ username });

    if (!user) {
        throw 'User not found';
    }

    if (User && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: 60 })
        const refreshToken = jwt.sign({ sub: user.id }, config.refresh_secret, { expiresIn: 60 });
        return {
            ...userWithoutHash,
            token,
            refreshToken,
            status: 'ok'
        }
    }
}

async function create(userParam) {
    console.log("user.service : " + JSON.stringify(userParam));
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is aleady taken';
    }

    const user = new User(userParam);

    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }
    await user.save();
}

