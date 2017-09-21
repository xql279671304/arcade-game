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
    var data;
    res.status(200);
    if(user&&user._id){
        data = {code: 200, message: '登录成功！'};
    }else{
        data = {code: 201, message: '抱歉，账号或密码错误！'};
    }
    res.send(data);
};

exports.getScore = async(req, res) => {
    var body = req.body;
    var user = await User.findOne({name: body.name});
    var data;
    if(user){
        await User.update({name: body.name}, {$set: body}, {upsert: true});
        data = {code: 200, message: '保存数据成功！'};
    }else{
        data = {code: 203, message: '用户不存在！'};
    }
    res.send(data);
};