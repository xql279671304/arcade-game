var User = require('../models/user');

exports.register = async (req, res) => {
    var body = req.body;
    var user = await User.findOne({name: body.name});
    var data;
    if(user){
        data = {code: 202, message: '该手机已经注册过了！'}
    }else{
        user = new User(body);
        var newUser = await user.save();
        if(newUser){
            data = {code: 200, data: '操作成功！'};
        }else{
            data = {code: 208, message: '数据库储存数据失败！'};
        }
    }

    res.status(200).send(data);
};

exports.login = async (req, res) => {
    var body = req.query;
    var user = await User.findOne(body);
    res.status(200);
    if(user&&user._id){
        res.send({code: 200, message: '登录成功！'});
    }else{
        res.send({code: 201, message: '抱歉，账号或密码错误！'});
    }
};

exports.getScore = async(req, res) => {
    var body = req.body;
    var user = await User.findOne({name: body.name});
    var data;
    if(user){

    }else{
        data = {code: 203, message: '用户不存在！'};
    }
};