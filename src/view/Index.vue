<template>
    <div style="height:100vh;overflow:auto">
        <Layout>
            <Header class="guide">
            <Row>
                <Col span="2"><a @click="goIndex"><Icon size="40" type="ios-aperture-outline" color="white" /></a></Col>
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
                    <Col span="6">
                        <a href="/discover">
                        <Icon type="md-globe" size="33" class="navi"/>
                        </a>
                    </Col>
                    <Col span="6">
                    <Poptip padding="0" placement="bottom" width="350">
                        <a>
                            <Icon type="md-heart-outline" size="33" class="navi"/>
                            <i v-if="messages.length > 0" class="red-point"></i>
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
                    <a @click="goProfile(userId)">
                        <Icon type="md-person" size="33" class="navi"/>
                    </a>
                    </Col>
                    <Col span="6">
                    <a @click="showUpload">
                        <Icon type="md-arrow-round-up" size="33" class="navi"/>
                    </a>      
                    </Col>
                </Row>              
                </Col>
            </Row>
            </Header>
            <Content v-loading="pageLoading">
                <div class="content">
                <Layout>
                    <Content style="margin-right:40px;" >
                            <div class="release">
                            <el-dialog
                                title="发表动态"
                                :visible.sync="upload"
                                width="700px"
                                style="text-align:left;"
                                top="70px"
                            > 
                                <el-alert
                                    title="选择想要发表的图片，不多于5张"
                                    description="为了更好地展现图片，建议每次只发表1张或少数照片，并且尽量选择比例正常的照片"
                                    type="info"
                                    :closable="false"
                                    show-icon
                                    style="margin-bottom:20px;">
                                </el-alert>
                                <el-upload
                                ref="uploadPics"
                                action="uploadPics"               
                                multiple
                                class="upload-demo"
                                list-type="picture-card"
                                :on-preview="handlePictureCardPreview"
                                :on-remove="handleRemove"
                                :http-request="uploadToCloud"
                                :before-upload="handleBefore"
                                :limit="5"
                                :auto-upload="false"
                                :file-list="filelist"
                                >
                                    <i class="el-icon-upload"></i>
                                </el-upload>
                                <el-dialog class="clear" :append-to-body="true" :show-close="false"	:visible.sync="dialogVisible">
                                    <img width="100%" class="adjust-pic" style="vertical-align:bottom;" :src="dialogImageUrl" alt="">
                                </el-dialog>
                                <div style="padding-top:20px;">
                                    <span style="margin-top:20px">选择展现多张图片时的适配方式<br/></span>
                                    <el-radio-group v-model="radio" size="small">
                                    <el-radio-button label="0">切割（某些图片展现不全）</el-radio-button>
                                    <el-radio-button label="1">缩放（均能展现全部内容）</el-radio-button>
                                    <!-- <el-radio-button label="2">缩放+填充（用图片主题色填充空白部分）</el-radio-button> -->
                                    </el-radio-group>
                                </div>
                                <el-input
                                    type="textarea"
                                    :rows="4"
                                    style="margin-top:20px;"
                                    placeholder="请输入动态内容，可以为空"
                                    v-model="uploadtext"
                                    maxlength="200"
                                    show-word-limit
                                    resize="none"
                                    >
                                </el-input>
                                <el-input
                                    style="margin-top:20px;"
                                    placeholder="#话题，以#开头，多个空格分隔"
                                    v-model="uploadTopic">
                                </el-input>
                                <el-button style="background-color: rgb(44, 62, 80);
                                color: white;
                                text-align: left;
                                margin-top: 20px;"
                                @click="releaseMoment"
                                :loading="isLoading">
                                    发送
                                </el-button>
                                <span 
                                v-show="noRelease"
                                style="position: relative;
                                color: #f32a2a;
                                vertical-align: bottom;
                                left:10px">
                                    图片不能为空
                                </span>
                            

                            </el-dialog>
                            </div>
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
                        <Card v-for="(moment,index) in indexMoments" :key="moment.id" class="moment" :padding="0">
                            <Row class="momenthead">
                                <Col span="2">
                                    <Avatar :src="momentUsers[index].avatar" size="large" style="margin-left:0px;"/> 
                                </Col>
                                <Col class="user-info" span="22">
                                    <a @click="goProfile(moment.user_id)"><span class="account">{{momentUsers[index]["account"]}}</span></a>
                                    <span class="username">{{momentUsers[index]["name"]}}</span>
                                </Col>
                            </Row>
                            <Carousel dots="outside" arrow="never">
                                <div v-if="moment.type === 0" class="pic-box adjust">
                                <CarouselItem v-for="pic in momentPictures[index]" :key="pic.picture">
                                    <img class="resetPic" :src="pic.picture" crossOrigin="anonymous"/>
                                </CarouselItem>    
                                </div>
                                <div v-if="moment.type === 1" class="pic-box polaroid">
                                <CarouselItem style="text-align:left" v-for="pic in momentPictures[index]" :key="pic.picture" >
                                    <img class="resetPic" :src="pic.picture" crossOrigin="anonymous"/>
                                </CarouselItem>    
                                </div>
                                <div v-if="moment.type === 2" class="pic-box polaroid">
                                <CarouselItem style="text-align:left" v-for="pic in momentPictures[index]" :key="pic.picture">
                                    <canvas class="polaroid-color" style="position:absolute;">
                                    </canvas>
                                    <img class="resetPic" :src="pic.picture" crossOrigin="anonymous"/>
                                </CarouselItem>    
                                </div>
                            </Carousel>
                            <div class="choices">
                                <a v-if="isLove[index] == true" class="button1 isLoved" @click="love($event,index,moment.id)"><Icon size="30" style="margin-right:8px" type="md-heart"/></a>
                                <a v-else class="button1 isUnloved" @click="love($event,index,moment.id)" ><Icon size="30" style="margin-right:8px" type="md-heart"/></a>
                                <a @click="showMoment(moment.id,moment.user_id,index)"><Icon type="ios-chatbubbles" size="30" /></a> 
                                <Icon type="ios-link" size="30" style="margin-left:465px" />
                            </div>
                            <div class="text">
                                <h4><a @click="goProfile(moment.user_id)">{{momentUsers[index]["account"]}}</a><span>{{moment.time|dateFrm}}  发布了{{moment.pictures}}张照片</span></h4>
                                <p style="white-space:pre-line">{{moment.content}}</p>
                            </div>
                            <div class="topic">
                            <span v-for="topic in momentTopics[index]" :key="topic.id"><router-link :to="'/topic/'+topic.name.substring(1)">{{topic.name}}  </router-link></span>
                            </div>
                            <div class="comment">
                                <a @click="showMoment(moment.id,moment.user_id,index)"><h4>全部{{moment.comments}}条评论</h4></a>
                                <div v-for="comment in indexComments[index]" :key="comment.id">
                                    <a @click="goProfile(comment.user_id)"><span class="comment-user">{{comment.account}}</span></a>
                                    <span style="white-space:pre-line" class="comment-content">{{comment.content}}</span>
                                    <br/>
                                </div>
                            </div>
                            <div class="comment-area">
                                <input maxlength="100" type="text" name="content" class="comment-input" placeholder="添加评论" />
                                <input type="submit" value="发送" @click="makeComment(moment.id,index)" class="comment-submit"/>
                            </div>
                        </Card>
                        
                    </Content>
                    <Sider width="320" style="background-color:#f5f7f9" >
                        <div class="recommend">
                            <h2>为你推荐</h2>
                            <div style="height:100px;overflow:auto;">
                            <Row v-for="(one,index) in recommendFans" :key="one.id" class="one-person">
                                <Col span="4">
                                    <Avatar size="large" :src="one.avatar"/> 
                                </Col>
                                <Col span="15" class="info">
                                <router-link :to="'/myprofile/'+one.id">
                                <h3>{{one.account}}</h3>
                                <span>{{one.name}} 在关注你哦</span>
                                </router-link>
                                </Col>
                                <Col span="4" offset="1">
                                    <a v-if="recommendRelations[index] === 'no'" @click="rSubscribe(one.id,index)" style="color:#515a6e">
                                    <Icon style="padding-top:5px;" size="30" type="md-add" />
                                    </a>
                                    <a v-if="recommendRelations[index] === 'yes'" @click="rcSubscribe(one.id,index)" style="color:#515a6e">
                                    <Icon style="padding-top:5px;" size="30" type="md-checkmark" />
                                    </a>
                                </Col>
                            </Row>
                            </div>
                        </div>
                        <div class="recently">
                            <h2>好友动态</h2>
                            <div style="height:200px;overflow:auto;">
                            <Row v-for="message in subscribeMessages" :key="message.id" class="one-person">
                                <Col span="4">
                                    <Avatar size="large" :src="message.avatar"/> 
                                </Col>
                                <Col span="20" class="info">
                                <div v-if="message.type === 1">
                                    <h3><router-link :to="'/myprofile/'+message.ing_id">{{message.account}}</router-link> 关注了 <router-link :to="'/myprofile/'+message.ed_id">{{message.ed_account}}</router-link></h3>
                                    <h4>{{message.time|dateFrm}}</h4>
                                </div>
                                <div v-if="message.type === 2">
                                <h3><router-link :to="'/myprofile/'+message.ing_id">{{message.account}}</router-link> 评论了 <router-link :to="'/myprofile/'+message.ed_id">{{message.ed_account}}</router-link> 的动态</h3>
                                <span style="white-space:pre-line"><a @click="showMessageMoment(message.moment_id)">{{message.content}}</a></span>
                                <a @click="showMessageMoment(message.moment_id)"><h4>{{message.time|dateFrm}}</h4></a>
                                </div>
                                <div v-if="message.type === 3">
                                <h3><router-link :to="'/myprofile/'+message.ing_id">{{message.account}}</router-link> 点赞了 <router-link :to="'/myprofile/'+message.ed_id">{{message.ed_account}}</router-link> 的动态</h3>
                                <a @click="showMessageMoment(message.moment_id)"><h4>{{message.time|dateFrm}}</h4></a>
                                </div>
                                </Col>
                            </Row>
                            </div>
                        </div>
                    </Sider>
                </Layout>
                </div>
            </Content>
        </Layout>
    </div>
</template>
<script>
import axios from "axios";
import moment, { RFC_2822 } from "moment";
import Qs from 'qs'
import lrz from 'lrz'



export default {
  name: 'HelloWorld',
  inject: ['reload'],
  data () {
    return {
        moment:false,
        upload:false,
        dialogImageUrl: '',
        dialogVisible: false,
        filelist:[],
        uploadtext:'',
        uploadTopic:'',
        radio:'0',
        isLoading:false,
        noRelease:false,
        show:false,
        search:'',
        searchRes:[],
        topicRes:[],
        showSearch:false,
        indexMoments:[],
        indexComments:[],
        momentUsers:[],
        userId:0,
        detailUser:{},
        detailIndex:{},
        detailComments:[],
        detailComment:'',
        detailPictures:[],
        detailTopics:[],
        detailLove:false,
        relation:"",
        momentPictures:[],
        commentLoad:false,
        isLove:[],
        messages:[],
        subscribeMessages:[],
        momentTopics:[],
        recommendFans:[],
        recommendRelations:[],
        pageLoading:true,
    }
  },
  methods:{
    goProfile(userId){
        this.$router.push("/myprofile/"+userId);
        // this.$router.go(0);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    goIndex(){
        this.$router.go(0);
    },
    rSubscribe(userId,index){
        axios.get("/api/subscribe/"+this.userId+"/"+userId).then(response=>{
            if(response.data == 'failure'){
                this.$Message.warning("请求失败")
            }
            else{
                this.recommendRelations.splice(index,1,'yes')
            }
        })
    },
    rcSubscribe(userId,index){
        axios.get("/api/cancelSubscribe/"+this.userId+"/"+userId).then(response=>{
            if(response.data == 'failure'){
                this.$Message.warning("请求失败")
            }
            else{
                this.recommendRelations.splice(index,1,'no')
            }
        })
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
    getTopics(){
        var topics = this.uploadTopic.split(' ')
        for(let topic of topics){
            var index = topics.indexOf(topic)
            if(topic.length==0 || topic[0]!='#'){
                delete topics[index]
            }
        }
        return topics
    },
    async compressImg(file){
        console.log("file",file)
        let res = await lrz(file,{
            quality:0.8
        })
        return new Promise((resolve, reject) => {
            resolve(res)
      })
    },
    releaseMoment(){
        var topics = this.getTopics()
        var files = this.$refs.uploadPics.uploadFiles
        if(files.length == 0){
            this.noRelease = true;
            return
        }
        this.isLoading = true;
        var rawfiles = []
        for(let file of files){
            rawfiles.push(file.raw)
        }
        var momentCon = new URLSearchParams();
        momentCon.append("userId",this.userId)
        momentCon.append("content",this.uploadtext)
        if(this.radio == '0'){
            momentCon.append("type",0)
        }
        else if(this.radio == '1'){
            momentCon.append('type',1)
        }
        else if(this.radio == '2'){
            momentCon.append('type',2)
        }
        axios({
            method:"POST",
            url:"/api/createMoment/",
            data:momentCon,
        }).then((response)=>{
            if(response=="failure"){
                this.$Message.warning("发表失败，请检查网络连接")
                this.isLoading = false;
            }
            else{
                var insertId = response.data["insertId"]
                var works = []
                for(let topic of topics){
                    if(topic != undefined){
                        var data = new URLSearchParams()
                        data.append("momentId",insertId)
                        data.append("topic",topic)
                        var ax = axios({
                            method:'POST',
                            url:"/api/relateTopic/",
                            data:data,
                        })
                        works.push(ax)
                    }
                }
                axios.all(works)
                this.uploadToCloud(insertId,rawfiles,(result)=>{
                    console.log(result);
                    if(result=="failure"){
                        axios.post("/api/deleteMoment/"+insertId).then((response)=>{
                            this.$Message.warning("发表失败，请检查网络连接")
                            this.isLoading = false;
                        })
                    }else{
                        this.upload = false;
                        this.isLoading = false;
                        this.$refs.uploadPics.uploadFiles = []
                        this.uploadtext = ''
                        this.uploadTopic = ''
                        this.resetPage();
                        axios.get("/api/getUserMomentNum/"+this.userId)
                    }
                })
            }
        })
        
    },
    handleBefore(){
    },
    async uploadToCloud(momentId,files,callback){
        axios.get("/api/getToken").then(async (response)=>{
            var uploadlist = []
            for(let file of files){
                let res = await this.compressImg(file)
                console.log("compress",res.file)
                var data = new FormData()
                var token = response.data
                data.append('token',token)
                data.append('file', res.file)
                var one = axios({
                    method: 'POST',
                    url: 'http://upload.qiniup.com/',  //上传地址
                    data: data,
                    timeout:300000,      //超时时间，因为图片上传有可能需要很久
                    withCredentials: false
                })
                uploadlist.push(one)    
            }    
            axios.all(uploadlist).then((response)=>{
                var pre = 'http://ps5l7g2z9.bkt.clouddn.com/'
                var flag = 1
                var updatelist = []
                for(let res of response){
                    let dataPic = new URLSearchParams()
                    var resource = res.data.key;
                    var link = pre + resource
                    dataPic.append('momentId',momentId)
                    dataPic.append('resource',link)
                    dataPic.append('flag',flag)
                    flag = flag + 1
                    var upaxios = axios({
                        method:'POST',
                        url:'/api/addPictures/',
                        data:dataPic
                    })
                    updatelist.push(upaxios)
                }
                axios.all(updatelist).then((response)=>{
                    console.log("res",response)
                    for(let res of response){
                        if(res.data == 'failure'){
                            callback.call(this,"failure")
                            break;
                        }
                    }
                    callback.call(this,"success")
                })
            }).catch((err)=>{
                console.log(err)
                callback.call(this,"failure")
            })
        })
    },

    makeComment(momentId,index){
        let contentlist = document.getElementsByClassName('comment-input')
        let content = contentlist[index].value
        if(content == ''){
            this.$Message.warning("不能发表空评论哦")
        }
        else{
            var data = new URLSearchParams()
            data.append("userId",this.userId)
            data.append("momentId",momentId)
            data.append("content",content)
            axios({
                method:'POST',
                url:'/api/commentMoment/',
                data:data
            }).then((response)=>{
                if(response.data=='success'){
                    this.$Message.success("评论成功")
                    contentlist[index].value = ''
                    this.resetIndexComment(index,momentId)
                }
                else if(response.data=='failure'){
                    this.$Message.warning("评论失败")
                }
            })
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
            data.append("userId",this.userId)
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
                    this.resetIndexComment()
                }
                else if(response.data=='failure'){
                    this.$Message.warning("评论失败")
                    this.commentLoad = false;
                }
            })
        }
    },
    love(ev,index,momentId){
        var loves = document.getElementsByClassName("button1")
        var tag = loves[index]
        if(tag.classList.contains("isLoved")){
            tag.classList.remove("isLoved");
            tag.classList.add("isUnloved");
            axios.post("/api/unloveMoment/"+this.userId+"/"+momentId).then((response)=>{
            })
            
        }
        else if(tag.classList.contains("isUnloved")){
            tag.classList.remove("isUnloved");
            tag.classList.add("isLoved");
            axios.post("/api/loveMoment/"+this.userId+"/"+momentId).then((response)=>{
            })
        }
    },
    resetIndexLove(){
        var loveaxios = []
         for(let moment of this.indexMoments){
              var axios4 = axios.get("/api/checkLove/"+this.userId+"/"+moment.id);
              loveaxios.push(axios4)
          }
          axios.all(loveaxios).then((response)=>{
              for(let res of response){
                  if(res.data == "yes"){
                      this.isLove.splice(response.indexOf(res),1,true)
                  }
                  else{
                      this.isLove.splice(response.indexOf(res),1,false)

                  }
              }
          })
    },
    resetLoveNum(momentId){
        axios.get("/api/getMoment/"+momentId).then((response)=>{
            this.detailIndex = response.data[0]
        })
    },
    loveDetail(ev,momentId){
        var tag = ev.currentTarget;
        if(tag.classList.contains("isLoved")){
            tag.classList.remove("isLoved");
            axios.post("/api/unloveMoment/"+this.userId+"/"+momentId).then((response)=>{
                if(response.data == "failure"){
                    this.$Message.warning("请求失败")
                }
                else{
                    this.resetIndexLove(momentId)
                    this.resetLoveNum(momentId)
                }
            })
        }
        else{
            tag.classList.add("isLoved");
            axios.post("/api/loveMoment/"+this.userId+"/"+momentId).then((response)=>{
                if(response.data == "failure"){
                    this.$Message.warning("请求失败")
                }
                else{
                    this.resetIndexLove()
                    this.resetLoveNum(momentId)
                }
            })
        }
    },
    changeSubscribe(event){
    },
    loadImage(img){
        return new Promise((resolve,reject)=>{
            img.setAttribute('crossOrigin','anonymous');
            img.onload = () => resolve(img)
            img.onerror = reject
        })
    },
    getImageColor(canvas,img){
        img.setAttribute('crossOrigin','anonymous');
        var context = canvas.getContext("2d");
        context.drawImage(img, 0, 0,canvas.width,canvas.height)
        if(img.style.width == "auto"){
            var data1 = context.getImageData(0,0,canvas.width/2,canvas.height).data;
            var data2 = context.getImageData(canvas.width/2,0,canvas.width,canvas.height).data
            var color1 = this.getAverageRGB(data1,canvas.width/2,canvas.height)
            var color2 = this.getAverageRGB(data2,canvas.width/2,canvas.height)
            context.fillStyle = 'rgb(' + color1.r + ',' + color1.g + ','+ color1.b +')';
            context.fillRect(0,0,canvas.width/2,canvas.height)
            context.fillStyle = 'rgb(' + color2.r + ',' + color2.g + ','+ color2.b +')';
            context.fillRect(canvas.width/2,0,canvas.width,canvas.height)
        }else{
            var data1 = context.getImageData(0, 0, canvas.width, canvas.height/2).data;
            var data2 = context.getImageData(0, canvas.height/2, canvas.width, canvas.height).data;
            var color1 = this.getAverageRGB(data1,canvas.width, canvas.height/2)
            var color2 = this.getAverageRGB(data2,canvas.width, canvas.height/2)
            context.fillStyle = 'rgb(' + color1.r + ',' + color1.g + ','+ color1.b +')';
            context.fillRect(0, 0, canvas.width, canvas.height/2)
            context.fillStyle = 'rgb(' + color2.r + ',' + color2.g + ','+ color2.b +')';
            context.fillRect(0, canvas.height/2, canvas.width, canvas.height)

        }
    },
    getAverageRGB(data,width,height){
        var r = 0.0
        var g = 0.0
        var b = 0.0
        // 取所有像素的平均值
        for (var row = 0; row < height; row++) {
            for (var col = 0; col < width; col++) {
                r += data[((width * row) + col) * 4];
                g += data[((width * row) + col) * 4 + 1];
                b += data[((width * row) + col) * 4 + 2];
            }
        }
    
        // 求取平均值
        r /= (width * height);
        g /= (width * height);
        b /= (width * height);
    
        // 将最终的值取整
        r = Math.round(r);
        g = Math.round(g);
        b = Math.round(b);

        var color = {"r":r,"g":g,"b":b}
        return color
    },
    resetPics(){
        let boxs = document.getElementsByClassName("pic-box")
        for(let box of boxs){
            let works = []
            let imgs = box.getElementsByClassName("resetPic")
            let cans = box.getElementsByClassName("polaroid-color")
            let count = 0
            let min = 0.0
            let max = 0.0
            if(box.classList.contains("adjust")){
                for(let img of imgs){
                    let p = this.loadImage(img).then(img=>{
                        let h = img.offsetHeight;
                        if(count == 0){
                            min = h
                        }
                        else{
                            if(h < min){
                                min = h
                            }
                        }
                        count = count + 1
                    })
                    works.push(p)
                }
                Promise.all(works).then(()=>{
                    if(min >= 750){
                        min = 750
                    }
                    box.style.height = min + "px";
                    for(let img of imgs){
                        let h = img.offsetHeight;
                        if(h > min){
                            let offset = (img.offsetHeight - min) / 2
                            img.style.top = `-${offset}px`
                        }
                    }
                })
            }
            else if(box.classList.contains("polaroid")){
                for(let img of imgs){
                    let p = this.loadImage(img).then(img=>{
                        let h = img.offsetHeight;
                        if(h > max){
                            max = h
                        }
                    })
                    works.push(p)
                }
                Promise.all(works).then(()=>{
                    if(max < 750){
                        let index = 0;
                        for(let img of imgs){
                            let h = img.offsetHeight;
                            if(h < max){
                                    let offset = (max - img.offsetHeight) / 2
                                    img.style.top = `${offset}px`
                            }
                            // if(cans.length > 0){
                            //     cans[index].style.height = max + "px"
                            //     this.getImageColor(cans[index],img)
                            // }
                            index ++;
                        }
                    }
                    else{
                        max = 750
                        let index = 0;
                        for(let img of imgs){
                            let h = img.offsetHeight;
                            if(h >= max){
                                img.style.height = max + "px"
                                img.style.width = "auto"
                                let offset = (613 - img.offsetWidth) / 2
                                img.style.left = `${offset}px`
                            }
                            if(h < max){
                                    let offset = (max - img.offsetHeight) / 2
                                    img.style.top = `${offset}px`
                            }
                            // if(cans.length > 0){
                            //     cans[index].style.height = max + "px"
                            //     this.getImageColor(cans[index],img)

                            // }
                            index ++;
                        }
                    }
                   
                })
            }
        }
        
        
    },
    resetBigPics(){
        let boxs = document.getElementsByClassName('big-pic-box')
        for(let box of boxs){
            let imgs = box.getElementsByClassName('resetBigPic')
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
    showMoment(id,userId,index){
        this.moment = true;
        this.detailUser = this.momentUsers[index]
        this.detailPictures = this.momentPictures[index]
        this.resetBigPics()
        this.detailTopics = this.momentTopics[index]
        axios.get("/api/checkLove/"+this.userId+"/"+id).then((response)=>{
            if(response.data=="yes"){
                this.detailLove = true;
            }
            else{
                this.detailLove = false;
            }
        })
        axios.get("/api/getMoment/"+id).then((response)=>{
            this.detailIndex = response.data[0]
        })
        axios.get("/api/getMomentComments/"+id).then((response)=>{
            this.detailComments = response.data
        })
        axios.get("/api/checkSubscribe/"+this.userId+"/"+userId).then((response)=>{
            this.relation = response.data
        })
    },
    showMessageMoment(id){
        this.moment = true;
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
        axios.get("/api/checkLove/"+this.userId+"/"+id).then((response)=>{
            if(response.data=="yes"){
                this.detailLove = true;
            }
            else{
                this.detailLove = false;
            }
        })
        this.relation = "myself";
    },
    subscribe(ev,userId){
        if(ev.currentTarget.classList.contains("subscribe")){
            ev.currentTarget.classList.remove("subscribe");
            ev.currentTarget.innerHTML = '已关注'
            axios.get("/api/subscribe/"+this.userId+"/"+userId).then((response)=>{
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
            axios.get("/api/cancelSubscribe/"+this.userId+"/"+userId).then((response)=>{
                if(response.data=="success"){
                    this.$Message.warning("取消关注成功")

                }
                else{
                    this.$Message.warning("取消关注失败")
                }
            })
            

        }
    },
    showUpload(){
        this.upload = true;
    },
    handleRemove(file, fileList) {
        console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
        console.log(file.url);
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
    },
    resetPage(){
        this.pageLoading = true
        this.indexMoments = []
        this.momentUsers = []
        this.indexComments = []
        this.momentPictures = []
        this.momentTopics = []
        this.isLove = []
        axios.get("/api/getIndexMoments/"+this.userId).then((response)=>{
          this.indexMoments = response.data
          var useraxios = []
          var icommentaxios = []
          var picaxios = []
          var loveaxios = []
          var topicaxios = []
          for(let moment of response.data){
              var axios1 = axios.get("/api/getMomentUser/"+moment.id);
              var axios2 = axios.get("/api/getIndexComments/"+moment.id);
              var axios3 = axios.get("/api/getMomentPics/"+moment.id);
              var axios4 = axios.get("/api/checkLove/"+this.userId+"/"+moment.id);
              var axios5 = axios.get("/api/getTopics/"+moment.id)
              useraxios.push(axios1)
              icommentaxios.push(axios2)
              picaxios.push(axios3)
              loveaxios.push(axios4)
              topicaxios.push(axios5)
          }
          axios.all(useraxios).then((response)=>{
              for(let res of response){
                  this.momentUsers.push(res.data[0])
              }
          })     
          axios.all(icommentaxios).then((response)=>{
              for(let res of response){
                  this.indexComments.push(res.data)
              }
          })     
          axios.all(picaxios).then((response)=>{
              for(let res of response){
                  this.momentPictures.push(res.data)
              }
              this.pageLoading = false
              this.$Message.success("发表成功")
          })
          axios.all(loveaxios).then((response)=>{
              for(let res of response){
                  if(res.data == "yes"){
                      this.isLove.push(true)
                  }
                  else{
                      this.isLove.push(false)
                  }
              }
          })
          axios.all(topicaxios).then((response)=>{
              for(let res of response){
                  this.momentTopics.push(res.data)
              }
          })
      })
    },
    resetIndexComment(){
          var icommentaxios = []
          for(let moment of this.indexMoments){
              var axios2 = axios.get("/api/getIndexComments/"+moment.id);
              icommentaxios.push(axios2)
          }
          axios.all(icommentaxios).then((response)=>{
              for(let res of response){
                  this.indexComments.splice(response.indexOf(res),1,res.data)
              }
          })

    },
    resetDetailComment(momentId){
        axios.get("/api/getMomentComments/"+momentId).then((response)=>{
            this.detailComments = []
            this.detailComments = response.data
        })
    },
  },
  filters:{
      dateFrm: function(el){
          return moment(el).format("YYYY-MM-DD HH:mm");
      }
  },
  mounted(){
      if(localStorage.id == null){
          this.$router.push('/login')
      }
      else{
          document.title = 'Lucere'
          this.userId = localStorage.id
          axios.get("/api/getIndexMoments/"+this.userId).then((response)=>{
          this.indexMoments = response.data
          var useraxios = []
          var icommentaxios = []
          var picaxios = []
          var loveaxios = []
          var topicaxios = []
          for(let moment of response.data){
              var axios1 = axios.get("/api/getMomentUser/"+moment.id);
              var axios2 = axios.get("/api/getIndexComments/"+moment.id);
              var axios3 = axios.get("/api/getMomentPics/"+moment.id);
              var axios4 = axios.get("/api/checkLove/"+this.userId+"/"+moment.id);
              var axios5 = axios.get("/api/getTopics/"+moment.id)
              useraxios.push(axios1)
              icommentaxios.push(axios2)
              picaxios.push(axios3)
              loveaxios.push(axios4)
              topicaxios.push(axios5)
          }
          axios.all(useraxios).then((response)=>{
              for(let res of response){
                  this.momentUsers.push(res.data[0])
              }
          })     
          axios.all(icommentaxios).then((response)=>{
              for(let res of response){
                  this.indexComments.push(res.data)
              }
          })     
          axios.all(picaxios).then((response)=>{
              for(let res of response){
                  this.momentPictures.push(res.data)
              }
              this.pageLoading = false
          })
          axios.all(loveaxios).then((response)=>{
              for(let res of response){
                  if(res.data == "yes"){
                      this.isLove.push(true)
                  }
                  else{
                      this.isLove.push(false)
                  }
              }
          })
          axios.all(topicaxios).then((response)=>{
              for(let res of response){
                  this.momentTopics.push(res.data)
              }
          })
      })
      axios.get("/api/getMessages/"+this.userId).then((response)=>{
          this.messages = response.data
      })
      axios.get("/api/getSubscribeMessages/"+this.userId).then((response)=>{
          this.subscribeMessages = response.data
      })
      }
      axios.get("/api/getRecommendFans/"+this.userId).then(response=>{
          this.recommendFans = response.data
          var aaa = []
          for(let one of this.recommendFans){
              var ax = axios.get("/api/checkSubscribe/"+this.userId+"/"+one.id)
              aaa.push(ax)
          }
          axios.all(aaa).then(response=>{
              for(let res of response){
                  this.recommendRelations.push(res.data)
              }
          })
      })
      
  },
  updated(){
    this.resetPics()
    this.resetBigPics()
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
    z-index:5;
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

.resuser:hover{
    background: #f5f7f9;
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
    margin-top:100px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    min-height: 100vh;
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
    z-index:10;
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

/* Above are Header */

.sidebar{
    width:300px;

}

.momenthead{
    width: 100%;
    height:60px;
    padding:11px;
    border-bottom:1px rgb(219, 218, 218) solid;

}

.momenthead .user-info{
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    padding-top:8px;
    padding-left:7px;
    text-align: left;
}

.momenthead .user-info .account{
    color:black;
    font-size:15px;
    font-weight:bold;
}

.momenthead .username{
    color:rgb(151, 148, 148);
    font-size:13.5px;
    padding-left:5px;
}

.moment{
    width:615px;
    margin-bottom:50px;
}

.moment-detail /deep/ .el-dialog__body{
    padding:0px;
    height:600px;
    width:auto;
}

.moment-detail /deep/ .el-dialog__header{
    padding:0px;
}

.clear /deep/ .el-dialog__body{
    padding:0px;
}

.clear /deep/ .el-dialog__header{
    padding:0px;
}

.release /deep/ .el-dialog__body{
    padding-top:0px;
}

/deep/ .ivu-messaige{
    z-index:3000;
}
.comment-area{
    text-align: left;
}

.comment-area .comment-input{
    outline:none;
    border:none;
    height:50px;
    padding-left:20px;
    width:550px;
    display:inline-block;

}

.comment-area .comment-submit{
    background: transparent;
    border: none;
    color: #2c3e50;
    font-size: 17px;
    font-weight: bold;
    outline:none;
}
.choices{
    text-align: left;
    padding:15px;
    padding-bottom:10px;
    padding-top:0px;
}

.isLoved{
    color:red;
}

.isUnloved{
    color:unset;
}

.subscribe{
    color:#2d8cf0;
}

.text{
    text-align: left;
    padding-left:17px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size:15px;
    color:black;
}

.text span{
    font-size:10px;
    color:grey;
    margin-left:10px;
}

.topic{
    padding-left:17px;

    text-align: left;
    margin-left: 0;
    font-size: 15px;
    color: #003569;
}

.comment{
    text-align: left;
    padding-left:17px;
    padding-top:7px;
    padding-bottom:6px;
    border-bottom:1px rgb(219, 218, 218) solid;
}

.comment h4{
    color:rgb(151, 148, 148);
    margin-bottom: 3px;
}
.comment span{
    margin-bottom:3px;
}
.comment .comment-user{
    font-weight: bold;
    margin-right:10px;
}

.comment .comment-content{
    color:rgb(71, 70, 70);
}

.pic-box{
    width:100%;
    height:auto;
    overflow: hidden;
    position: relative;
}

.pic-box img{
    width: 613px;
    height: auto;
    position:relative;
    vertical-align: bottom;
}

.polaroid-color{
    width:613px;
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


.recommend{
    text-align:left;
    background: white;
    padding:15px 10px;
    border-radius: 10px;
    min-height:100px;
}


.recommend h2{
    font-size:18px;
    padding-bottom:4px;
    border-bottom:1px rgb(219, 218, 218) solid;
    margin-bottom:0;
}

.recommend .one-person{
    padding:8px;
    border-bottom:1px rgb(219, 218, 218) dashed;
}

.recommend .one-person .info{
    display:inline-block;
}

.recommend .one-person h3{
    font-size:14px;
    background:transparent;
}

.recommend .one-person span{
    color:rgb(151, 148, 148);
    font-size:13px;
}

.recently{
    text-align:left;
    margin-top:40px;
    background: white;
    padding:15px 10px;
    border-radius:10px;
}

.recently h2{
    font-size:18px;
    padding-bottom:4px;
    border-bottom:1px rgb(219, 218, 218) solid;
    margin-bottom:0;
}

.recently .one-person{
    padding:8px;
    border-bottom:1px rgb(219, 218, 218) dashed;
}

.recently .one-person .info{
    display:inline-block;
}

.recently .one-person h3{
    font-size:14px;
    background:transparent;
    padding-bottom:5px;
}

.recently .one-person h4{
    font-size:11px;
    color:gray;
}

.recently .one-person span{
    color:rgb(129, 127, 127);
    font-size:13px;
}

.recently .one-person:hover{
    background: rgb(235, 242, 247);
    transform: scale(1.03)
}

/deep/ el-upload--picture-card{
    width:400px;
    height:300px;
}

.pic-upload{
    width:400px;
    height:300px;
}

</style>