<template>
    <div>
        <Layout>
            <Header class="guide">
            <Row>
                <Col span="2"><router-link :to="{path:'/index'}"><Icon size="40" type="ios-aperture-outline" color="white" /></router-link></Col>
                <Col span="7">
                    <Poptip padding="0" trigger="click" v-model="showSearch" placement="bottom" width="250">
                        <Input v-model="search" clearable size="large" @on-enter="goSearch" placeholder="探索Lucere" class="search" />
                        <div class="result" slot="content">
                            <Row v-for="res in topicRes" :key="res.id" class="resuser">
                                <router-link :to="'/topic/'+res.name.substring(1)">
                                <Col offset="1" span="5">
                                    <h1 style="padding-left: 10px;
                                    font-size: 30px;
                                    opacity: 0.6;
                                    position: relative;
                                    bottom: 3px;">#</h1> 
                                </Col>
                                <Col span="17" offset="1">
                                    <h3>{{res.name}}</h3>
                                    <span>{{res.total}} 动态</span>
                                </Col>
                                </router-link>
                            </Row>
                            <Row v-for="res in searchRes" :key="res.id" class="resuser">
                                <a @click="goProfile(res.id)">
                                <Col offset="1" span="5">
                                    <Avatar size="large" :src="res.avatar"/> 
                                </Col>
                                <Col span="17" offset="1">
                                    <h3>{{res.account}}</h3>
                                    <span>{{res.name}}</span>
                                </Col>
                                </a>
                            </Row>
                        </div>
                    </Poptip>
                </col>
                <Col span="4" offset="10">
                <Row>
                    <Col offset="6" span="6">
                    <router-link to="/discover">
                    <Icon type="md-globe" size="33" class="navi"/>
                    </router-link>
                    </Col>
                    <Col span="6">
                    <Poptip padding="0" placement="bottom" width="350">
                        <a>
                            <Icon type="md-heart-outline" size="33" class="navi"/>
                            <i v-if="!messages.length === 0" class="red-point"></i>
                        </a>
                        <div class="message-box" slot="content">
                            <div class="no-message" v-if="messages.length === 0">
                                <span>当前无新消息</span>
                            </div>
                            <Row v-for="(message,index) in messages" :key="message.id" class="message-one" type="flex" justify="start">
                                <Col span="4">
                                    <Avatar size="large" :src="message.avatar"/> 
                                </Col>
                                <Col span="17">
                                <router-link :to="'/myprofile/'+message.ing_id">
                                    <div v-if="message.type === 1">
                                    <h3 >{{message.account}} 关注了您</h3>
                                    </div>
                                </router-link>
                                <a @click="showMessageMoment(message.moment_id)">
                                    <div v-if="message.type === 2">
                                    <h3 >{{message.account}} 评论了您的动态</h3>
                                    <span style="white-space:pre-line">{{message.content}}</span>
                                    </div>
                                </a>
                                <a @click="showMessageMoment(message.moment_id)">
                                    <div v-if="message.type === 3">
                                    <h3 >{{message.account}} 点赞了您的动态</h3>
                                    </div>
                                </a>
                                <h4>{{message.time|dateFrm}}</h4>
                                </Col>
                                <Col span="3">
                                    <a @click="deleteMessage(message.id,index)"><Icon type="md-close close" size="25"></Icon></a>        
                                </Col>
                            </Row>
                        </div>
                        <div style="padding:10px 15px;" slot="content">
                            <Button type="primary" @click="deleteAllMessages()" long style="font-weight:bold;font-size:13px;">全部已读</Button>
                        </div>
                    </Poptip>
                    </Col>
                    <Col span="6">
                    <a @click="goProfile(visitId)">
                    <Icon type="md-person" size="33" class="navi"/>
                    </a>
                    </Col>
                </Row>              
                </Col>
            </Row>
            </Header>
            </Layout>
            <transition name="fade">
                    <Row v-show="smallheader" type="flex" justify="start" align="middle" class="small-header">
                        <div class="smallavatar" :style="{backgroundImage:'url('+userInfo.avatar+')'}"></div>
                        <div class="small-info">
                            <h2>{{userInfo.account}}</h2>
                            <button v-if="relation==='yes'" class="sdesign yes-subscribe" @click="buttonSubscribe($event,userInfo.id)" >已关注</button>
                            <button v-else-if="relation==='no'" class="sdesign no-subscribe" @click="buttonSubscribe($event,userInfo.id)" >关注</button>
                            <br/>
                            <h3>{{userInfo.name}}</h3>
                            <span class="number">{{userInfo.moments}}</span><span class="text">动态</span>
                            <a class="clearLink" @click="seeFans"><span class="number">{{userInfo.fans}}</span></a><span class="text">粉丝</span>
                            <a class="clearLink" @click="seeSubscribe"><span class="number">{{userInfo.subscribe}}</span></a><span class="text">正在关注</span>
                        </div>
                    </Row>
            </transition>
            <Content>
                <div class = "moment-detail">
                    <el-dialog
                        :visible.sync="moment"
                        :show-close="false"
                        @opened="resetBigPics"
                        :center="false"
                        width="80%"
                        class="dialog"
                        style="padding:0px;z-index:1020;"
                        >
                        <Row>
                        <Col span="17">
                        <div v-if="detailIndex.type === 0" class="big-pic-box adjust">
                        <el-carousel height="600px" :autoplay="false" trigger="click" indicator-position="none"  arrow="hover">
                            <el-carousel-item v-for="pic in detailPictures" :key="pic.picture">
                                <img class="resetBigPic" :src="pic.picture" crossOrigin="anonymous"/>
                            </el-carousel-item>          
                        </el-carousel>
                        </div>
                            <div v-if="detailIndex.type === 1" class="big-pic-box polaroid">
                        <el-carousel height="600px" :autoplay="false" trigger="click" indicator-position="none"  arrow="hover">
                            <el-carousel-item v-for="pic in detailPictures" :key="pic.picture">
                                <img class="resetBigPic" :src="pic.picture" crossOrigin="anonymous"/>
                            </el-carousel-item>          
                        </el-carousel>
                        </div>
                            <div v-if="detailIndex.type === 2" class="big-pic-box polaroid">
                        <el-carousel height="600px" :autoplay="false" trigger="click" indicator-position="none"  arrow="hover">
                            <el-carousel-item v-for="pic in detailPictures" :key="pic.picture">
                                <canvas class="big-polaroid-color" style="position:absolute;height:100%;">
                                </canvas>
                                <img class="resetBigPic" :src="pic.picture" crossOrigin="anonymous"/>
                            </el-carousel-item>          
                        </el-carousel>
                        </div>
                        </Col>
                        <Col style="border-left:rgb(219, 218, 218) 1px solid;padding-left:10px;padding-right:10px;height:600px" span="7">
                        <div style="height:82%;display:flex;flex-direction:column">
                            <Row class="detail-header">
                                <Col span="3">
                                    <Avatar :src="detailUser.avatar" style="margin-left:5px;margin-top:10px;"/> 
                                </Col>
                                <Col span="18" style="margin-left:10px;">
                                    <h3><a @click="goProfile(detailUser.user_id)">{{detailUser.account}}</a>  <span> 
                                        <a v-if="relation==='yes'" @click="subscribe($event,detailUser.user_id)">已关注</a>
                                        <a v-else-if="relation==='no'" class="subscribe" @click="subscribe($event,detailUser.user_id)">关注</a>
                                        </span></h3>
                                    <p style="white-space:pre-line">{{detailIndex.content}}</p>     
                                    <span style="margin-left: 0; font-size: 14px;color: #003569" v-for="topic in detailTopics" :key="topic.id"><router-link :to="'/topic/'+topic.name.substring(1)">{{topic.name}}  </router-link></span>
                    
                                </Col>
                            </Row>
                            <div class="detail-comment">
                                <Row v-for="comment in detailComments" :key="comment.id" class="one-comment">
                                    <Col span="4">
                                        <Avatar :src="comment.avatar" style="margin-left:5px;margin-top:10px;"/> 
                                    </Col>
                                    <Col span="20">
                                        <h4><a @click="goProfile(comment.user_id)">{{comment.account}}</a> </h4>
                                        <span>{{comment.time|dateFrm}}</span>
                                        <p style="white-space:pre-line">{{comment.content}}</p>  
                                    </Col>
                                </Row>
                            </div>
                            </div>
                            <div class="detail-choices">
                                <a v-if="detailLove" class="isLoved" @click="loveDetail($event,detailIndex.id)"><Icon type="md-heart" size="30" style="margin-left:7px;margin-top:5px;"/></a>
                                <a v-else class="" @click="loveDetail($event,detailIndex.id)"><Icon type="md-heart" size="30" style="margin-left:7px;margin-top:5px;"/></a>
                                <span>{{detailIndex.likes}}次赞</span><br/>
                                <h4>{{detailIndex.time|dateFrm}}</h4>
                                <div v-loading="commentLoad" class="detail-comment-area">
                                        <input maxlength="100" type="text" v-model="detailComment" class="comment-input1" placeholder="添加评论" />
                                        <input type="submit" value="发送" @click="makeDetailComment(detailIndex.id)" class="comment-submit"/>
                                </div>
                            </div>
                            </Col>
                            </Row>
                    </el-dialog>
                </div>
                <div class="content">            
                    <Row class="header" >
                        <Col offset="1" span="7">
                            <el-upload v-if="relation==='myself'"
                            class="upload-demo"
                            action="https://upload.qiniup.com"
                            :on-success="handleAvatarSuccess"
                            :on-error="handleError"
                            :before-upload="beforeAvatarUpload"
                            :data="qiniuData"
                            :show-file-list="false">
                                <div class="avatar" :style="{backgroundImage:'url('+userInfo.avatar+')'}"></div>
                            </el-upload>
                            <div class="avatar" v-else :style="{backgroundImage:'url('+userInfo.avatar+')'}"></div>
                        </Col>
                        <Col style="white-space:pre-line" offset="2" class="info" span="14">
                            <h1>{{userInfo.account}}</h1>
                            <button v-if="relation==='yes'" class="bdesign yes-subscribe" @click="buttonSubscribe($event,userInfo.id)" >已关注</button>
                            <button v-else-if="relation==='no'" class="bdesign no-subscribe" @click="buttonSubscribe($event,userInfo.id)" >关注</button>
                            <a class="settings" @click="settingshow = true" v-if="relation==='myself'"><Icon size="29" type="ios-settings-outline" /></a>
                            <el-dialog
                                class="settings-content"
                                title="个人信息"
                                :visible.sync="settingshow"
                                width="35%"
                                top="10vh"
                                >
                                <div class="one-setting">
                                    <p>账号</p>
                                    <el-input
                                    class="set-input"
                                    v-model="setaccount"
                                    :disabled="true">
                                    </el-input>
                                </div>
                                <div class="one-setting">
                                    <p>用户名</p>
                                    <el-input
                                    class="set-input"
                                    v-model="setname"
                                    maxlength="20"
                                    >
                                    </el-input>
                                </div>
                                <div class="one-setting">
                                    <p>电话</p>
                                    <el-input
                                    class="set-input"
                                    v-model="settel"
                                    maxlength="20"
                                    >
                                    </el-input>
                                </div>
                                <div class="one-setting">
                                    <p>电子邮箱</p>
                                    <el-input
                                    class="set-input"
                                    v-model="setmail"
                                    maxlength="40"
                                    >
                                    </el-input>
                                </div>
                                <div class="one-setting">
                                    <p>个人网站</p>
                                    <el-input
                                    class="set-input"
                                    v-model="setwebsite"
                                    maxlength="30"
                                    >
                                    </el-input>
                                </div>
                                <div class="one-setting">
                                    <p>简介</p>
                                    <el-input
                                    class="set-input"
                                    v-model="setintro"
                                    type="textarea"
                                    maxlength="200"
                                    rows="5"
                                    show-word-limit
                                    resize="none"
                                    >
                                    </el-input>
                                </div>
                                <span slot="footer" class="dialog-footer">
                                    <el-button type="danger" @click="logout">退出登录</el-button>
                                    <el-button @click="settingshow = false">取消</el-button>
                                    <el-button type="primary" @click="updateInfo">确定</el-button>
                                </span>
                            </el-dialog>
                            <br/>
                            <a class="clearLink" @click="seeMoments"><span class="number">{{userInfo.moments}}</span></a><span class="text">动态</span>
                            <a class="clearLink" @click="seeFans"><span class="number">{{userInfo.fans}}</span></a><span class="text">粉丝</span>
                            <a class="clearLink" @click="seeSubscribe"><span class="number">{{userInfo.subscribe}}</span></a><span class="text">正在关注</span>
                            <h2>{{userInfo.name}}</h2>
                            <p>{{userInfo.intro}}
                            </p>
                            <span class="website">{{userInfo.email}}</br></span>
                            <span class="website">{{userInfo.website}}</span>
                        </Col>
                        <el-dialog
                        title="全部粉丝"
                        :visible.sync="fans"
                        width="28%"
                        top="10vh"
                        :center="true"
                        >
                            <div class="dialog">
                                <Row v-for="(one,index) in fansData" :key="one.id" type="flex" align="middle" class="one-person">
                                    <Col span="3">
                                        <Avatar size="large" :src="one.avatar"/> 
                                    </Col>
                                    <Col style="padding-left:7px" span="17">
                                        <a :href="'/myprofile/'+one.id">
                                        <h4>{{one.account}}</h4>
                                        <span>{{one.name}}</span>
                                        </a>
                                    </Col>
                                    <Col span="4">
                                        <Button v-if="fansRelations[index]==='no'" class="small-no-subscribe" @click="smallSubscribe($event,one.id)">关注</Button>
                                        <Button v-if="fansRelations[index]==='yes'" class="small-subscribe" @click="smallSubscribe($event,one.id)">已关注</Button>
                                    </Col>
                                </Row>
                            </div>
                        </el-dialog>
                        <el-dialog
                        title="已关注"
                        :visible.sync="subscribe"
                        width="28%"
                        top="10vh"

                        :center="true"
                        >
                            <div class="dialog">
                                <Row v-for="(one,index) in subscribes" :key="one.id" type="flex" align="middle" class="one-person">
                                    <Col span="3">
                                        <Avatar size="large" :src="one.avatar"/> 
                                    </Col>
                                    <Col style="padding-left:7px" span="17">
                                        <a :href="'/myprofile/'+one.id">
                                        <h4>{{one.account}}</h4>
                                        <span>{{one.name}}</span>
                                        </a>
                                    </Col>
                                    <Col span="4">
                                        <Button v-if="subscribeRelations[index]==='no'" class="small-no-subscribe" @click="smallSubscribe($event,one.id)">关注</Button>
                                        <Button v-if="subscribeRelations[index]==='yes'" class="small-subscribe" @click="smallSubscribe($event,one.id)">已关注</Button>
                                    </Col>
                                </Row>
                            </div>
                        </el-dialog>
                    </Row>
                    <Row type="flex" class="list" style="padding-top:5px;padding-bottom:10px;">
                        <Card v-for="(moment,index) in myMoments" :key="moment.id" class="cover" :padding="0">
                            <div class="moment">
                                <img class="smallPic" :src="covers[index]"/>
                            </div>
                            <a @click="showMoment(moment.id)">
                            <div class="moment-madal"><Row class="small-button" type="flex" justify="center" align="middle">
                                    <Icon size="30" style="color:white;opacity:1;margin-right:5px;" type="md-heart"/> <h2 style="color:white;opacity:1;margin-right:35px;">{{moment.likes}}</h2>
                                    <Icon size="30" style="color:white;opacity:1;margin-right:5px;" type="ios-chatbubbles" /><h2 style="color:white;opacity:1">{{moment.comments}}</h2>
                                </Row>
                            </div>
                            </a>
                        </Card>
                    </Row>
                </div>
            </Content>
    </div>
</template>
<script>
import axios from "axios";
import moment from "moment";

export default {
  name: 'HelloWorld',
  data () {
    return {
        smallheader:false,
        fans:false,
        subscribe:false,
        userId:this.$route.params.id,
        visitId:1,
        userInfo:{},
        myMoments:[],
        search:'',
        searchRes:[],
        topicRes:[],
        messages:[],
        showSearch:false,
        fansData:[],
        subscribes:[],
        fansRelations:[],
        subscribeRelations:[],
        moment:false,
        detailUser:{},
        detailIndex:{},
        detailComments:[],
        detailPictures:[],
        detailComment:'',
        detailTopics:[],
        relation:'',
        covers:[],
        detailLove:false,
        upload:false,
        dialogImageUrl: '',
        dialogVisible: false,
        filelist:[],
        uploadtext:'',
        isLoading:false,
        commentLoad:false,
        settingshow:false,
        setaccount:'',
        setname:'',
        settel:'',
        setmail:'',
        setwebsite:'',
        setintro:'',
        qiniuData: {
        token: ""
        },
        // 七牛云上传储存区域的上传域名（华东、华北、华南、北美、东南亚）
        upload_qiniu_url: "http://upload.qiniup.com",
        // 七牛云返回储存图片的子域名
        upload_qiniu_addr: "http://ps5l7g2z9.bkt.clouddn.com/",
        imageUrl: "",
    }
  },
  methods:{
    getQiniuToken(){
        axios.get("/api/getToken").then(response=>{
            this.qiniuData.token = response.data
        })
    },
    beforeAvatarUpload(file){
        const isJPG = file.type === "image/jpeg";
        const isPNG = file.type === "image/png";
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG && !isPNG) {
            this.$Message.error("图片只能是 JPG/PNG 格式!");
            return false;
        }
        if (!isLt2M) {
            this.$message.error("图片大小不能超过 2MB!");
            return false;
        }
    },
    handleAvatarSuccess(res,file){
        var avatar = this.upload_qiniu_addr + res.key;
        var data = new URLSearchParams()
        data.append("userId",this.userId)
        data.append("avatar",avatar)
        axios({
            method:"POST",
            url:'/api/updateAvatar',
            data:data
        }).then(response=>{
            if(response.data == 'success'){
                this.$Message.success("头像上传成功")
                axios.get("/api/getUserInfo/"+this.userId).then((response)=>{
                    this.userInfo = response.data[0]
                    this.setaccount = this.userInfo.account
                    this.setname = this.userInfo.name
                    this.settel = this.userInfo.tel
                    this.setmail = this.userInfo.email
                    this.setwebsite = this.userInfo.website
                    this.setintro = this.userInfo.intro          
                })
            }else{
                this.$Message.warning("头像上传失败")
            }
        })
    },
    handleError(){
        this.$Message.warning("头像上传失败")
    },
    showUpload(){
        this.upload = true;
    },
    goProfile(userId){
        this.$router.push("/myprofile/"+userId);
        this.$router.go(0);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    deleteMessage(messageId,index){
        axios.post("/api/deleteMessage/"+messageId).then((response)=>{
            if(response.data != "failure"){
                this.messages.splice(index,1)
            }
        })
    },
    deleteAllMessages(){
        axios.post("/api/deleteAllMessages/"+this.userId).then((response)=>{
            if(response.data != "failure"){
                this.messages = []
            }
        })
    },
   goSearch(){
        if(this.search!=''){
            this.showSearch = true
            var data = new URLSearchParams();
            data.append("search",this.search)
            axios({
                method:"POST",
                url:"/api/searchUser",
                data:data
            }).then((response)=>{
                this.searchRes = response.data
            })
            var data2 = new URLSearchParams();
            data2.append('search',this.search)
            axios({
                method:'POST',
                url:'/api/searchTopics',
                data:data2
            }).then(response=>{
                this.topicRes = response.data
            })
        }
        else{
            this.showSearch = false
        }
    },
     makeDetailComment(momentId){
        let content = this.detailComment
        if(content == ''){
            this.$Message.warning("不能发表空评论哦")
        }
        else{
            this.commentLoad = true;
            var data = new URLSearchParams()
            data.append("userId",this.visitId)
            data.append("momentId",momentId)
            data.append("content",content)
            axios({
                method:"POST",
                url:'/api/commentMoment/',
                data:data
            }).then((response)=>{
                if(response.data=='success'){
                    this.$Message.success("评论成功")
                    this.commentLoad = false;
                    this.detailComment = ''
                    this.resetDetailComment(momentId);
                    this.resetPage()
                }
                else if(response.data=='failure'){
                    this.$Message.warning("评论失败")
                    this.commentLoad = false;
                }
            })
        }
    },
    loveDetail(ev,momentId){
        var tag = ev.currentTarget;
        if(tag.classList.contains("isLoved")){
            tag.classList.remove("isLoved");
            axios.post("/api/unloveMoment/"+this.visitId+"/"+momentId).then((response)=>{
                if(response.data == "failure"){
                    this.$Message.warning("请求失败")
                }
                else{
                    this.resetPage()
                    this.resetLoveNum(momentId)
                }
            })
        }
        else{
            tag.classList.add("isLoved");
            axios.post("/api/loveMoment/"+this.visitId+"/"+momentId).then((response)=>{
                if(response.data == "failure"){
                    this.$Message.warning("请求失败")
                }
                else{
                    this.resetPage()
                    this.resetLoveNum(momentId)
                }
            })
        }
    },
    subscribeUser(ev,userId){
        if(ev.currentTarget.classList.contains("subscribe")){
            ev.currentTarget.classList.remove("subscribe");
            ev.currentTarget.innerHTML = '已关注'
            axios.get("/api/subscribe/"+this.visitId+"/"+userId).then((response)=>{
                if(response.data=="success"){
                    this.$Message.success("关注成功")
                }else{
                    this.$Message.warning("关注失败")
                }
            })
        }
        else{
            ev.currentTarget.classList.add("subscribe");
            ev.currentTarget.innerHTML = "关注"
            axios.get("/api/cancelSubscribe/"+this.visitId+"/"+userId).then((response)=>{
                if(response.data=="success"){
                    this.$Message.warning("取消关注成功")

                }
                else{
                    this.$Message.warning("取消关注失败")
                }
            })
            

        }
    },
    handleRemove(file, fileList) {
        console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
        console.log(file.url);
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
    },
    resetDetailComment(momentId){
        axios.get("/api/getMomentComments/"+momentId).then((response)=>{
            this.detailComments = []
            this.detailComments = response.data
        })
    },
    resetLoveNum(momentId){
        axios.get("/api/getMoment/"+momentId).then((response)=>{
            this.detailIndex = response.data[0]
        })
    },
    handleScroll(e){
          var scrolltop=document.documentElement.scrollTop||document.body.scrollTop;
          var hi = document.getElementsByClassName("header")[0].offsetHeight-100;
             if(scrolltop>hi){
                this.smallheader = true;
             }
             else{
                this.smallheader = false;
            }
      },
    resetPics(){
        let imgs = document.getElementsByClassName('smallPic')
        for(let img of imgs){
             img.onload = function(){
                let height = img.offsetHeight
                if(height <  300){
                    img.style.height = '300px'
                    img.style.width = 'auto'

                    let offset = (img.offsetWidth - 300)/2
                    
                    //img.style.transform = `translateX(-${offset}px)`
                    img.style.left = `-${offset}px`
                }else{
                    let offset = (img.offsetHeight - 300) /2
                    //img.style.transform = `translateY(-${offset}px)`
                    img.style.top = `-${offset}px`
                }
             }
        }
    },
    seeFans(){
        axios.get("/api/getFans/"+this.userId).then((response)=>{
            this.fansData = response.data
            var query = []
            for(let fans of this.fansData){
                var ax = axios.get("/api/checkSubscribe/"+this.visitId+"/"+fans.id)
                query.push(ax)
            }
            axios.all(query).then(response=>{
                for(let res of response){
                    this.fansRelations.push(res.data)
                }
                this.fans = true;
            })
        })
    },
    seeSubscribe(){
        axios.get("/api/getSubscribe/"+this.userId).then((response)=>{
            this.subscribes = response.data
            var query = []
            for(let subscribe of this.subscribes){
                var ax = axios.get("/api/checkSubscribe/"+this.visitId+"/"+subscribe.id)
                query.push(ax)
            }
            axios.all(query).then(response=>{
                for(let res of response){
                    this.subscribeRelations.push(res.data)
                }
                this.subscribe = true;
            })
        })
    },
    smallSubscribe(ev,userId){
        if(ev.currentTarget.classList.contains("small-subscribe")){
            ev.currentTarget.classList.remove("small-subscribe");
            ev.currentTarget.classList.add("small-no-subscribe");
            ev.currentTarget.innerHTML = "关注"
            axios.get("/api/cancelSubscribe/"+this.visitId+"/"+userId).then(response=>{
                if(response.data == "success"){   
                    this.resetInfo()
                } 
            })          
        }
        else{
            ev.currentTarget.classList.remove("small-no-subscribe");
            ev.currentTarget.classList.add("small-subscribe");
            ev.currentTarget.innerHTML = "已关注"
            axios.get("/api/subscribe/"+this.visitId+"/"+userId).then(response=>{
                if(response.data == 'success'){ 
                    this.resetInfo()
                }
            })   
        }
    },
    seeMoments(){
        var hi = document.getElementsByClassName("header")[0].offsetHeight-100;
        window.scrollTo(0,hi+5);
    },
    resetBigPics(){
        let boxs = document.getElementsByClassName('big-pic-box')
        for(let box of boxs){
            let imgs = box.getElementsByClassName('resetBigPic')
            let works = []
            let cans = box.getElementsByClassName("polaroid-color")
            if(box.classList.contains("adjust")){
                for(let img of imgs){
                    img.setAttribute('crossOrigin','anonymous');
                    img.onload = function(){
                        if(img.offsetHeight>600){
                            let offset = (img.offsetHeight - 600) /2
                            img.style.top = `-${offset}px`
                        }
                        else{
                            img.style.height = "100%"
                            img.style.width = "auto"
                            let offset = (img.offsetWidth - 816)/2
                            img.style.left = `-${offset}px`
                        }
                    }
                }
            }
            else if(box.classList.contains("polaroid")){
                for(let img of imgs){
                    img.setAttribute('crossOrigin','anonymous');
                    img.onload = function(){
                        if(img.offsetHeight > 600){
                            console.log("very high")
                            img.style.height = "600px";
                            img.style.width = "auto"
                            
                        }
                        else{
                            let offset = (600 - img.offsetHeight)/2
                            img.style.top = offset+"px";
                        }
                        // if(cans.length > 0){
                        //     cans[index].style.height = 600 + "px"
                        //     this.getImageColor(cans[index],img)
                        // }
                    }
                }
            }
            
        }
    },
    showMoment(id){
        this.moment = true;
        axios.get("/api/getTopics/"+id).then(response=>{
            this.detailTopics = response.data
        })
        axios.get("/api/getMomentUser/"+id).then((response)=>{
            this.detailUser = response.data[0]
        })
        axios.get("/api/getMoment/"+id).then((response)=>{
            this.detailIndex = response.data[0]
        })
        axios.get("/api/getMomentComments/"+id).then((response)=>{
            this.detailComments = response.data
        })
        axios.get("/api/getMomentPics/"+id).then((response)=>{
            this.detailPictures = response.data
        })
        axios.get("/api/checkLove/"+this.visitId+"/"+id).then((response)=>{
            if(response.data=="yes"){
                this.detailLove = true;
            }
            else{
                this.detailLove = false;
            }
        })
    },
    buttonSubscribe(ev,userId){
        var tag = ev.currentTarget;
        if(tag.classList.contains("yes-subscribe")){
            tag.classList.remove("yes-subscribe");
            tag.classList.add("no-subscribe")
            ev.currentTarget.innerHTML = "关注";
            axios.get("/api/cancelSubscribe/"+this.visitId+"/"+userId).then(response=>{
                if(response.data == "failure"){
                    this.$Message.warning("请求失败")
                }
                else{
                    this.$Message.success("取消关注成功")
                    this.resetRelation()
                    this.resetInfo()
                }
            })
        }
        else{
            tag.classList.remove("no-subscribe")
            tag.classList.add("yes-subscribe");
            ev.currentTarget.innerHTML = "已关注";
            axios.get("/api/subscribe/"+this.visitId+"/"+userId).then(response=>{
                if(response.data=="failure"){
                    this.$Message.warning("请求失败")       
                }
                else{
                    this.$Message.success("关注成功")
                    this.resetRelation()
                    this.resetInfo()
                }
            })
        }
    },
    resetRelation(){
        axios.get("/api/checkSubscribe/"+this.visitId+"/"+this.userId).then((response)=>{
          this.relation = response.data
      })
    },
    resetPage(){
      axios.get("/api/getMyMoments/"+this.userId).then((response)=>{
          this.myMoments = response.data
      })
    },
    updateInfo(){
        let data = new URLSearchParams()
        data.append("userId",this.visitId)
        data.append("name",this.setname)
        data.append("website",this.setwebsite)
        data.append("tel",this.settel)
        data.append("mail",this.setmail)
        data.append("intro",this.setintro)
        axios({
            method:'POST',
            url:'/api/updateInfo',
            data:data
        }).then(response=>{
            this.settingshow = false
            if(response.data=="failure"){
                this.$Message.warning("个人信息更新失败")
            }
            else{
                this.$Message.success("个人信息更新成功")
                this.resetInfo();
            }
        })
    },
    resetInfo(){
        axios.get("/api/getUserInfo/"+this.userId).then((response)=>{
          this.userInfo = response.data[0]
          this.setaccount = this.userInfo.account
          this.setname = this.userInfo.name
          this.settel = this.userInfo.tel
          this.setmail = this.userInfo.email
          this.setwebsite = this.userInfo.website
          this.setintro = this.userInfo.intro          
      })
    },
    logout(){
        localStorage.removeItem("id")
        this.$router.push('/login')
    }
  },
  
  mounted(){
      this.visitId = localStorage.id
      this.getQiniuToken()
      window.addEventListener("scroll",this.handleScroll);
      axios.get("/api/getUserInfo/"+this.userId).then((response)=>{
          this.userInfo = response.data[0]
          document.title = "Lucere@"+this.userInfo.account
          this.setaccount = this.userInfo.account
          this.setname = this.userInfo.name
          this.settel = this.userInfo.tel
          this.setmail = this.userInfo.email
          this.setwebsite = this.userInfo.website
          this.setintro = this.userInfo.intro          
      })
      axios.get("/api/getMyMoments/"+this.userId).then((response)=>{
          this.myMoments = response.data
      })
      axios.get("/api/checkSubscribe/"+this.visitId+"/"+this.userId).then((response)=>{
          this.relation = response.data
      })
      axios.get("/api/getCovers/"+this.userId).then((response)=>{
          for(let res of response.data){
              this.covers.push(res.cover)
          }
      })
      axios.get("/api/getMessages/"+this.userId).then((response)=>{
          this.messages = response.data
      })
  },
  updated(){
    this.resetPics();
    this.resetBigPics();
  },
  filters:{
      dateFrm: function(el){
          return moment(el).format("YYYY-MM-DD HH:mm");
      }
  }
}
</script>
<style scoped>
a{
    color:unset;
}

.guide{
    position:fixed;
    height: 65px;
    width:100vw;
    padding:0 0;
    border-bottom-color:black;
    z-index:10;
}

.navi{
    color:white;
    size:33px;
}

.search{
    width:400px;
}

.result{
    height:300px;
    overflow: auto;
}

.resuser{
    text-align: left;
    padding:10px 10px;
    
    height:60px;
    border-bottom:1px rgb(219, 218, 218) solid;
}

.resuser h3{
    font-size:14px;
}

.resuser span{
    color:rgb(175, 173, 173);
    font-size:13.5px;
}

.content{
    margin-left:16%;
    margin-right:16%; 
    margin-top:64.5px;
    height:auto;
    text-align: left;
    min-height:110vh;
}

.red-point{
    display: block;
    background: #f00;
    border-radius: 50%;
    width: 8px;
    height: 8px;
    top: 18px;
    right: 1px;
    position: absolute;
}

.message-box{
    height: 250px;
    overflow: auto;
}

.message-one{
    text-align: left;
    padding:15px;
    border-bottom:1px rgb(219, 218, 218) solid;
}

.message-one h4{
    font-size:5px;
    color:grey;
}

.message-one .close{
    position: relative;
    top:10px;
}

.message-one:hover{
    background: #f5f7f9;
}

.no-message span{
    position:relative;
    top:120px;
    font-size:13px;
    color:#848484;
    letter-spacing: 1px;
}

.header{
    width:100%;
    height:auto;
    padding-top:80px;
    padding-bottom:30px;
    border-bottom:1px rgb(219, 218, 218) solid;
    /* display:none; */
}

.avatar{
    border: 1px solid #dad7d7;
    border-radius: 50%;
    width: 260px;
    height:260px;
    background-size:cover;
    background-repeat: no-repeat;
    background-position: center; 

}

.smallavatar{
    border: 1px solid #dad7d7;
    border-radius: 50%;
    width: 70px;
    height:70px;
    background-size:cover;
    background-repeat: no-repeat;
    background-position: center; 

}

.a-upload:hover{
    opacity: 50%;
    border:3px #1c70ca solid;
}

.small-header{
    width:100%;
    border-bottom:1px rgb(209, 208, 208) solid;
    height: 100px;
    padding-left: 15%;    
    background: white;
    position:fixed;
    z-index:30;
    transition:height 2s;
    margin-top:64px;
}

.info h1{
    font-weight: bolder;
    font-size: 26px;
    margin-bottom: 30px;
    display:inline-block;
}



.info span{
    font-size:18px;
}

.small-info{
    white-space: nowrap;
    margin-left: 20px;
    margin-bottom: 10px;
    text-align: left;
}

.small-info h2{
    display: inline-block;

}

.small-info h3{
    display:inline-block;
    position: relative;
    top:5px;
    color:black;
    font-size:14px;
    margin-right:10px;
}

.small-info span{
    position:relative;
    top:5px;
}

.small-info .number{
    font-weight: bold;
    margin-right:3px;
}
.small-info .text{
    margin-right:5px;
}

.info .number{
    font-weight: bold;
    margin-right: 5px;
}

.info .text{
    margin-right:20px;
}

.info h2{
    font-size:20px;
    margin-top:45px;
    color:black;
    margin-bottom:10px;
}

.info p{
    font-size:17px;
}

.info .website{
    font-size:17px;
}

.settings{
    left: 20px;
    position: relative;
    bottom: 3px;
}



.one-setting{
    display: flex;
    padding:20px 40px;
}

.one-setting p{
    display: inline-block;
    font-weight: bolder;
    width:20%
}

.one-setting .set-input{
    display:inline-block;
    margin-left:30px;
    width:70%;
    height:70%;
}

.list{
    width:100%;
}

.moment{
    width:300px;
    height:300px;
    text-align:bottom;
    overflow: hidden;
}

.moment img{
    width:100%;
    height:auto;
    position:relative;
}

.moment-madal{
    position:relative;
    bottom:300px;
    width:300px;
    height:300px;
    display:none;
    z-index:5;
    background: black;
    opacity: 0.55;
}

.cover{
    height:300px;
    width:300px;
    margin:16px 13px;
}

.cover:hover .moment-madal{
    display:inline-block;
}

.small-button{
    width:100%;
    height:100%;
}

.small-button Icon{
    color:white;
    z-index:6;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}


.clearLink{
    color:#515a6e
}

.header /deep/ .el-dialog__body{
    padding:0px;
}

.dialog{
    overflow: auto;
    padding:10px 20px;
}

.dialog Button{
    width:56px;
    font-weight: bold;
    text-align: center;
    padding-left: 0;
    padding-right:0;
}

.one-person{
    margin-bottom:15px;
}

.moment-detail /deep/ .el-dialog__body{
    padding:0px;
    height:600px;
    width:auto;
}

.moment-detail /deep/ .el-dialog__header{
    padding:0px;
}

.big-polaroid-color{
    width:815px;
}

.big-pic-box{
    width:auto;
    height:600px;
    overflow:hidden;
    padding:0px;
}

.big-pic-box img{
    width: 100%;
    height: auto;
    position:relative;
    vertical-align: bottom;
}

.detail-header{
    text-align: left;
    width: 100%;
    padding-top:15px;
    padding-bottom:15px;
    padding-left:2px;
    border-bottom:1px rgb(219, 218, 218) solid;
}

.detail-header h3{
    font-size:14px;
    color:black;
}

.detail-header span{
    font-size:13px;
    color:rgb(48, 46, 46);
    margin-left:8px;
}

.detail-header p{
    color:black;
}

.detail-comment{
    height:100%;
    overflow: auto;
    width:100%;
    padding-right:30px;
    padding-left:2px;
    text-align:left;
}

.detail-choices{
    text-align: left;
    width: 100%;
    padding-top:5px;
    padding-bottom:10px;
    padding-left:2px;
    border-top:1px rgb(219, 218, 218) solid;
}

.detail-choices span{
    color:black;
    font-size:16px;
    font-weight: bold;
    position:relative;
    top:4px;
    left:5px;
}

.detail-choices h4{
    font-size:12px;
    font-weight: normal;
    color:rgb(117, 117, 117);
    margin-left:10px;
    margin-top:3px;
}

.one-comment{
    padding-bottom:10px;
    padding-top:10px;
    border-bottom:1px rgb(219, 218, 218) solid;
    width:100%;
}

.one-comment h4{
    color:black;
}

.one-comment p{
    font-size:12px;
    color:rgb(48, 46, 46);
}

.one-comment span{
    font-size:11px;
    color:rgb(151, 148, 148);
}

.detail-comment-area .comment-input1{
    outline:none;
    border:none;
    height:40px;
    padding-left:10px;
    width:250px;
    display:inline-block;

}

.detail-comment-area .comment-submit{
    background: transparent;
    border: none;
    color: #2c3e50;
    font-size: 17px;
    font-weight: bold;
    outline:none;
}

.isLoved{
    color:red;
}

.subscribe{
    color:#2d8cf0;
}

.bdesign{
    position: relative;
    bottom: 3.5px;
    margin-left:6%;
    width: 80px;
    height: 30px;
    border-radius: 3px;
    font-size:14px;
    font-weight: bolder;
    outline: none;
}

.sdesign{
    height: 25px;
    width: 50px;
    font-size: 12px;
    border-radius: 3px;
    position: relative;
    bottom:2px;
    margin-left:15px;
    font-weight: bold;
    outline: none;

}

.no-subscribe{
    background-color:#2d8cf0;
    color:white;
}

.small-subscribe{
    background-color:white;
    color:black;
}

.small-no-subscribe{
    background-color:#2c3e50;
    color:white;
}

.one-comment{
    padding-bottom:10px;
    padding-top:10px;
    border-bottom:1px rgb(219, 218, 218) solid;
    width:100%;
}

.one-comment h4{
    color:black;
}

.one-comment p{
    font-size:12px;
    color:rgb(48, 46, 46);
}

.one-comment span{
    font-size:11px;
    color:rgb(151, 148, 148);
}

.detail-comment-area .comment-input1{
    outline:none;
    border:none;
    height:40px;
    padding-left:10px;
    width:250px;
    display:inline-block;

}

.detail-comment-area .comment-submit{
    background: transparent;
    border: none;
    color: #2c3e50;
    font-size: 17px;
    font-weight: bold;
    outline:none;
}


</style>
