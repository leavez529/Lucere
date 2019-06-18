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

function MomentService(){
    this.getMoment = function(momentId,callback){
        connection.query("SELECT * FROM Moment WHERE id = "+momentId,(err,result)=>{
            if(err){
                console.log(err)
                callback.call(this,"faiulre")
            }
            else{
                console.log(err)
                callback.call(this,result)
            }
        })
    }

    this.getIndexMoments = function(userId,callback){
        var sql = "SELECT DISTINCT m.id, m.content, m.user_id, m.likes, m.time, m.comments, m.pictures, m.type \
               FROM Subscribe s, Moment m \
               WHERE s.ing_id = ? and s.ed_id = m.user_id or m.user_id = ? ORDER BY m.id DESC LIMIT 10 "
        var params = [userId,userId]
        connection.query(sql,params,(err,result)=>{
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                callback.call(this,result)
            }
        })
    }

    this.getUserMoments = function(userId,callback){
        var sql = "SELECT * FROM Moment WHERE user_id = "+userId+" ORDER BY id DESC";
        connection.query(sql,(err,result)=>{
            if(err){
                console.log(err)
                callback.call(this,"failure");
            }
            else{
                callback.call(this,result);
            }
        })
    }

    this.getCover = function(momentId,callback){
        var sql = "SELECT * FROM MomentPicture WHERE moment_id = ? AND flag = 1"
        var params = [momentId]
        connection.query(sql,params,(err,result)=>{
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                callback.call(this,result)
            }
        })
    }

    this.getCovers = function(userId,callback){
        var sql = "SELECT m.id moment_id, p.picture cover FROM Moment m, MomentPicture p WHERE m.id = p.moment_id AND p.flag = 1 AND m.user_id = ? ORDER BY moment_id DESC"
        var params = [userId]
        connection.query(sql,params,(err,result)=>{
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                callback.call(this,result)
            }
        })
    }

    this.getMomentUser = function(momentId,callback){
        var sql = "SELECT user_id,account,name,avatar FROM User u, Moment m WHERE u.id = m.user_id and m.id = "+momentId;
        connection.query(sql,(err,result)=>{
            if(err){
                console.log(err)
                callback.call(this,"failure");
            }
            else{
                callback.call(this,result);
            }
        })
    }

    this.getMomentPics = function(momentId,callback){
        var sql = "SELECT * FROM MomentPicture WHERE moment_id = "+momentId;
        connection.query(sql,(err,result)=>{
            if(err){
                console.log(err)
                callback.call(this,"failure");
            }
            else{
                callback.call(this,result);
            }
        })
    }

    this.getIndexComments = function(momentId,callback){
        var sql = "SELECT c.id id, u.id user_id, u.account,c.content FROM Comment c,User u WHERE c.moment_id = ? AND c.user_id = u.id ORDER BY c.id DESC LIMIT 2"
        var params = [momentId]
        connection.query(sql,params,(err,result)=>{
            if(err){
                console.log(err)
                callback.call(this,"failure");
            }
            else{
                callback.call(this,result);
            }
        })
    }

    this.getMomentComments = function(momentId,callback){
        var sql = "SELECT c.id id, u.id user_id,u.account, u.avatar, c.content,c.time FROM Comment c,User u WHERE c.moment_id = ? AND c.user_id = u.id ORDER BY c.id DESC"
        var params = [momentId]
        connection.query(sql,params,(err,result)=>{
            if(err){
                console.log(err)
                callback.call(this,"failure");
            }
            else{
                callback.call(this,result);
            }
        })
    }

    this.commentMoment = function(userId,momentId,content,callback){
        var date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        var sql = "INSERT INTO Comment(user_id, moment_id, content, time) VALUES(?,?,?,?)"
        var params = [userId,momentId,content,date]
        connection.query(sql,params,(err,result)=>{
            if(err){
                console.log(err)
                callback.call(this,"failure");
            }
            else{
                connection.query("SELECT * FROM Moment WHERE id = " + momentId, (err,result)=>{
                    if(err){
                        console.log(err)
                        callback.call(this,"failure")
                    }
                    var edId = result[0]["user_id"]
                    var sql1 = "UPDATE Moment SET comments = comments + 1 WHERE id = "+momentId+";";
                    var sql2 = "INSERT INTO Message(ed_id,ing_id,type,content,moment_id,time) VALUES(?,?,2,?,?,?);"
                    var params_ = [edId,userId,content,momentId,date]
                    connection.query(sql1+sql2,params_,(err,result)=>{
                        if(err){
                            console.log(err)
                            callback.call(this,"failure");
                        }else{
                            callback.call(this,"success")
                        }
                    })
                })
            }
        })
    }

    this.loveMoment = function(userId,momentId,callback){
        var date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        var sql = "INSERT INTO MomentLove(user_id, moment_id) VALUES(?,?)"
        var params = [userId, momentId];
        connection.query(sql,params,(err,result)=>{
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }else{
                connection.query("SELECT * FROM Moment WHERE id = " + momentId, (err,result)=>{
                    if(err){
                        console.log(err)
                        callback.call(this,"failure")
                    }
                    var edId = result[0]["user_id"]
                    var sql1 = "UPDATE Moment SET likes = likes + 1 WHERE id = "+momentId+";";
                    var sql2 = "INSERT INTO Message(ed_id,ing_id,type,moment_id,time) VALUES(?,?,3,?,?);"
                    var params_ = [edId, userId,momentId,date]
                    connection.query(sql1+sql2,params_,(err,result)=>{
                        if(err){
                            console.log(err)
                            callback.call(this,"failure");
                        }else{
                            callback.call(this,"sucesss");
                        }
                    })
                })          
            }
        })
    }

    this.unloveMoment = function(userId,momentId,callback){
        var sql = "DELETE FROM MomentLove WHERE user_id = ? and moment_id = ?"
        var params = [userId, momentId];
        connection.query(sql,params,(err,result)=>{
            if(err){
                console.log(err);
                callback.call(this,"failure")
            }else{
                var sql1 = "UPDATE Moment SET likes = likes - 1 WHERE id = "+momentId+";";
                var sql2 = "DELETE FROM Message WHERE type = 3 AND ing_id = ? AND moment_id = ? ;"
                params = [userId,momentId]
                connection.query(sql1+sql2,params,(err,result)=>{
                    if(err){
                        console.log(err);
                        callback.call(this,"failure");
                    }else{
                        callback.call(this,"sucesss");
                    }
                })
            }
        })
    }

    this.createMoment = function(userId, content, type, callback){
        var date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        var sql = "INSERT INTO Moment(user_id,content,time,type) VALUES(?,?,?,?);";
        var params = [userId,content,date,type]
        connection.query(sql,params,(err,result)=>{
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                callback.call(this,result)
            }
        })
    }

    this.checkLove = function(userId,momentId,callback){
        var sql = "SELECT COUNT(*) FROM MomentLove WHERE user_id = ? AND moment_id = ?";
        var params = [userId,momentId]
        connection.query(sql,params,(err,result)=>{
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

    this.addPictures = function(momentId, resource, flag, callback){
        var sql1 = "UPDATE Moment SET pictures = pictures + 1 WHERE id = "+momentId+";";
        var sql2 = "INSERT INTO MomentPicture(moment_id,picture,flag) VALUES(?,?,?);"
        var params = [momentId,resource,flag]
        connection.query(sql1+sql2,params,(err,result)=>{
            if(err){
                console.log(err);
                callback.call(this,"failure")
            }
            else{
                callback.call(this,result);
            }
        })
    }

    this.getMyMoments = function(userId,callback){
        var sql = "SELECT * FROM Moment WHERE user_id = "+userId+" ORDER BY id DESC";
        connection.query(sql,(err,result)=>{
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                callback.call(this,result);
            }
        })
    }

    this.updatePicsNum = function(momentId,callback){
        var sql = "UPDATE Moment SET pictures = (SELECT COUNT(*) FROM MomentPicture WHERE moment_id = ?)"
        var params = [momentId]
        connection.query(sql,(err,result)=>{
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                callback.call(this,result);
            }
        })
    }

    this.deleteMoment = function(momentId,callback){
        var sql1 = "DELETE FROM Moment WHERE id = " + momentId + ";";
        var sql2 = "DELETE FROM MomentPicture WHERE moment_id = " + momentId + ";";
        connection.query(sql1+sql2,(err,result)=>{
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                callback.call(this,result)
            }
        })
    }

    this.relateTopic = function(momentId,topic,callback){
        var sql1 = "SELECT * FROM Topic WHERE name = ?"
        var params = [topic]
        connection.query(sql1,params,(err,result)=>{
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                console.log(result)
                if(result.length == 0){
                    var sql2 = "INSERT INTO Topic(name) VALUES(?)"
                    var params1 = [topic]
                    connection.query(sql2,params1,(err,result)=>{
                        if(err){
                            console.log(err)
                            callback.call(this,"failure")
                        }
                        else{
                            var insertId = result.insertId;
                            var sql3 = "INSERT INTO About(moment_id, topic_id) VALUES(?,?) ;"
                            var sql4 = "UPDATE Topic SET total = total + 1 WHERE id = ? ;"
                            var params2 = [momentId,insertId,insertId]
                            connection.query(sql3+sql4,params2,(err,result)=>{
                                if(err){
                                    console.log(err)
                                    callback.call(this,"failure")
                                }
                                else{
                                    callback.call(this,"success")
                                }
                            })
                        }
                    })
                }
                else{
                    var topicId = result[0].id
                    var sql2 = "INSERT INTO About(moment_id, topic_id) VALUES(?,?);"
                    var sql3 = "UPDATE Topic SET total = total + 1 WHERE id = ? ;"
                    var params1 = [momentId,topicId,topicId]
                    connection.query(sql2+sql3,params1,(err,result)=>{
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
        })
    }

    this.getTopics = function(momentId,callback){
        var sql = "SELECT * FROM Topic t, About a WHERE a.moment_id = ? AND a.topic_id = t.id ";
        var params = [momentId]
        connection.query(sql,params,(err,result)=>{
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                callback.call(this,result)
            }
        })
    }

    this.searchTopics = function(search,callback){
        var sql = "SELECT * FROM Topic WHERE name like '%"+search+"%' ORDER BY total DESC"
        connection.query(sql,(err,result)=>{
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                callback.call(this,result)
            }
        })
    }

    this.getTopic = function(topic,callback){
        var sql = "SELECT * FROM Topic WHERE name = ?"
        var params = [topic]
        connection.query(sql,params,(err,result)=>{
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                callback.call(this,result)
            }
        })
    }

    this.getTopicMomentsByTime = function(topicId, page, callback){
        var item = page*20
        var sql = "SELECT * From Moment, About WHERE topic_id = ? AND moment_id = id ORDER BY id DESC "
        var params = [topicId]
        connection.query(sql,params,(err,result)=>{
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                callback.call(this,result)
            }
        })
    }

    this.getTopicMomentsByLikes = function(topicId, page, callback){
        var item = page*20
        var sql = "SELECT * From Moment, About WHERE topic_id = ? AND moment_id = id ORDER BY likes DESC"
        var params = [topicId]
        connection.query(sql,params,(err,result)=>{
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                callback.call(this,result)
            }
        })
    }

    this.checkFollow = function(userId,topicId,callback){
        var sql = "SELECT COUNT(*) FROM Follow WHERE user_id = ? and topic_id = ?"
        var params = [userId,topicId]
        connection.query(sql,params,(err,result)=>{
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                if(result[0]["COUNT(*)"] == 0){
                    callback.call(this,"no")
                }
                else{
                    callback.call(this,"yes")
                }
            }
        })
    }

    this.follow = function(userId,topicId,callback){
        var sql = "INSERT INTO Follow(user_id,topic_id) VALUES(?,?)"
        var params = [userId,topicId]
        connection.query(sql,params,(err,result)=>{
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                callback.call(this,"success")
            }
        })
    }

    this.cancelFollow = function(userId,topicId,callback){
        var sql = "DELETE FROM Follow WHERE user_id = ? AND topic_id = ?"
        var params = [userId,topicId]
        connection.query(sql,params,(err,result)=>{
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                callback.call(this,"success")
            }
        })
    }

    this.getUserFollowMoments = function(userId,page,callback){
        var item = page*7
        var sql = "SELECT m.id, m.content, m.user_id, m.likes, m.comments, m.pictures, m.type FROM Moment m, About a, Follow f \
                    WHERE f.user_id = ? AND f.topic_id = a.topic_id AND a.moment_id = m.id \
                    ORDER BY m.id DESC LIMIT ?,7"
        var params = [userId, item]
        connection.query(sql,params,(err,result)=>{
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                callback.call(this,result)
            }
        })
    }

    this.getUserMomentTopic = function(userId,momentId,callback){
        var sql = "SELECT * FROM Topic t, About a, Follow f\
                    WHERE f.user_id = ? AND f.topic_id = a.topic_id AND a.moment_id = ? AND a.topic_id = t.id\
                    LIMIT 1"
        var params = [userId,momentId]
        connection.query(sql,params,(err,result)=>{
            if(err){
                console.log(err)
                callback.call(this,"failure")
            }
            else{
                callback.call(this,result)
            }
        })
    }


}

module.exports = MomentService;