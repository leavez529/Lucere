<template>
  <div class="bg">
    <div class="symbol">
    <router-link to="/index">
    <Icon size="40" type="ios-aperture-outline" color="white" />
    </router-link>
        <h1>#话题</h1>
    </div>
    <div class="navi">
        <router-link to="/discover">
        <Icon type="md-globe" color="white" size="36" />
        </router-link>
        <router-link :to="'/myprofile/'+this.userId">
        <Icon type="md-person" color="white" size="36" />
        </router-link>
    </div>
    <div class="search">
    </div>
    <div class="content">
        <div class="header">
            <h1>{{topic.name}}</h1>
                <a @click="follow"><div v-if="topicFollow==='no'" class="button">关注</div></a>
                <a @click="cancelFollow"><div v-if="topicFollow==='yes'" class="button">已关注</div></a>
            <h2>{{topic.total}}个动态</h2>
        </div>
        <div v-if="selectIndex === 0" class="select">
            <h2 style="color:white">热门</h2>
            <Divider type="vertical" orientation="center" class="divide"/>
            <a @click="toNew"><h2>最新</h2></a>
        </div>
        <div v-if="selectIndex === 1" class="select">
            <a @click="toHot"><h2>热门</h2></a>
            <Divider type="vertical" orientation="center" class="divide"/>
            <h2 style="color:white">最新</h2>
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
                                    <div style="display:inline-block" v-if="relation==='yes'"><a @click="detailSubscribe($event,detailUser.user_id)">已关注</a></div>
                                    <div style="display:inline-block" v-else-if="relation==='no'" ><a class="no-subscribe" @click="detailSubscribe($event,detailUser.user_id)">关注</a></div>
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
                            <a v-if="detailLove" class="love" @click="loveDetail($event,detailIndex.id)"><Icon type="md-heart" size="30" style="margin-left:7px;margin-top:5px;"/></a>
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
            <waterfall :col='4' :width="300" :gutterWidth="15" :data="topicMoments">
             <Card v-for="(item,index) in topicMoments" :key="item.id" class="one-moment" :padding="0">
                <Row type="flex" align="middle" style="text-align:left;" slot="title">
                    <Avatar :src="indexUsers[index].avatar"/>
                    <router-link :to="'/myprofile/'+item.user_id">
                    <h4>{{indexUsers[index].account}}</h4> 
                    </router-link>
                    <a @click="subscribe(item.user_id)"><span v-if="usersSubscribe[index]==='no'" class="subscribe no-subscribe">关注</span></a>
                    <a @click="cancelSubscribe(item.user_id)"><span v-if="usersSubscribe[index]==='yes'" class="subscribe">已关注</span></a>
                </Row>
                <div class="pic-box">
                    <div v-if="item.pictures>1" class="count">
                        <span>{{item.pictures}}</span>
                    </div>
                    <img :src="covers[index].picture">
                </div>
                <div v-if="item.content!=''" class="text">
                    <p style="white-space:pre-line">{{item.content}}</p>
                </div>
                <div class="choices">
                    <a v-if="momentsLove[index]==='yes'" class="heart love" @click="love($event,item.id,index)"><Icon size="25"  type="md-heart"/></a>
                    <a v-if="momentsLove[index]==='no'" class="heart" @click="love($event,item.id,index)"><Icon size="25" type="md-heart"/></a>
                    <span>{{momentLikes[index]}}</span>
                    <a @click="showMoment(item.id,item.user_id,index)">
                    <span style="margin-left: 7px;
                    font-size: 10px;
                    color: black;
                    opacity: 0.6;">{{item.time | dateFrm}}</span></a>
                    <a @click="showMoment(item.id,item.user_id,index)">
                    <Icon size="25" type="ios-chatbubbles" style="position:absolute;right:16px;"/></a>
                </div>
            </Card>
        </waterfall>`
           

    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment, { RFC_2822 } from "moment";

export default {
  data () {
    return {
      name:this.$route.params.name,
      topic:{},
      topicId:0,
      topicMoments:[],
      indexUsers:[],
      usersSubscribe:[],
      momentsLove:[],
      momentLikes:[],
      covers:[],
      page:0,
      topicFollow:'no',
      userId:1,
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
    moment: false,
    selectIndex:0
    }
  },
  methods:{
      goProfile(userId){
        this.$router.push("/myprofile/"+userId);
        // this.$router.go(0);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      },
      toHot(){
          this.topicMoments = []
          this.selectIndex = 0;
          this.indexUsers = []
          this.covers = []
          this.momentsLove = []
          this.usersSubscribe = []
          axios.get("/api/getTopicMomentsByLikes/"+this.topic.id+"/"+this.page).then(response=>{
            this.topicMoments = response.data
            var works = []
            var coveraxios = []
            var loveaxios = []
            var subaxios = []
            for(let moment of this.topicMoments){
                var ax = axios("/api/getMomentUser/"+moment.id)
                works.push(ax)
                var cax = axios("/api/getCover/"+moment.id)
                coveraxios.push(cax)
                var lax = axios("/api/checkLove/"+this.userId+"/"+moment.id)
                loveaxios.push(lax)
                var sax = axios("/api/checkSubscribe/"+this.userId+"/"+moment.user_id)
                subaxios.push(sax)
                this.momentLikes.push(moment.likes)
            }
            axios.all(works).then(response=>{
                for(let res of response){
                    this.indexUsers.push(res.data[0])
                }
            })
            axios.all(coveraxios).then(response=>{
                for(let res of response){
                    this.covers.push(res.data[0])
                }
            })
            axios.all(loveaxios).then(response=>{
                for(let res of response){
                    this.momentsLove.push(res.data)
                }
            })
            axios.all(subaxios).then(response=>{
                for(let res of response){
                    this.usersSubscribe.push(res.data)
                }
            })
        })
      },
      toNew(){
          this.topicMoments = []
          this.selectIndex = 1;
          this.indexUsers = []
          this.covers = []
          this.momentsLove = []
          this.usersSubscribe = []
          axios.get("/api/getTopicMomentsByTime/"+this.topic.id+"/"+this.page).then(response=>{
            this.topicMoments = response.data
            var works = []
            var coveraxios = []
            var loveaxios = []
            var subaxios = []
            for(let moment of this.topicMoments){
                var ax = axios("/api/getMomentUser/"+moment.id)
                works.push(ax)
                var cax = axios("/api/getCover/"+moment.id)
                coveraxios.push(cax)
                var lax = axios("/api/checkLove/"+this.userId+"/"+moment.id)
                loveaxios.push(lax)
                var sax = axios("/api/checkSubscribe/"+this.userId+"/"+moment.user_id)
                subaxios.push(sax)
                this.momentLikes.push(moment.likes)
            }
            axios.all(works).then(response=>{
                for(let res of response){
                    this.indexUsers.push(res.data[0])
                }
            })
            axios.all(coveraxios).then(response=>{
                for(let res of response){
                    this.covers.push(res.data[0])
                }
            })
            axios.all(loveaxios).then(response=>{
                for(let res of response){
                    this.momentsLove.push(res.data)
                }
            })
            axios.all(subaxios).then(response=>{
                for(let res of response){
                    this.usersSubscribe.push(res.data)
                }
            })
        })
      },
      follow(){
          axios.get("/api/follow/"+this.userId+"/"+this.topicId).then(response=>{
              if(response.data == 'success'){
                  this.topicFollow = 'yes'
                  this.$Message.success("关注成功")
              }
              else{
                  this.$Message.warning("关注失败")
              }
          })
      },
      cancelFollow(){
          axios.get("/api/cancelFollow/"+this.userId+"/"+this.topicId).then(response=>{
              if(response.data == 'success'){
                  this.topicFollow = 'no'
                  this.$Message.success("取消关注成功")
              }
              else{
                  this.$Message.warning("取消关注失败")
              }
          })
      },
      resetSubscribe(){
            var subaxios = []
            for(let moment of this.topicMoments){
                var sax = axios("/api/checkSubscribe/"+this.userId+"/"+moment.user_id)
                subaxios.push(sax)
            }
            axios.all(subaxios).then(response=>{
                for(let res of response){
                    this.usersSubscribe.splice(response.indexOf(res),1,res.data)
                }
            })
      },
      resetRelation(userId){
          axios.get("/api/checkSubscribe/"+this.userId+"/"+userId).then((response)=>{
            this.relation = response.data
        })
      },
      resetIndexLove(){
          for(let moment of this.topicMoments){
              axios.get("/api/getMoment/"+moment.id).then(response=>{
                  this.momentLikes.splice(this.topicMoments.indexOf(moment),1,response.data[0].likes)
              })
          }
      },
      subscribe(userId){
          axios.get("/api/subscribe/"+this.userId+"/"+userId).then(response=>{
              if(response.data == 'failure'){
              }
              else{
                  this.resetSubscribe()
              }
          })
      },
      cancelSubscribe(userId){
          axios.get("/api/cancelSubscribe/"+this.userId+"/"+userId).then(response=>{
              if(response.data == 'failure'){
              }
              else{
                  this.resetSubscribe()
              }
          })
      },
      detailSubscribe(ev,userId){
          var tag = ev.currentTarget;
          if(tag.classList.contains("no-subscribe")){
              axios.get("/api/subscribe/"+this.userId+"/"+userId).then(response=>{
              if(response.data == 'failure'){
              }
              else{
                  this.resetSubscribe()
                  this.resetRelation(userId)
                  tag.classList.remove("no-subscribe")
                  tag.InnerHTML = "已关注"
              }
              })
          }
          else{
              axios.get("/api/cancelSubscribe/"+this.userId+"/"+userId).then(response=>{
              if(response.data == 'failure'){
              }
              else{
                  this.resetSubscribe()
                  this.resetRelation(userId)
                  tag.classList.add("no-subscribe")
                  tag.InnerHTML = "关注"

              }
              })
          }
      },
      love(ev,momentId,index){
          var heart = ev.currentTarget;

          if(heart.classList.contains("love")){
              axios.post("/api/unloveMoment/"+this.userId+"/"+momentId).then(response=>{
              if(response.data == 'failure'){

              }
              else{
                  heart.classList.remove("love")
                  this.resetIndexLove()
              }
          })
          }
          else{
              axios.post("/api/loveMoment/"+this.userId+"/"+momentId).then(response=>{
              if(response.data == 'failure'){

              }
              else{
                  heart.classList.add("love")
                  this.resetIndexLove()
              }
          })
          }  
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
        this.detailUser = this.indexUsers[index]
        axios.get("/api/getMomentPics/"+id).then(response=>{
            this.detailPictures = response.data
        })
        axios.get("/api/getTopics/"+id).then(response=>{
            this.detailTopics = response.data
        })
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
    loveDetail(ev,momentId){
        var tag = ev.currentTarget;
        if(tag.classList.contains("love")){
            tag.classList.remove("love");
            axios.post("/api/unloveMoment/"+this.userId+"/"+momentId).then((response)=>{
                if(response.data == "failure"){
                    this.$Message.warning("请求失败")
                }
                else{
                    this.resetIndexLove()
                    this.resetLoveNum(momentId)
                }
            })
        }
        else{
            tag.classList.add("love");
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
    resetLoveNum(momentId){
        axios.get("/api/getMoment/"+momentId).then((response)=>{
            this.detailIndex = response.data[0]
        })
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
                }
                else if(response.data=='failure'){
                    this.$Message.warning("评论失败")
                    this.commentLoad = false;
                }
            })
        }
    },
    resetDetailComment(momentId){
        axios.get("/api/getMomentComments/"+momentId).then((response)=>{
            this.detailComments = []
            this.detailComments = response.data
        })
    },
  },
  mounted(){
      this.userId = localStorage.id
      document.title = "Lucere#"+this.name
    axios.get("/api/getTopic/"+this.name).then((response)=>{
        this.topic = response.data[0]
        this.topicId = this.topic.id
        axios.get("/api/checkFollow/"+this.userId+"/"+this.topicId).then(response=>{
            this.topicFollow = response.data
        })
        axios.get("/api/getTopicMomentsByLikes/"+this.topic.id+"/"+this.page).then(response=>{
            this.topicMoments = response.data
            var works = []
            var coveraxios = []
            var loveaxios = []
            var subaxios = []
            for(let moment of this.topicMoments){
                var ax = axios("/api/getMomentUser/"+moment.id)
                works.push(ax)
                var cax = axios("/api/getCover/"+moment.id)
                coveraxios.push(cax)
                var lax = axios("/api/checkLove/"+this.userId+"/"+moment.id)
                loveaxios.push(lax)
                var sax = axios("/api/checkSubscribe/"+this.userId+"/"+moment.user_id)
                subaxios.push(sax)
                this.momentLikes.push(moment.likes)
            }
            axios.all(works).then(response=>{
                for(let res of response){
                    this.indexUsers.push(res.data[0])
                }
            })
            axios.all(coveraxios).then(response=>{
                for(let res of response){
                    this.covers.push(res.data[0])
                }
            })
            axios.all(loveaxios).then(response=>{
                for(let res of response){
                    this.momentsLove.push(res.data)
                }
            })
            axios.all(subaxios).then(response=>{
                for(let res of response){
                    this.usersSubscribe.push(res.data)
                }
            })
        })

    })

  },
  filters:{
      dateFrm: function(el){
          return moment(el).format("YYYY-MM-DD HH:mm");
      }
  },
  updated(){
      this.resetBigPics()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

a {
  color: unset;
}

h1,h3{
    color:#9d8863;
}

.bg{
    background:rgb(250, 197, 99);
    width:100%;
    height:100vh;
    overflow: auto;
}

.symbol{
    position: absolute;
    left:20px;
}

.symbol h1{
    display: inline-block;
    font-size:40px;
    position:relative;
    top:10px;
    left:20px;
}

.navi{
    position:absolute;
    right: 50px;
    top: 25px;
}

.navi i{
    margin-left:30px;
    opacity:0.6;
}
.content{
    padding-left:6.5%;
    padding-right:6.5%;
    padding-top:150px;

}

.header{
    text-align: left;
    padding-left:40px;
}

.header h1{
    font-size:70px;
    display: inline-block;
}

.header h2{
    font-size:20px;
}
.button{
    margin-left:50px;
    display: inline-block;
    width:80px;
    border:#9d8863 2px solid;
    text-align: center;
    font-size:15px;
    font-weight: bolder;
}

.select{
    text-align: left;
    margin-top:50px;
    margin-bottom:30px;
}

.select h2{
    display: inline-block;
    color:#9d8863;
    font-size:27px;
}

.select-in{
    color:black;
    opacity:0.9
}

.divide{
    height:2em;
    background:#9d8863;
    position: relative;
    bottom:5px;
}

.one-moment{
    width:300px;
    height:auto;
    margin-bottom:20px;
}

.one-moment h4{
    display:inline-block;
    margin-left:10px;
    font-size:15px;
}

.one-moment .subscribe{
    margin-left:5px;
}

.no-subscribe{
    color:#0a77d4;
}

.pic-box{
    width:300px;
    display: block;
}

.pic-box img{
    width:100%;
    vertical-align: bottom;
}

.count{
    position:absolute;
    border-radius:3px;
    background:white;
    width:30px;
    height:20px;
    left:5px;
    top:65px;
    vertical-align: center;
    z-index:5;
}
.text{
    text-align: left;
    padding:8px 16px 0px 16px;
}

.text p{
    color:#444;
    font-size:15px;
    font-weight: 600;
}

.choices{
    text-align:left;
    padding:10px 16px 8px 16px;
}

.choices span{
    font-weight:bold;
}

.love{
    color:red;
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
    vertical-align: bottom;
    position:relative;
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


</style>