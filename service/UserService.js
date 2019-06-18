//引入express模块
const express = require("express");

//引入cookie
const cookie = require('cookie-parser');

//mysql数据库连接
const mysql = require("mysql");

//引入moment
const moment = require("moment")


var connection = mysql.createConnection({
    host:"nanasenishino.cn",
    user:"root",
    password:"gccant@dao6Ihao!",
    database:"lucere",
    port:"3306",
    multipleStatements:true,
})

function UserService(){
    this.createUser = function(account,name,password,callback){
        var sql = "INSERT INTO User(account,name,password) VALUES(?,?,?) "
        var params = [account,name,password]
        connection.query(sql,params,function(err,result){
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }else{
                callback.call(this,result)
            }
        })
    }

    this.checkAccount = function(account, callback){
        var sql = "SELECT COUNT(*) FROM User WHERE account = ?"
        var params = [account]
        console.log(account)
        connection.query(sql,params,function(err,result){
            if(err){
                console.log(err)
                callback.call(this, "failure");
            }
            else{
                console.log(result[0]["COUNT(*)"]);
                if(result[0]["COUNT(*)"]==0){
                    callback.call(this, "no repeat");
                }
                else{
                    callback.call(this, "repeat");
                }
            }
        })
    }

    this.login = function(account,password,callback){
        var sql = "SELECT * FROM User WHERE account = ?";
        var params = [account];
        console.log(account)
        console.log(password)
        connection.query(sql,params,function(err,result){
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                console.log(result);
                if(result.length==0){
                    callback.call(this, "no user");
                }
                else{
                    if(result[0]["password"] == password){
                        callback.call(this,result);
                    }
                    else{
                        callback.call(this,"wrong");
                    }
                }
            }
        })
    }

    this.subscribe = function(ingId,edId,callback){
        var sql = "INSERT INTO Subscribe(ing_id,ed_id) VALUES(?,?)"
        var params = [ingId,edId];
        connection.query(sql,params,function(err,result){
            if(err){
                console.log(err)
                callback.call(this,"failure");
            }
            else{
                //callback.call(this,"success")
                var date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                var sql1 = "UPDATE User SET fans = fans + 1 WHERE id = " + edId + ";";
                var sql2 = "UPDATE User SET subscribe = subscribe + 1 WHERE id = "+ ingId + ";";
                var sql3 = "INSERT INTO Message(ed_id,ing_id,type,time) VALUES(?,?,1,?);"
                var params_ = [edId,ingId,date]
                connection.query(sql1+sql2+sql3,params_,function(err,result){
                    if(err){
                        console.log(err)
                        callback.call(this,"failure");
                    }
                    else{
                        callback.call(this,"success");
                    }
                })
            }
        }) 
    }

    this.cancelSubscribe = function(ingId,edId,callback){
        var sql = "DELETE FROM Subscribe WHERE ing_id = ? AND ed_id = ?";
        var params = [ingId,edId];
        connection.query(sql,params,function(err,result){
            console.log(result);
            console.log(err)
            if(result.affectedRows == 0){
                callback.call(this,"failure");
            }
            else{
                var sql1 = "UPDATE User SET fans = fans - 1 WHERE id = " + edId + ";";
                var sql2 = "UPDATE User SET subscribe = subscribe - 1 WHERE id = "+ ingId + ";";
                var sql3 = "DELETE FROM Message WHERE type = 1 AND ed_id = ? AND ing_id = ? ;"
                var params = [edId,ingId]
                connection.query(sql1+sql2+sql3,params,function(err,result){
                    if(err){
                        console.log(err)
                        callback.call(this,"failure");
                    }
                    else{
                        callback.call(this,"success");
                    }
                })
            }
        })
    }

    this.searchUser = function(search,callback){
        var sql = "SELECT * FROM User WHERE account LIKE '%"+search+"%' or name LIKE '%"+search+"%' order by fans desc"
        connection.query(sql,function(err,result){
            if(err){
                console.log(err)
                callback.call(this,"failure");
            }
            else{
                callback.call(this,result)
            }
        })
    }

    this.getUserInfo = function(userId,callback){
        var sql = "SELECT * FROM User WHERE id =" + userId;
        connection.query(sql,function(err,result){
            if(err){
                console.log(err)
                callback.call(this,"failure");
            }
            else{
                callback.call(this,result);
            }
        })
    }

    this.getFans = function(userId,callback){
        var sql = "SELECT * FROM User, Subscribe WHERE id = ing_id AND ed_id ="+userId;
        connection.query(sql,function(err,result){
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                callback.call(this,result)
            }
        })
    }

    this.getSubscribe = function(userId,callback){
        var sql = "SELECT * FROM User, Subscribe WHERE id = ed_id AND ing_id = "+userId;
        connection.query(sql,function(err,result){
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                callback.call(this,result)
            }
        })
    }

    this.checkSubscribe = function(ingId,edId,callback){
        if(ingId == edId){
            callback.call(this,"myself")
        }
        else{
            var sql = "SELECT COUNT(*) FROM Subscribe WHERE ed_id = ? AND ing_id = ?";
            var params = [edId,ingId]
            connection.query(sql,params,function(err,result){
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                if(result[0]["COUNT(*)"]==0){
                    callback.call(this,"no")
                }
                else if(result[0]["COUNT(*)"]==1){
                    callback.call(this,"yes")
                }
            }
        })
        }  
    }

    this.cancelMessage = function(messageId,callback){
        var sql = "DELETE FROM Message WHERE id = "+messageId;
        connection.query(sql,function(err,result){
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                callback.call(this,"success");
            }
        })
    }

    this.getUserMomentNum = function(userId,callback){
        var sql = "SELECT COUNT(*) FROM Moment WHERE user_id = "+ userId +";";
        var sql2 = "UPDATE User SET moments = (SELECT COUNT(*) FROM Moment WHERE user_id = ?) WHERE id = ?;"
        var params = [userId,userId]
        connection.query(sql+sql2,params,function(err,result){
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                callback.call(this,result);
            }
        })
    }

    this.getMessages = function(userId,callback){
        var sql = "SELECT m.id id, m.ing_id ing_id, m.type type, m.time time, m.content content, m.moment_id moment_id, u.account account, u.avatar \
                FROM Message m, User u \
                WHERE m.ed_id = ? AND m.ing_id = u.id AND m.ing_id != ? \
                ORDER BY id DESC"
        var params = [userId,userId]
        connection.query(sql,params,function(err,result){
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                callback.call(this,result)
            }
        })
    }

    this.deleteMessage = function(messageId,callback){
        var sql = "DELETE FROM Message WHERE id = "+messageId;
        connection.query(sql,function(err,result){
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                callback.call(this,result)
            }
        })
    }

    this.deleteAllMessages = function(userId,callback){
        var sql = "DELETE FROM Message WHERE ed_id = " + userId;
        connection.query(sql,function(err,result){
            if(err){
                console.log(err)
                callback.call(this,"failure");
            }
            else{
                callback.call(this,result);
            }
        })
    }

    this.getMessageNum = function(userId,callback){
        var sql = "SELECT COUNT(*) FROM Message WHERE ed_id = " + userId;
        connection.query(sql,function(err,result){
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                callback.call(this,result)
            }
        })
    }

    this.updateInfo = function(userId, name, tel, mail, website, intro, callback){
        var sql = "UPDATE User SET name = ?,tel = ?, email = ?, website = ?, intro = ? WHERE id = ?"
        
        var params = [name,tel,mail,website,intro,userId]
        connection.query(sql,params,function(err,result){
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                callback.call(this,result)
            }
        })
    }


    this.getRecommendFans = function(userId,callback){
        var sql = "SELECT id, account, avatar FROM User, Subscribe WHERE id = ing_id AND ed_id = ? AND not exists(\
            SELECT 1 FROM Subscribe WHERE id = ed_id AND ing_id = ?)"
        var params = [userId,userId]
        connection.query(sql,params,function(err,result){
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                callback.call(this,result)
            }
        })
    }

    this.getSubscribeMessages = function(userId,callback){
        var sql = "SELECT m.id id, m.ing_id ing_id, m.ed_id ed_id, m.type type, m.time time, m.content content, m.moment_id moment_id, u.account account, u.avatar avatar, u2.account ed_account \
        FROM Message m, User u, User u2, Subscribe s \
        WHERE s.ing_id = ? AND s.ed_id = m.ing_id AND m.ing_id = u.id AND m.ed_id = u2.id \
        ORDER BY id DESC LIMIT 10"
        var params = [userId]
        connection.query(sql,params,function(err,result){
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                callback.call(this,result)
            }
        })
    }

    this.updateAvatar = function(userId,avatar,callback){
        var sql ="UPDATE User SET avatar = ? WHERE id = ?"
        var params = [avatar,userId]
        connection.query(sql,params,function(err,result){
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                callback.call(this,"success")
            }
        })
    }
}
module.exports = UserService;