const express = require('express');
const router = express.Router();
const userService = require('./user.service');

router.post('/authenticate', authenticate)
router.post('/register', register)
router.post('/:id/subscribe', subscribe)
router.get('/', getAll)
router.get('/current', getCurrent)
router.get('/:id', getById)
router.put('/:id', update)
router.delete('/:id', _delete)
router.delete('/:id/subscription/:sbid', deleteSB)

function deleteSB(req, res, next) {
    userService.deleteSB(req.params.id, req.params.sbid)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function subscribe(req, res, next) {
    console.log('### come into user.controller subscribe : ' + JSON.stringify(req.body))
    userService.subscribe(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    console.log('### come into user.controller register :' + JSON.stringify(req.body))
    userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err))
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => {
            console.log(users)
            res.json(users);
        })
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    console.log(req)
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err))
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err))
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err))
}

function _delete(req, res, next) {
    userService._delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

module.exports = router