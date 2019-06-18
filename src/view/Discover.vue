<template>
    <div class="outside" >
    <div class="inside" :style="{backgroundImage:'url('+detailPictures[0].picture+')'}">
    </div>
    <div class="symbol">
        <h1>发现</h1>
    <router-link to="/index">
    <Icon size="40" type="ios-aperture-outline" color="white" />
    </router-link>
    </div>
    <div style="background:transparent;">
    <Row type="flex" justify="center" class="content">
        <div class="moment bg">
        </div>
        <Row class="moment">
            <Col span="6" class="detail">
            <div style="height:94%;display: flex;flex-direction: column;">
            <div style="height:auto">
                <div class="topic">
                    <p style="color:palegoldenrod">{{detailTopic.name}}</p>
                </div>
                <Row class="detail-header">
                    <Col span="3">
                        <Avatar :src="detailUser.avatar" style="margin-left:5px;position:relative;top:10px;"/> 
                    </Col>
                    <Col offset="1" span="19" style="text-align:left;">
                    <h3><a>{{detailUser.account}}</a><span style="margin-left:10px;"> 
                        <a @click="cancelsubscribe(detailUser.id)" v-if="relation === 'yes'">已关注</a>
                        <a @click="subscribe(detailUser.id)" style="color:pink" v-if="relation === 'no'">关注</a>
                        </span></h3>
                        <p style="white-space:pre-line">{{detailMoment.content}}</p> 
                        <div>
                            <span style="font-size:14px;color:palegoldenrod" v-for="topic in momentTopics" :key="topic.id"><router-link :to="'/topic/'+topic.name.substring(1)">{{topic.name}} </router-link></span>
                        </div>
                        <span style="font-size:11px;opacity:0.7">{{detailMoment.time | dateFrm}}</span>                          
                    </Col>
                </Row>
                 </div>
                    <div class="comment">
                        <div v-for="comment in detailComments" :key="comment.id" class="one-comment">
                            <h4 class="name"><router-link :to="'/myprofile/'+comment.user_id">{{comment.account}}</router-link></h4><span style="font-size:11px;opacity:0.7" class="time">{{comment.time | dateFrm2}}</span>
                            <p style="margin-top:5px;white-space:pre-line">{{comment.content}}</p>
                        </div>
                    </div>
                 </div>
            <Row type="flex" align="middle" class="choices">
                <div class="like" style="display:inline-block;width:25%;text-align:left">
                <a @click="love(detailMoment.id)"><icon size="32" v-if="isLoved==='no'" style="color:white" type="md-heart"/></a>
                <a @click="unlove(detailMoment.id)"> <icon size="32" v-if="isLoved==='yes'" style="color:red" type="md-heart"/></a>
                <span>{{detailMoment.likes}}</span>
                </div>
                <input maxlength="100" type="text" v-model="comment" name="content" class="comment-input" placeholder="添加评论" />
                <a @click="makeComment(detailMoment.id)"><icon type="ios-send" style="color:white" size="33"/></a>
            </Row>
            </Col>
            <Col span="18" class="pic-box" :style="{backgroundImage:'url('+showPicture+')'}">
                <div class="modal">
                </div>
                <div class="show-pictures">
                    <Row class="picture-list">
                    </Row>
                    <Row type="flex"  style="width:100%;height:100%;align-items: center;">
                        <div v-for="(pic,index) in detailPictures" :key="pic.picture">
                            <Col v-if="index === showIndex" class="pictures picture-select">
                                <a @click="changePicture(index)"><img class="resetSelect" :src="pic.picture"/></a>
                            </Col></a>
                            <Col v-else class="pictures">
                                <a @click="changePicture(index)"><img class="resetSelect" :src="pic.picture"/></a>
                            </Col>
                        </div>
                    </Row>
                </div>
            </Col>
        </Row>
    </Row>
    <div class="list-modal"></div>
    <Row type="flex" class="list">
        <Col span="1">
        <a @click="beforePage">
        <Icon class="arrow" type="ios-arrow-back" size="33"/>
        </a>
        </Col>
        <Col span="22" style="overflow:auto;text-align:left;position: relative; left: 25px;">
                <Col v-for="(moment,index) in followMoments" :key="moment.id" :class="[index == selectIndex?'one-moment moment-select':'one-moment']">
                    <a @click="changeMoment(index)">
                        <img  class="resetCover" :src="covers[index]"/>
                    </a>
                </Col>   
        </Col>
        <Col span="1">
        <a @click="nextPage">
        <Icon class="arrow" type="ios-arrow-forward" size="33"/>
        </a>
        </Col>
    </Row>
    </div>
    </div>
</template>

<script>
import axios from "axios";
import moment, { RFC_2822 } from "moment";

export default {
  data () {
    return {
        userId: this.$route.params.id,
        page: 0,
        followMoments:[],
        covers:[],
        selectIndex:0,
        detailMoment:{},
        detailUser:{},
        detailComments:[],
        detailPictures:[],
        detailTopic:{},
        momentTopics:[],
        showIndex:0,
        relation:'',
        isLoved:'',
        showPicture:'',
        comment:'',
    }
  },
  methods:{
      getDetail(index){
          this.detailMoment = this.followMoments[index]
          this.showIndex = 0
          axios.get("/api/getMomentUser/"+this.detailMoment.id).then(response=>{
            this.detailUser = response.data[0]
          })
          axios.get("/api/getMomentComments/"+this.detailMoment.id).then(response=>{
              this.detailComments = response.data
          })
          axios.get("/api/getMomentPics/"+this.detailMoment.id).then(response=>{
            this.detailPictures = response.data
            this.showPicture = this.detailPictures[0].picture
            // this.resetPic()
          })
          axios.get("/api/getUserMomentTopic/"+this.userId+"/"+this.detailMoment.id).then(response=>{
              this.detailTopic = response.data[0]
          })
          axios.get("/api/checkSubscribe/"+this.userId+'/'+this.detailMoment.user_id).then(response=>{
              this.relation = response.data
          })
          axios.get("/api/getTopics/"+this.detailMoment.id).then(response=>{
              this.momentTopics = response.data
          })
          axios.get("/api/checkLove/"+this.userId+"/"+this.detailMoment.id).then(response=>{
              this.isLoved = response.data
          })
      },
      changePicture(index){
          this.showIndex = index;
          this.showPicture = this.detailPictures[index].picture
        //   this.resetPic()
      },
      resetMoment(momentId){
          axios.get("/api/getMoment/"+momentId).then(response=>{
              this.detailMoment = response.data[0]
          })
      },
      love(momentId){
          axios.post("/api/loveMoment/"+this.userId+"/"+momentId).then(response=>{
              if(response.data == 'failure'){
                  this.$Message.warning("请求失败")
              }
              else{
                    this.isLoved = 'yes'
                  this.resetMoment(momentId)
              }
          })
      },
      unlove(momentId){
          axios.post("/api/unloveMoment/"+this.userId+"/"+momentId).then(response=>{
              if(response.data == 'failure'){
                  this.$Message.warning("请求失败")
              }
              else{
                  this.isLoved = 'no'
                  this.resetMoment(momentId)
              }
          })
      },
      makeComment(momentId){
          if(this.comment==''){
              this.$Message.warning("评论不能为空哦")
              return
          }
          var data = new URLSearchParams();
          data.append("userId",this.userId)
          data.append("momentId",momentId)
          data.append("content",this.comment)
          axios({
              method:'POST',
              data:data,
              url:'/api/commentMoment'
          }).then(response=>{
              if(response.data == 'failure'){
                  this.$Message.warning("评论发表失败")
              }
              else{
                  axios.get("/api/getMomentComments/"+this.detailMoment.id).then(response=>{
                        this.detailComments = response.data
                        this.comment = ''
                  })
              }
          })
      },
      subscribe(userId){
          axios.get("/api/subscribe/"+this.userId+"/"+userId).then(response=>{
              if(response.data == "failure"){
                  this.$Message.warning("请求失败")
              }
              else{
                  this.relation = 'yes'
              }
          })
      },
      cancelsubscribe(userId){
          axios.get("/api/cancelSubscribe/"+this.userId+"/"+userId).then(response=>{
              if(response.data == "failure"){
                  this.$Message.warning("请求失败")
              }
              else{
                  this.relation = 'no'
              }
          })
      },
      changeMoment(index){
          this.selectIndex = index;
          this.getDetail(index)
      },
      beforePage(){
          if(this.page == 0){
              this.$Message.warning("没有更多了")
              return
          }
          else{
              this.selectIndex = -1
             this.page -- 
             this.covers = []
            axios.get("/api/getUserFollowMoments/"+this.userId+"/"+this.page).then(response=>{
                this.followMoments = response.data
                var coveraxios = []
                for(let moment of this.followMoments){
                    var cax = axios.get("/api/getCover/"+moment.id)
                    coveraxios.push(cax)
                }
                axios.all(coveraxios).then(response=>{
                    for(let res of response){
                        this.covers.push(res.data[0].picture)
                    }
                    
                })
            })
          } 
      },
      nextPage(){
          axios.get("/api/getUserFollowMoments/"+this.userId+"/"+this.page+1).then(response=>{
                if(response.data.length == 0){
                    this.$Message.warning("没有更多了")
                    return
                }
                this.covers = []
                this.selectIndex = -1
                this.page ++
                this.followMoments = response.data
                var coveraxios = []
                for(let moment of this.followMoments){
                    var cax = axios.get("/api/getCover/"+moment.id)
                    coveraxios.push(cax)
                }
                axios.all(coveraxios).then(response=>{
                    for(let res of response){
                        this.covers.push(res.data[0].picture)
                    }
                    
                })
            })
      },
      resetCovers(){
          var imgs = document.getElementsByClassName("resetCover")
          for(let img of imgs){
              img.onload = function(){
              let h = img.offsetHeight;
              if(h > 105){
                  let offset = (h - 105)/2
                  img.style.bottom = offset + "px"
              }
              else{
                  img.style.height = "105px"
                  img.style.width = "auto"
              }
              }
              
          }
      },
      resetSelects(){
          var imgs = document.getElementsByClassName("resetSelect")
          for(let img of imgs){
              img.onload = function(){
                  let h = img.offsetHeight;
                  if(h > 100){
                    let offset = (h - 100)/2
                    img.style.bottom = offset + "px"
                  }
                else{
                    img.style.height = "100px"
                    img.style.width = "auto"
                }
              }
          }
      },
      resetPic(){
        var box = document.getElementsByClassName("pic-box")[0]
        if(this.detailMoment.type==0){
            box.style.backgroundSize = "cover";
        }
      },
      resetBg(){
          var img = document.getElementById("body")
          img.onload = function(){
            var w = img.offsetWidth
            var width = document.getElementById("outside").offsetWidth
            var height = document.getElementById("outside").offsetHeight
            if(w > width){
                let offset = (w - width)/2
                img.style.right = offset+"px"
            }
            else{
                img.style.width = "100%"
                img.style.height = "auto"
                let offset = (img.offsetHeight - height)/2
                img.style.top = -offset+"px"
            }
          }
          

      }
  },
  filters:{
      dateFrm: function(el){
          return moment(el).format("YYYY-MM-DD HH:mm");
      },
      dateFrm2: function(el){
          return moment(el).format("MM-DD HH:mm");
      }
  },
  mounted(){
      this.userId = localStorage.id
      document.title = "Discover Lucere"
      axios.get("/api/getUserFollowMoments/"+this.userId+"/"+this.page).then(response=>{
          this.followMoments = response.data
          var coveraxios = []
          for(let moment of this.followMoments){
              var cax = axios.get("/api/getCover/"+moment.id)
              coveraxios.push(cax)
          }
          axios.all(coveraxios).then(response=>{
              for(let res of response){
                  this.covers.push(res.data[0].picture)
              }
              
          })
          this.getDetail(0)
      })
  },
  updated(){
      this.resetCovers()
    //   this.resetSelects()
    //   this.resetPic()
    //   this.resetPolaroid()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

a{
    color:unset;
}

h1,h3,h4,p,span{
    color:white;
    font-weight: bold;
}

.outside{
    position:relative;min-width:1185px;text-align:left;height:100vh;overflow:auto;
    width:100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    backdrop-filter: blur(3px);
}

.inside{
    position:absolute;
    width: 100%;
    text-align:left;
    height:100vh;
    overflow:auto;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    filter:blur(2px) brightness(0.8);
}

.symbol{
    position:absolute;
    opacity: 0.6;
    top: 10px;
    right: 30px;
}

.symbol h1{
    display: inline-block;
    font-size:30px;
    position:relative;
    top:7px;
    right:10px;

}
.body{
    z-index: -1;
    position:absolute;
    width: auto;
    height:102.3%;
    filter:blur(2px) brightness(0.8);
    text-align: left;

}

.content{
    width:100%;
    text-align: center;
}

.list{
    width: 100%;
    margin-top:30px;
    filter:brightness(0.5);
    transition:filter 0.5s;
}

.list:hover{
    filter:brightness(0.9)
}

.list-modal{
    width:100%;
    position: absolute;
    height:130px;
    margin-top:30px;
    background:black;
    opacity:0.4;
}

.detail{
    height:100%;
}
.moment{
    padding:10px;
    height:580px;
    margin-top:70px;
    /* margin-left:7.5%;
    margin-right:7.5%; */
    width:85%;
    text-align: center;
}

.bg{
    border-radius: 5px;
    position: absolute;
    background:black;
    opacity:0.3;
}


.pic-box{
    height:100%;
    overflow: hidden;
    background: white;
    background-position: center;
    background-repeat: no-repeat;
    background-size:cover;
}

.pic-box img{
    width:100%;
    height:auto;
    position: relative;
}

.show-modal{
    display:none;
}

.modal{
    position:absolute;
    width:100%;
    height:100%;
    background:#cac5c5;
    opacity: 0.2;
    display: none;
    right:0px;
}

.on-modal{
    position:absolute;
    width:100%;
    height:100%;
}


.pic-box:hover .modal{
    display:inline;
}

.show-pictures{
    position:absolute;
    bottom: 0;
    height: 0;
    z-index:10;
    transition-duration: 1s;
    transition-property: height;
}

.pic-box:hover .show-pictures{
    height: 25%;
}

.picture-list{
    background: black;
    opacity: 0.6;
    position:absolute;
    height:100%;
    width:903px;
}

.pictures{
    border:#cac5c5 4px solid;
    border-radius: 3px;
    width:160px;
    margin:0px 10px;
    height:100px;
    display: inline-block;
    overflow: hidden;
}

.pictures img{
    width:100%;
    height:auto;
    position: relative;
}

.picture-select{
    border:#be18b1 4px solid;

}

.topic{
    color:white;
    font-weight: bolder;
    font-size: 55px;
    position: relative;
    right: 50px;
    bottom: 40px;
    text-align: left;
}

.detail-header{

}

.detail-header h3{
    font-size:15px;
    font-weight:bold;
}

.detail-header p{
    font-size:14px;
    margin:5px 0px 0px 0px;;
}


.comment{
    overflow: auto;
    text-align: left;
    margin-top:20px;
    margin-left:60px;
    padding-right:50px;
    height:100%;
}

.one-comment{
    padding-bottom: 20px;
}

.one-comment h4,span,p{
    word-break: break-all;
}

.one-comment h4{
    font-size:14px;
    display: inline-block;
}

.one-comment span{
    font-size:12px;
    font-weight:500;
    margin-left:10px;
}

.one-comment p{
    font-size:13px;
}
.choices{
    height:auto;
    padding-left:5px;
}

.comment-input{
    background: transparent;
    outline: none;
    border: none;
    color:white;
    margin-left:10px;
    font-size:14px;
    position: relative;
    top:1px;
    width:55%;
}
.comment-input::-webkit-input-placeholder {
    /* placeholder颜色  */
    color: white;
    /* placeholder字体大小  */
    font-size: 13px;
         
}

.choices span{
    font-size:20px;
    position: relative;
    top:5px;
}

.like{
    border-right: solid 1px #cac5c5;
    display: inline-block;
    padding-right: 8px;
}

.one-moment{
    display:inline-block;
    width:13%;
    height:105px;
    overflow: hidden;
    margin:13px 10px 0 0px;
    border-radius:5px;
}

.one-moment img:hover{
    filter:brightness(0.5);
    transform:scale(1.2);
}

.one-moment img{
    width:100%;
    height:auto;
    position: relative;
    transition:filter .5s;
    transition:transform .5s;
}

.moment-select{
    border:rgb(247, 241, 241) 4px solid;
}

.moment-select img{
    filter:brightness(0.5);
    transform: scale(1.2)
}

.arrow{
    color:white;
    margin-top: 50px;
    opacity: 0.4;
    text-align: center;
    justify-content: center;
}

</style>
