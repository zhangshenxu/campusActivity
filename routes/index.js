var crypto = require('crypto');
var fs = require('fs');
var User = require('../models/user.js');
var Activity = require('../models/activity.js');
var Suggestion = require('../models/suggestion.js');
var images = require('images');
var xss = require('xss');

module.exports = function(app){
  app.get('/', function(req, res){
    var page = req.query.page ? parseInt(req.query.page) : 1;
    Activity.getTen(page,"all","all",function(err,activitys,total){
      if(err || total == 0){
        activitys = [];
        req.flash('error','没有满足的活动~');
      }
      res.render('index',{
        activity: null,
        type: "all",
        date: "all",
        activitys: activitys,
        totalpage: Math.ceil(total/10),
        totalrecords: total,
        hrefLatter: "all/all/",
        paging: "?page=",
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    })
  });

  app.get('/activity/:type/:date/', function(req, res){
    var type = req.params.type;
    var date = req.params.date;
    var page = req.query.page ? parseInt(req.query.page) : 1;
    Activity.getTen(page,type,date,function(err,activitys,total){
      if(err || total == 0){
        activitys = [];
        req.flash('error','没有满足的活动~');
      }
      res.render('index',{
        activity: null,
        type: type,
        date: date,
        activitys: activitys,
        totalpage: Math.ceil(total/10),
        totalrecords: total,
        hrefLatter: type+'/'+date+'/',
        paging: "?page=",
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    })
  });

  app.get('/activity/:id', function(req, res){
    var id = req.params.id;
    Activity.get(id,function(err,activity){
      if(err){
        activity = null;
        req.flash('error','没有该活动，或者活动已经被删除！');
      }
      else{
        Activity.addHot(id,function(err){
          if(err){
            activity = null;
            req.flash('error','增加热度时出错=。=');
          }
        });
      }
      res.render('activity',{
        activity: activity,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });

  app.get('/activity/:id/edit',checkLogin,function(req, res){
    var id = req.params.id;
    if(req.session.user){
      Activity.get(id,function(err,activity){
        if(activity.publisher == req.session.user.username||req.session.user.username == 'admin'){
          res.render('edit',{
            activity:activity,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
          });
        }else{
          return res.redirect('/');
        }
      });
    }
  });

  app.post('/activity/:id/edit',checkLogin,function(req, res){
    var id = req.params.id;
    if(req.session.user){
      Activity.get(id,function(err,activity){
        if(err){
            req.flash('error','更新错误！');
          }
        if(activity.publisher == req.session.user.username||req.session.user.username == 'admin'){
          var picsize = req.files.placard.size;
          var tmp_path = req.files.placard.path;
          var detail = req.body.detail.replace(/\r\n/g,"<br/>");
          detail = xss(detail,{stripIgnoreTagBody: true});
          if(picsize == 0){
            var placard = activity.placard;
            var target_path = './public/images/placard/' + placard;
            fs.unlink(tmp_path,function(err){
                if (err) throw err;
            });
          }else{
            if(picsize > 1024*1024*2){
              req.flash('error',"海报需要小于2M");
              fs.unlink(tmp_path,function(err){
                if (err) throw err;
              });
              return res.redirect('back');
            }
            var time = Date.parse(new Date());
            //if(req.files.placard = null){
            //  console.log('uuuu');
            //}
            var placard = time+'.jpg';
            var target_path = './public/images/placard/' + placard;
            fs.rename(tmp_path, target_path, function(err){
              if (err) throw err;
              fs.unlink(tmp_path,function(){
                if (err) throw err;
              });
            });
          }
          var updateactivity = new Activity({
            title: req.body.title,
            type: req.body.type,
            detail: detail,
            placard: placard,
            publisher: activity.publisher,
            time: activity.time,
            place: req.body.place,
            date: new Date(req.body.date),
            hot: activity.hot,
            comment: activity.comment
          });
        
          Activity.update(id,updateactivity,function(err){
            images(target_path).size(240).save('./public/images/minplacard/'+placard,{quality:50});
            images(target_path).size(640).save('./public/images/midplacard/'+placard,{quality:50});
            if(err){
              req.flash('error','更新错误！');
            }
          });
        }
        res.redirect('/activity/'+id);
      });
    }
  });


  app.post('/delete',function(req,res){
    var id = req.body.id;

    if(req.session.user){
      Activity.get(id,function(err,activity){
        if(err){
          res.send("err");
        }
        if(activity.publisher == req.session.user.username||req.session.user.username == 'admin'){
          Activity.delete(id,function(err){
            if(err){
              res.send("err");
            }else{
              res.send("ok");
            }
          });
        }
      });
    }
  });

  app.post('/comment',function(req,res){
    var id = req.body.id;
    var content = req.body.content;
    content = xss(content,{stripIgnoreTagBody: true});
    var date = req.body.date;
    var newComment = {
      name: req.session.user.username,
      content: content,
      date: new Date(date)
    }
    Activity.addComment(id,newComment,function(err){
      if(err){
        res.send("err");
      }else{
        res.send("ok");
      }
    });
  });


  app.get('/activity/', function(req, res){
    var search = req.query.search;
    //search = xss(search,{stripIgnoreTagBody: true});
    var page = req.query.page ? parseInt(req.query.page) : 1;
    //console.log(search);
    //console.log(page);
    Activity.getSearchTen(page,search,function(err,activitys,total){
      if(err || total == 0){
        activitys = [];
        req.flash('error','没有满足的活动~');
      }
      res.render('index',{
        activity: null,
        type: "all",
        date: "all",
        activitys: activitys,
        totalpage: Math.ceil(total/10),
        hrefLatter: '?search='+search,
        totalrecords: total,
        paging: "&page=",
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    })
  });


  app.get('/reg', checkNotLogin, function(req, res){
    res.render('reg',{
      activity: null,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

  app.post('/reg', checkNotLogin, function(req, res){
    var username = req.body.username,
        password = req.body.password,
        password_re = req.body['password-repeat'];
    username = username.replace(/(\s*)/g,'');
    if(password != password_re){
      req.flash('error','两次输入的密码不一致！');
      return res.redirect('/reg');//返回注册页
    }
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
      username: username,
      password: password,
      email: req.body.email
    });
    //检查用户名是否存在
    User.get(newUser.username, function(err, user){
      if(user){
        req.flash('error','用户已存在！请重新注册~');
        return res.redirect('/reg');
      }
      newUser.save(function(err, user){
        if(err){
          req.flash('error',err);
          return res.redirect('/reg');
        }
        req.session.user = user;
        req.flash('success','注册成功！');
        res.redirect('/');
      });
    });
  });

  app.get('/login', checkNotLogin, function(req, res){
    res.render('login',{
      activity: null,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()});
  });

  app.post('/login', checkNotLogin, function(req, res){
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('hex');
    User.get(req.body.username, function(err, user){
      if(!user){
        User.jhLogin(req.body.username, req.body.password, function(state){
          if(state == 'success'){
            var newUser = new User({
              username: req.body.username,
              password: password
              //email: req.body.email
            });
            //console.log(newUser);
            newUser.save(function(err, user){
              if(err){
                req.flash('error','注册失败');
                return res.redirect('/login');
              }
              req.session.user = user;
              req.flash('success','登录成功！');
              res.redirect('/');
            });
          }else{
            req.flash('error','登陆失败！');
            return res.redirect('/login');
          }
        });
      }else if(user.password != password){
          req.flash('error','密码错误！');
          return res.redirect('/login');
        }else{
        req.session.user = user;
        req.flash('success','登录成功！');
        res.redirect('/');
      }
    });
  });

  app.get('/logout', checkLogin, function(req, res){
    req.session.user = null;
    req.flash('success', '登出成功！');
    res.redirect('/');
  });

  app.get('/addnew', checkLogin, function(req, res){
    res.render('addnew',{
      activity: null,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

  app.post('/addnew', checkLogin, function(req, res){
    var tmp_path = req.files.placard.path;
    var picsize = req.files.placard.size;
    if(picsize > 1024*1024*2){
      req.flash('error',"海报需要小于2M");
      fs.unlink(tmp_path,function(err){
        if (err) throw err;
      });
      return res.redirect('/addnew');
    }
    var time = Date.parse(new Date());
    var placard = time+'.jpg';
    var target_path = './public/images/placard/' + placard;
    fs.rename(tmp_path, target_path, function(err){
      if (err) throw err;
      fs.unlink(tmp_path,function(){
        if (err) throw err;
      });
    });

    var detail = req.body.detail.replace(/\r\n/g,"<br/>");
    detail = xss(detail,{stripIgnoreTagBody: true});
    var newActivity = new Activity({
      title: req.body.title,
      type: req.body.type,
      detail: detail,
      placard: placard,
      publisher: req.session.user.username,
      time: time,
      place: req.body.place,
      date: new Date(req.body.date),
      hot: 0,
      comment: []
    });
    newActivity.save(function(err,activity){
      if(err){
        req.flash('error',err);
        return res.redirect('/addnew');
      }
      images(target_path).size(240).save('./public/images/minplacard/'+placard,{quality:50});
      images(target_path).size(640).save('./public/images/midplacard/'+placard,{quality:50});
      req.flash('success','发表成功！');
      res.redirect('/');
    });
  });


  app.get('/about', function(req, res){
    res.render('about',{
      activity: null,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

  app.get('/suggest', function(req, res){
    Suggestion.get(function(err,suggestions){
      if(err){
        suggestions = [];
        req.flash('error','err');
      }
      res.render('suggest',{
        activity: null,
        suggestions:suggestions,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });

  app.post('/suggest', function(req, res){
    var suggest = req.body.suggest.replace(/\r\n/g,"<br/>");
    suggest = xss(suggest,{stripIgnoreTagBody: true});
    var newSuggestion = new Suggestion({
      name: req.session.user.username,
      suggest: suggest
    });
    newSuggestion.save(function(err){
      if(err){
        req.flash('error','发送失败！');
        return res.redirect('/suggest');
      }
      req.flash('success','发送成功！');
      res.redirect('/suggest');
    });
  });



  app.use(function (req, res) {
    res.render("404");
  });
};


function checkLogin(req, res, next){
  if(!req.session.user){
    req.flash('error', '未登录！');
    res.redirect('/login');
  }
  next();
}
function checkNotLogin(req, res, next){
  if(req.session.user){
    req.flash('error', '已登录！');
    res.redirect('back');
  }
  next();
}