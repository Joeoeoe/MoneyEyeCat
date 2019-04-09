<template>
    <div class="side-bar-com">
            <div class="side-bar" >
                <button :style="{opacity: sideBarOpacity? 1:0}" @click="showUpLoad" class="upload-btn">
                    <span class="upload-icon"></span><span>上传表格</span>
                </button>

                <GeminiScrollbar :style="{opacity: sideBarOpacity? 1:0}" class="scroll">


                    <!--资产负债表-->
                    <div class="table-list-container">
                        <p class="table-list-title" >
                            <span @click="ALHandle" :class="ALToggle? 'down-triangle':'right-triangle'"></span>
                            <span :class="[lastGroup === 'ALGroup'? 'selected-color':'']"
                                  data-group="ALGroup"
                                  data-index="-1"
                                  data-title="资产负债表汇总"
                                  @click="changeTable"
                            >资产负债表</span>
                        </p>
                        <div v-show="ALToggle" class="table-list">
                            <p v-for="(item, index) in ALArray"
                               @click="changeTable($event)"
                               :data-title="item.title"
                               :data-index="index"
                               :data-group="item.group"
                               :class="[item.selected? 'selected-color':'']">
                                {{item.title}}
                            </p>
                        </div>
                    </div>


                    <!--利润表-->
                    <div class="table-list-container">
                        <p class="table-list-title" >
                            <span @click="PFHandle" :class="PFToggle? 'down-triangle':'right-triangle'"></span>
                            <span :class="[lastGroup === 'PFGroup'? 'selected-color':'']"
                                  data-group="PFGroup"
                                  data-index="-1"
                                  data-title="利润表（损益表）汇总"
                                  @click="changeTable"
                            >利润表（损益表）</span>
                        </p>
                        <div v-show="PFToggle" class="table-list">
                            <p v-for="(item, index) in PFArray"
                               @click="changeTable($event)"
                               :data-title="item.title"
                               :data-index="index"
                               :data-group="item.group"
                               :class="[item.selected? 'selected-color':'']">
                                {{item.title}}
                            </p>
                        </div>
                    </div>


                    <!--现金流量表-->
                    <div class="table-list-container">
                        <p class="table-list-title" >
                            <span @click="CFHandle" :class="CFToggle? 'down-triangle':'right-triangle'"></span>
                            <span :class="[lastGroup === 'CFGroup'? 'selected-color':'']"
                                  data-group="CFGroup"
                                  data-index="-1"
                                  data-title="现金流量表汇总"
                                  @click="changeTable"
                            >现金流量表</span>
                        </p>
                        <div v-show="CFToggle" class="table-list">
                            <p v-for="(item, index) in CFArray"
                               @click="changeTable($event)"
                               :data-title="item.title"
                               :data-index="index"
                               :data-group="item.group"
                               :class="[item.selected? 'selected-color':'']">
                                {{item.title}}
                            </p>
                        </div>
                    </div>



                </GeminiScrollbar>
            </div>

        <!--收缩按钮-->
        <div class="toggle-container" @click="slide" :style="{transform: 'translate('+ toggleObj.translateX + '%, -50%)'}" >
            <div class="toggle-btn" :class="[toggleObj.isPush? 'toggle-push-btn':'toggle-pull-btn']"></div>
        </div>
        <!--补充上方小方格-->
        <div class="fill"></div>
    </div>

</template>

<script>
    /**
     * AL：AssetsLiabilities资产负债
     * PF：profit，利润
     * CF:cash flow 现金流量
     **/
    import TWEEN from '@tweenjs/tween.js';
    import Vue from 'vue';
    export default {
        name: "side-bar-com",
        // components:{
        //     GeminiScrollbar:''
        // },
        props:{
            paramALArray:Array,
            paramPFArray:Array,
            paramCFArray:Array
        },
        data: function () {
            return {
                test:this.props,
                //数据
                // ALArray:[
                //     {
                //         'title':'2002年资产负债表',
                //         'selected':false,
                //         'group':'ALArray'
                //     },
                //     {
                //         'title':'2003年资产负债表',
                //         'selected':false,
                //         'group':'ALArray'
                //     },
                //     {
                //         'title':'2004年资产负债表',
                //         'selected':false,
                //         'group':'ALArray'
                //     }
                //     ],
                ALArray:this.paramALArray,
                ALToggle: true,//选项卡开关

                // PFArray: [
                //     {
                //         'title':'2002年利润表',
                //         'selected':false,
                //         'group':'PFArray'
                //     },
                //     {
                //         'title':'2003年利润表',
                //         'selected':false,
                //         'group':'PFArray'
                //     },
                //     {
                //         'title':'2004年利润表',
                //         'selected':false,
                //         'group':'PFArray'
                //     }
                // ],
                PFArray:this.paramPFArray,
                PFToggle: true,

                // CFArray: [
                //     {
                //         'title':'2002年现金流量表',
                //         'selected':false,
                //         'group':'CFArray'
                //     },
                //     {
                //         'title':'2003年现金流量表',
                //         'selected':false,
                //         'group':'CFArray'
                //     },
                //     {
                //         'title':'2004年现金流量表',
                //         'selected':false,
                //         'group':'CFArray'
                //     }
                // ],
                CFArray:this.paramCFArray,
                CFToggle: true,

                //ui控制
                lastGroup:"ALGroup", //ALGroup,ALArray,PFGroup,PFArray,CFGroup,CFArray
                lastIndex:null, //-1表示Group，0，1，2...则表示下标
                sideBarOpacity: true,//true表示不透明
                toggleObj: {
                    translateX:0,
                    isPush:true //true：箭头向左
                }

            }
        },
        methods: {
            //数据
            changeTable:function (e) {
                let title = e.target.getAttribute('data-title'),
                    group = e.target.getAttribute('data-group'),
                    index = parseInt(e.target.getAttribute('data-index')),
                    lastGroup = this.lastGroup,
                    lastIndex = this.lastIndex;
                if(lastIndex!==null && lastIndex !== -1 ){//-1表示上一个选中的是group，另外，group的样式是通过字符串控制的
                    //还原样式
                    let obj = this[lastGroup][lastIndex];
                    obj.selected = false;
                    Vue.set(this[lastGroup], lastIndex, obj);
                }
                if(index !== -1){
                    //新设样式
                    let newObj = this[group][index];
                    newObj.selected = true;
                    Vue.set(this[group], index, newObj);
                }

                this.lastIndex = index;
                this.lastGroup = group;

                this.$emit('change-table',title, group);
                this.$emit('judge-tables-group', index);
            },

            //ui控制
            ALHandle: function () {
                this.ALToggle = !this.ALToggle;
            },
            PFHandle: function () {
                this.PFToggle = !this.PFToggle;
            },
            CFHandle: function () {
                this.CFToggle = !this.CFToggle;
            },
            slide:function () {
                //将内容透明
                this.sideBarOpacity = !this.sideBarOpacity;
                //HomPage改变左侧栏动画
                this.$emit('left-slide');

                //toggleBtn位置变化
                function animate() {
                    if(TWEEN.update()){
                        requestAnimationFrame(animate)
                    }
                }
                let tween = new TWEEN.Tween(this.toggleObj);
                if(this.sideBarOpacity === false){//内容隐藏
                    tween.to({translateX: 30}, 100);
                }else {
                    tween.to({translateX: 0}, 100);
                }
                tween.start();
                animate();




                //toggleBtn箭头向左向右变化
                this.toggleObj.isPush = !this.toggleObj.isPush;
            },
            showUpLoad:function () {
                this.$emit('show-up-load');

            }
        }
    }
</script>

<style scoped>

    /*bar*/
    .side-bar-com {
        position: relative;
        /*百分比布局*/
        width: 100%;
        /*min-width: 225px;*/
        height: 100%;
    }
    .side-bar {
        width: 87%;
        height: 100%;
        background-color: #222945;
        position: relative;
        padding-top: 1px;
        padding-right: 8%;
        /*overflow: auto;*/
        /*display: flex;*/
        /*flex-wrap: wrap;*/
        /*justify-content: center;*/
    }

    /*上传表格按钮*/
    .upload-btn {
        width: 70%;
        height: 36px;
        background-color: #f6b73f;
        border-radius: 10px;
        margin: 75px auto 28px auto;
        color: #fafaf8;
    }

    .upload-icon {
        width: 18px;
        height: 17px;
        margin-right: 8px;
        display: inline-block;
        background-image: url("../assets/components/SideBarCom/upload.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        vertical-align: bottom;
    }

    /*列表*/
    .table-list-container {
        color: #b3b3b3;
        margin-bottom: 30px;
        cursor: pointer;
    }

    .table-list-container p:hover {
        color: #f6b73f;
    }
    .selected-color{
        color: #f6b73f;
    }


    .table-list-container p:hover .down-triangle {
        border-color: #f6b73f transparent transparent transparent;
    }

    .table-list-container p:hover .right-triangle {
        border-color: transparent transparent transparent #f6b73f;
    }

    .table-list-title {
        font-size: 16px;
        padding-left: 18%;
    }

    .table-list {
        font-size: 13px;
    }

    .table-list p {
        margin-top: 23px;
        padding-left: 32%;
    }

    .toggle-container {
        width: 53px;
        height: 89px;
        position: absolute;
        top: 50%;
        right: -3%;
        background-image: url("../assets/components/SideBarCom/btn_bg.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        transform: translate(0%, -50%);
        cursor: pointer;

    }
    .toggle-btn {
        width: 24px;
        height: 24px;
        position: absolute;
        top: 50%;
        right: -3px;
        transform: translate(-50%, -50%);
        cursor: pointer;
    }
    .toggle-push-btn{
        background-image: url("../assets/components/SideBarCom/push.png");
    }
    .toggle-pull-btn{
        background-image: url("../assets/components/SideBarCom/pull.png");
    }


    .down-triangle {
        display: inline-block;
        width: 0;
        height: 0;
        margin-right: 10px;
        border-top: 10px;
        border-left: 6px;
        border-right: 6px;
        border-style: solid;
        border-color: #b3b3b3 transparent transparent transparent;
    }

    .right-triangle {
        display: inline-block;
        width: 0;
        height: 0;
        margin-right: 10px;
        border-top: 6px;
        border-bottom: 6px;
        border-left: 10px;
        border-style: solid;
        border-color: transparent transparent transparent #b3b3b3;
    }

    .fill {
        width: 14.5%;
        height: 55px;
        background-color: #fafafa;
        position: absolute;
        right: -10%;
        top: 0;
    }

    .scroll{
        height: 80%;
    }



</style>