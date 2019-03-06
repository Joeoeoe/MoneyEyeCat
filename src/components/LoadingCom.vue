<template>
    <div class="loading-com">
        <div class="circle circle1" :style="{backgroundColor:background}"></div>
        <div class="circle circle2" :style="{backgroundColor:background}"></div>
        <div class="circle circle3" :style="{backgroundColor:background}"></div>
    </div>
</template>

<script>
    /**
     * 使用说明：
     * 1.可设背景色
     * 2.父级元素position应设置为relative
    **/
    export default {
        name: "loading-com",
        props:{
            background:String,
        }
    }
</script>

<style scoped>
    .loading-com{
        width: inherit;
        height: inherit;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 999;
    }
    .circle{
        animation-name: circle1-keyframes;
        background-color: #f6b73f;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        animation-duration: 1500ms;
        animation-timing-function: ease-in-out;
        animation-fill-mode: forwards;
        animation-iteration-count: infinite;
    }
    .circle1{
        width: 12px;
        height: 13px;
        animation-delay: 1ms;
    }
    .circle2{
        width: 10px;
        height: 10px;
        animation-delay: 25ms;
    }
    .circle3{
        width: 8px;
        height: 8px;
        animation-delay: 50ms;
    }
    @keyframes circle1-keyframes {
        0%{
            left: 5%;
        }
        50%{
            left: 90%;
        }
        100%{
            left: 5%;
        }
    }
</style>