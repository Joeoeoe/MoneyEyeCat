<template>
    <div class="container">

        <form class="login-form" >
            <p class="login-font" :class="usernameStatus === 1? '':'wrong-color'">{{usernameTip}}</p>
            <input class="global-user-input" v-model="inputUsername"/>
            <p class="login-font" :class="passwordStatus === 1? '':'wrong-color'">{{passwordTip}}</p>
            <input class="global-user-input" type="password" v-model="inputPassword"/>
            <p class="login-font forget-password">忘记密码？</p>
            <button class="global-user-btn login-btn" type="button" @click="loginFunction">
                <loading-com background="#fff" v-show="isLoading"></loading-com>
                <span v-show="!isLoading">登录</span>
            </button>
            <p class="login-font-ask">还没有账号？<span class="login-font">注册</span></p>
        </form>
        <div class="coin coin1" :class="animationStatus === 1? 'coin1-animation':''" @animationend="nextAnimation"></div>
        <div class="coin coin2" :class="animationStatus === 2? 'coin2-animation':''" @animationend="nextAnimation"></div>
        <div class="coin coin3" :class="animationStatus === 3? 'coin3-animation':''" @animationend="nextAnimation"></div>
        <p class="copyright-font">©️ Quanta Center 2019</p>
    </div>
</template>

<script>
    import LoadingCom from "../components/LoadingCom";
    export default {
        name: "login-page",
        components:{
            LoadingCom: LoadingCom
        },
        data: function () {
            return {
                usernameStatus: 1,//检测状态，1：白， 0：异常，黄
                usernameTip:'账号',
                passwordStatus: 1,//检测状态，1：白， 0：异常，黄
                passwordTip:'密码',
                inputUsername: '',
                inputPassword: '',
                animationStatus: 1,//coin动画记录，1表示第一个，以此类推
                isLoading: false
            }
        },
        methods: {
            loginFunction: function () {
                let reg = /^\w{6,15}$/;
                if(!this.isLoading && reg.test(this.inputUsername)){
                    if(reg.test(this.inputPassword)){
                        this.isLoading = true; //登陆中
                        this.$axios.post('/login_view/',{
                            username: this.inputUsername,
                            password: this.inputPassword
                        }).then( (response) =>{
                            this.isLoading = false; //结束登录
                            console.log(response);
                        }).catch((error) =>{

                        })
                    }else{
                        this.passwordStatus = 0;
                        this.passwordTip = '请输入6-15位密码，匹配字母数字_'
                    }
                }else{
                    this.usernameStatus = 0;
                    this.usernameTip = '请输入6-15位账号，匹配字母数字_'
                }

            },
            nextAnimation:function () {
                this.animationStatus = (this.animationStatus % 3) + 1;
            }
        }

    }
</script>

<style scoped>
    @import "../assets/global.css";

    .container {
        width: 100%;
        height: 100%;
        position: fixed;
        background-image: url("../assets/pages/LoginPage/login-background.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }

    .login-form {
        width: 300px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -68%);
    }

    .login-font {
        font-size: 15px;
        color: #fbfbf8;
        margin: 50px 0 8px 0;
    }

    .login-font-ask {
        color: #959595;
        text-align: center;
        margin-top: 15px;
    }

    .forget-password {
        margin: 15px 0 0 0;
        text-align: right;
    }

    .login-btn {
        background-color: #f6b73f;
        color: #fbfbf8;
    }

    .wrong-color {
        color: #f6b73f;
    }

    .copyright-font {
        color: #959595;
        font-size: 13px;
        position: absolute;
        bottom: 30px;
        left: 50%;
        transform: translate(-50%, 0);
    }

    .coin {
        width: 36px;
        height: 35px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        position: absolute;
        animation-duration: 1000ms;
        animation-timing-function: ease-in-out;
        animation-delay: 2s;
        /*animation-direction: alternate;*/
        animation-fill-mode: forwards;
    }

    .coin1 {
        background-image: url("../assets/pages/LoginPage/coin1.png");
        top: 62.5%;
        left: 6.5%;
    }

    .coin1-animation {
        animation-name: coin1-keyframes;
    }

    .coin2 {
        background-image: url("../assets/pages/LoginPage/coin2.png");
        top: 47.5%;
        left: 76%;
    }

    .coin2-animation {
        animation-name: coin2-keyframes;
    }

    .coin3 {
        background-image: url("../assets/pages/LoginPage/coin3.png");
        top: 72.5%;
        left: 23%;
    }

    .coin3-animation {
        animation-name: coin3-keyframes;
    }

    @keyframes coin1-keyframes {
        0% {
            top: 62.5%;
        }
        50% {
            top: 50%;
        }
        100% {
            top: 62.5%;
        }
    }

    @keyframes coin2-keyframes {
        0% {
            top: 47.5%;
        }
        50% {
            top: 35%;
        }
        100% {
            top: 47.5%;
        }
    }

    @keyframes coin3-keyframes {
        0% {
            top: 72.5%;
        }
        50% {
            top: 60%;
        }
        100% {
            top: 72.5%;
        }
    }
</style>