var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer();

var User = require('../models/user');
var API = require('../controllers/API')


// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', new Date());
    next();
});

// 登录
router.get('/login', API.login);

//注册
router.post('/register', upload.array(), API.register);

// 更新得分
router.put('/getScore', upload.array(), API.getScore);

module.exports = router;