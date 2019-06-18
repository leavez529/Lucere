<template>
<div>
  <body class="back">
    <div class="register" id="register" v-show="!login">
      <Card>
        <h1>注册</h1>
        <div class="input">
          <div class="message-div">
            <Input :maxlength="16" show-word-limit v-model="account" size="large" placeholder="Account" icon="ios-contact" @on-blur="checkAccount" @on-change='checkRegisterAble' class="frame"/>
            <span v-show=repeat class="message">该账号已被注册</span>
            <span v-show=false class="message">账号不能为空</span>
          </div>
          <div class="message-div">
          <Input :maxlength="10" show-word-limit v-model="username" size="large" placeholder="Username" icon="ios-create" @on-change='checkRegisterAble' class="frame"/>
          <span v-show=false class="message">用户名不能为空</span>
          </div>
          <div class="message-div">
          <Input :maxlength="16" v-model="password" type="password" size="large" placeholder="Password" @on-blur="checkAgain" @on-change='checkRegisterAble' icon="ios-key" show-password class="frame"/>
          <span v-show=false class="message">密码不能为空</span>
          </div>
          <div class="message-div">
            <Input
                size="large"
                v-model="again"
                type="password" 
                :maxlength="16"
                @on-blur="checkAgain" 
                @on-change='checkRegisterAble'
                placeholder="Password Again"
                show-password
                icon="ios-key"
                class="frame"
            />
            <span v-show=consistence class="message">两次密码输入不一致</span>
          </div>
          <Button type="primary" long style="margin-top:4px" :disabled="registerable" v-on:keyup.enter="register" @click="register"><h3>注册</h3></Button>
        </div>
      </Card>
      <Card style="margin-top:25px">
        <span>
          已有账户？请
          <a @click="trigger">登录</a>
        </span>
      </card>
    </div>
    <div class="login" id="login" v-show="login">
      <Card>
        <h1>登录</h1>
        <div class="input">
          <div class="message-div">
          <Input v-model="account" size="large" placeholder="Account" @on-change='checkLoginAble' icon="ios-contact" class="frame"/>
          <span v-show=false class="message">账号不能为空</span>
          <span v-show=false class="message">该账号不存在</span>
          </div>
          <div class="message-div">
          <Input :maxlength="16" v-model="password" type="password" size="large" @on-change='checkLoginAble' placeholder="Password" icon="ios-key" class="frame"/>
          <span v-show=false class="message">密码错误</span>
          </div>
          <Button type="primary" long style="margin-top:4px" :disabled="loginable" @click="signIn" @keyup.enter="signIn"><h3>登录</h3></Button>
        </div>
      </Card>
      <Card style="margin-top:25px">
        <span>
          没有账户？请
          <a @click="trigger">注册</a>
        </span>
      </card>
    </div>
  </body>
</div>
</template>

<script>
import axios from "axios";

export default {
  name: 'HelloWorld',
  data () {
    return {
      login:false,
      account:'',
      password:'',
      username:'',
      repeat:false,
      again:'',
      consistence:false,
      loginable:true,
      registerable:true,
      storage:{
        id:0
      }
    };
  },
  methods:{
    trigger(){
        this.login = !this.login
    },
    checkAccount(){
      axios.get('/api/checkAccount/'+this.account).then((response)=>{
          if(response.data == 'no repeat'){
            this.repeat=false;
            this.checkRegisterAble();
          }
          else{
            this.repeat=true;
            this.registerable=true;
          }
        })
    },
    checkPassword(){

    },
    checkAgain(){
        if(this.password==this.again){
            this.consistence=false
            this.checkRegisterAble();
        }
        else{
            this.consistence=true;
            this.registerable=true;
        }
    },
    checkRegisterAble(){
        if(this.account!=''&&this.username!=''&&this.password!=''&&this.again!=''&&this.repeat==false&&this.consistence==false){
            this.registerable=false;
        }
        else{
            this.registable=true;
        }
    },
    checkLoginAble(){
        if(this.account!=''&&this.password!=''){
            this.loginable=false;
        }
        else{
            this.loginable=true;
        }
    },
    register(){
      axios.post("/api/register/"+this.account+'/'+this.username+'/'+this.password).then((response)=>{
        if(response.data == 'failure'){
          this.$Message.error("注册失败")
        }
        else{
          localStorage.setItem('id',response.data.insertId)
          this.$router.push("/index");
        }
      })
    },
    signIn(){
      axios.get("/api/login/"+this.account+"/"+this.password).then((response)=>{
        if(response.data == 'failure'){
          this.$Message.error("登录失败")
        }
        else if(response.data == 'no user'){
          this.$Message.warning("该账号不存在")
        }
        else if(response.data == 'wrong'){
          this.$Message.error("密码错误")
        }
        else{
          localStorage.setItem('id',response.data[0]["id"])
          this.$router.push("/index");
          this.$Message.success("登录成功")
        }
      })
    }
  },
  mounted(){
    document.title = "Welcome to Lucere!"
  }
}
</script>
<style scoped>
.back {
    background: url("/static/timg.jpeg");
    background-size:cover;
    background-repeat: no-repeat;
    background-position: center;
    height: 100vh;
    width:100%;
    overflow: auto;
}

.login {
  width: 350px;
  height: 500px;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  margin-top:150px;
}

.login h1 {
  margin-top: 0px;
  margin-bottom: 0px;
  color: rgb(110, 109, 109);
}

.register {
  width: 350px;
  height: 500px;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  margin-top:150px;
}

.register h1 {
  margin-top: 0px;
  margin-bottom: 0px;
  color: rgb(110, 109, 109);
}


.input {
    margin:20px 20px 15px 20px;
}

.frame {
  margin-bottom: 20px;
}

.message-div{
    position: relative;
}

.message-div .message{
    position: absolute;
    bottom: 0;
    color: red;
    left: 0;
    font-size: 10px;
}

</style>