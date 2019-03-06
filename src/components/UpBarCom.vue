<template>
    <div class="up-bar-com">

        <div class="head-container">
            <div class="information-container">
                <img  class="head-img" src="../assets/components/UpBarCom/head.jpg"/>
                <span class="user-name">{{username}}</span>
                <span class="down-triangle"></span>
            </div>
            <!--<div class="menu-container">-->
                <!--<div class="register">-->
                    <!--注销-->
                <!--</div>-->
            <!--</div>-->
        </div>
    </div>
</template>

<script>
    export default {
        name: "up-bar-com",
        data:function () {
            return{
                username:'用户名'
            }
        }
    }
</script>

<style scoped>
    .up-bar-com{
        width: 100%;
        height: 55px;
        background-color: #fafafa;
        position: relative;
        border-bottom: 1px solid #e9e6ed;
    }
    .head-container{
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);

    }
    .information-container{
        display: flex;
        align-items: center;
        cursor: pointer;
    }
    .head-img{
        width: 36px;
        height: 36px;
        border-radius: 50%;
    }
    .user-name{
        font-size: 15px;
        color: #2d2d2d;
        margin: 0 11px 0 11px;
    }
    .down-triangle{
        display: inline-block;
        width: 0;
        height: 0;
        margin: 5px 10px 0 0;
        border-top: 6px;
        border-left: 4px;
        border-right: 4px;
        border-style: solid;
        border-color: #424242 transparent transparent transparent;
    }
</style>