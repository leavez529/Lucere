//引入express模块
const express = require("express");
//定义路由级中间件
const router = express.Router();
//七牛模块
const qiniu = require("qiniu")

const UserService = require("../service/UserService")
const MomentService = require("../service/MomentService")

userService = new UserService()
momentService = new MomentService()


//获取七牛云上传凭证
router.get("/getToken",(req,res)=>{
    var AK = 'qutlMjRTw_V_b1eqguNZU-JlgMPlL1HWDZPlMuFD'
    var SK = 'f_s3foicyAplP60EWZRUq3DBJSIZAhsqvgH80yLj'
    var mac = new qiniu.auth.digest.Mac(AK, SK);
    var options = {
        scope: 'midorilia',
        returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken=putPolicy.uploadToken(mac);
    res.send(uploadToken)
})


//用户功能
router.post("/register/:account/:name/:password",(req,res)=>{
    console.log(req.params);
     userService.createUser(req.params.account,req.params.name,req.params.password,(status)=>{
         res.send(status);
     })
})

router.get("/checkAccount/:account",(req,res)=>{
    userService.checkAccount(req.params.account,(status)=>{
        res.send(status);
    });
})

router.get("/login/:account/:password",(req,res)=>{
    userService.login(req.params.account,req.params.password,(status)=>{
        res.send(status)
    })
})

router.get("/subscribe/:ingId/:edId",(req,res)=>{
    userService.subscribe(req.params.ingId,req.params.edId,(status)=>{
        res.send(status);
    })
}
)

router.get("/cancelSubscribe/:ingId/:edId",(req,res)=>{
    userService.cancelSubscribe(req.params.ingId,req.params.edId,(status)=>{
        res.send(status);
    })
})

router.post("/searchUser",(req,res)=>{
    userService.searchUser(req.body.search,(result)=>{
        console.log(result)
        res.send(result);
    })
})

router.get("/getUserInfo/:userId",(req,res)=>{
    userService.getUserInfo(req.params.userId,(result)=>{
        console.log(result);
        res.send(result);
    })
})

router.get("/getFans/:userId",(req,res)=>{
    userService.getFans(req.params.userId,(result)=>{
        console.log(result);
        res.send(result);
    })
})

router.get("/getSubscribe/:userId",(req,res)=>{
    userService.getSubscribe(req.params.userId,(result)=>{
        console.log(result);
        res.send(result);
    })
})

router.get("/getUserMomentNum/:userId",(req,res)=>{
    userService.getUserMomentNum(req.params.userId,(result)=>{
        console.log(result);
        res.send(result);
    })
})

router.get("/checkSubscribe/:ingId/:edId",(req,res)=>{
    userService.checkSubscribe(req.params.ingId,req.params.edId,(result)=>{
        console.log(result);
        res.send(result);
    })
})

router.post("/cancelMessage/:messageId",(req,res)=>{
    userService.cancelMessage(req.params.messageId,(result)=>{
        console.log(result);
        res.send(result);
    })
})

router.get("/getMessages/:userId",(req,res)=>{
    userService.getMessages(req.params.userId,(result)=>{
        console.log(result);
        res.send(result);
    })
})

router.post("/deleteMessage/:messageId",(req,res)=>{
    userService.deleteMessage(req.params.messageId,(result)=>{
        console.log(result);
        res.send(result);
    })
})

router.post("/deleteAllMessages/:userId",(req,res)=>{
    userService.deleteAllMessages(req.params.userId,(result)=>{
        console.log(result);
        res.send(result);
    })
})

router.get("/getMessageNum/:userId",(req,res)=>{
    userService.getMessageNum(req.params.userId,(result)=>{
        console.log(result);
        res.send(result[0]["COUNT(*)"])
    })
})

router.post("/updateInfo",(req,res)=>{
    console.log(req.body)
    userService.updateInfo(req.body.userId,req.body.name,req.body.tel,req.body.mail,req.body.website,req.body.intro,(result)=>{
        console.log(result);
        res.send(result)
    })
})

router.get("/getRecommendFans/:userId",(req,res)=>{
    userService.getRecommendFans(req.params.userId,(result)=>{
        console.log(result)
        res.send(result)
    })
})

router.get("/getSubscribeMessages/:userId",(req,res)=>{
    userService.getSubscribeMessages(req.params.userId,(result)=>{
        console.log(result)
        res.send(result)
    })
})

router.post("/updateAvatar/",(req,res)=>{
    userService.updateAvatar(req.body.userId,req.body.avatar,(result)=>{
        console.log(result)
        res.send(result)
    })
})

//动态功能
router.get("/getMoment/:momentId",(req,res)=>{
    momentService.getMoment(req.params.momentId,(result)=>{
        console.log(result);
        res.send(result);
    })
})

router.get("/getIndexMoments/:userId",(req,res)=>{
    momentService.getIndexMoments(req.params.userId,(result)=>{
        console.log(result);
        res.send(result);
    })
})

router.get("/getMomentUser/:momentId",(req,res)=>{
    momentService.getMomentUser(req.params.momentId,(result)=>{
        console.log(result);
        res.send(result);
    })
})

router.get("/getIndexComments/:momentId",(req,res)=>{
    momentService.getIndexComments(req.params.momentId,(result)=>{
        console.log(result);
        res.send(result);
    })
})

router.get("/getMomentComments/:momentId",(req,res)=>{
    momentService.getMomentComments(req.params.momentId,(result)=>{
        console.log(result);
        res.send(result);
    })
})
router.get("/getUserMoments/:userId",(req,res)=>{
    momentService.getUserMoments(req.params.userId,(result)=>{
        res.send(result);
    }
    )
})

router.get("/getMomentUser/:momentId",(req,res)=>{
    momentService.getMomentUser(req.params.momentId,(result)=>{
        res.send(result);
    })
})

router.get("/getMomentPics/:momentId",(req,res)=>{
    momentService.getMomentPics(req.params.momentId,(result)=>{
        res.send(result);
    })
})

router.post("/createMoment",(req,res)=>{
    momentService.createMoment(req.body.userId,req.body.content,req.body.type,(result)=>{
        res.send(result);
    })
})

router.post("/updatePicsNum/:momentId",(req,res)=>{
    momentService.updatePicsNum(req.params.momentId,(result)=>{
        res.send(result);
    })
})

router.post("/addPictures",(req,res)=>{
    console.log(req.body)
    momentService.addPictures(req.body.momentId,req.body.resource,req.body.flag,(result)=>{
         console.log(result);
         res.send(result);
     })
})

router.post("/commentMoment",(req,res)=>{
    momentService.commentMoment(req.body.userId,req.body.momentId,req.body.content,(result)=>{
        console.log(result)
        res.send(result);
    })
})

router.post("/loveMoment/:userId/:momentId",(req,res)=>{
    momentService.loveMoment(req.params.userId,req.params.momentId,(result)=>{
        console.log(result);
        res.send(result);
    })
})

router.post("/unloveMoment/:userId/:momentId",(req,res)=>{
    momentService.unloveMoment(req.params.userId,req.params.momentId,(result)=>{
        console.log(result);
        res.send(result);
    })
})

router.get("/getMyMoments/:userId",(req,res)=>{
    momentService.getMyMoments(req.params.userId,(result)=>{
        console.log(result);
        res.send(result);
    })
})

router.post("/deleteMoment/:momentId",(req,res)=>{
    momentService.deleteMoment(req.params.momentId,(result)=>{
        console.log(result);
        res.send(result);
    })
})

router.get("/checkLove/:userId/:momentId",(req,res)=>{
    momentService.checkLove(req.params.userId,req.params.momentId,(result)=>{
        console.log(result);
        res.send(result);
    })
})

router.get("/getCover/:momentId",(req,res)=>{
    momentService.getCover(req.params.momentId,(result)=>{
        console.log(result);
        res.send(result);
    })
})

router.get("/getCovers/:userId",(req,res)=>{
    momentService.getCovers(req.params.userId,(result)=>{
        console.log(result);
        res.send(result);
    })
})

router.post("/relateTopic",(req,res)=>{
    momentService.relateTopic(req.body.momentId,req.body.topic,(result)=>{
        console.log(result);
        res.send(result);
    })
})

router.get("/getTopics/:momentId",(req,res)=>{
    momentService.getTopics(req.params.momentId,(result)=>{
        console.log(result)
        res.send(result)
    })
})

router.post("/searchTopics/",(req,res)=>{
    momentService.searchTopics(req.body.search,(result)=>{
        console.log(result)
        res.send(result)
    })
})

router.get("/getTopic/:topic",(req,res)=>{
    var topic = '#'+req.params.topic
    momentService.getTopic(topic,(result)=>{
        console.log(result)
        res.send(result)
    })
})

router.get("/getTopicMomentsByTime/:topicId/:page",(req,res)=>{
    momentService.getTopicMomentsByTime(req.params.topicId,req.params.page,(result)=>{
        console.log(result)
        res.send(result)
    })
})

router.get("/getTopicMomentsByLikes/:topicId/:page",(req,res)=>{
    momentService.getTopicMomentsByLikes(req.params.topicId,req.params.page,(result)=>{
        console.log(result)
        res.send(result)
    })
})

router.get("/checkFollow/:userId/:topicId",(req,res)=>{
    momentService.checkFollow(req.params.userId,req.params.topicId,(result)=>{
        console.log(result)
        res.send(result)
    })
})

router.get("/follow/:userId/:topicId",(req,res)=>{
    momentService.follow(req.params.userId,req.params.topicId,(result)=>{
        console.log(result)
        res.send(result)
    })
})

router.get("/cancelFollow/:userId/:topicId",(req,res)=>{
    momentService.cancelFollow(req.params.userId,req.params.topicId,(result)=>{
        console.log(result)
        res.send(result)
    })
})

router.get("/getUserFollowMoments/:userId/:page",(req,res)=>{
    momentService.getUserFollowMoments(req.params.userId,req.params.page,(result)=>{
        console.log(result)
        res.send(result)
    })
})

router.get("/getUserMomentTopic/:userId/:momentId",(req,res)=>{
    momentService.getUserMomentTopic(req.params.userId,req.params.momentId,(result)=>{
        console.log(result)
        res.send(result)
    })
})
module.exports = router;

