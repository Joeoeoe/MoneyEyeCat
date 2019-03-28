<template>
    <div class="menu-com">
        <!--导航-->
        <button class="menu-btn" :class="menuBtnToggle===true? 'menu-btn-on':'' " @click="controlMenu">
            <span>{{title}}</span>
            <span :class="menuBtnToggle===true? 'triangle-down':'triangle-right'"></span>
        </button>

        <!--放置科目-->
        <div class="subjects-container" v-show="menuBtnToggle" @click="getChoices">
            <button v-for="(choice, index) in choicesArray"
                    :class="choice.selected === true? 'selected-btn':'unselected-btn'"
                    :data-index="index">
                {{choice.name}}
            </button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "menu-com",
        props: {
            paramChoicesArray: Array,
            title:String
        },
        data: function () {
            return {
                menuBtnToggle: false,
                choicesArray: this.paramChoicesArray,
                selectedMap:new Map()

                // choicesArray: [
                //     {
                //         name:'货币资金',
                //         selected:false
                //     },
                //     {
                //         name:'货币资金',
                //         selected:false
                //     },
                //     {
                //         name:'货币资金',
                //         selected:false
                //     }
                // ]
            }
        },
        watch:{
            paramChoicesArray:function(newVal, oldVal){
                this.choicesArray = newVal;
            }
        },
        methods: {
            controlMenu: function () {
                this.menuBtnToggle = !this.menuBtnToggle;
            },
            getChoices: function (e) {
                let target = e.target;
                if (target.getAttribute('data-index') !== null) {
                    let index = ~~target.getAttribute('data-index');
                    this.choicesArray[index].selected = !this.choicesArray[index].selected;
                    let subject = target.innerText;
                    this.$emit('get-subject',subject);
                }
            }
        },
        mounted:function(){
            console.log(111);
            console.log(this.paramChoicesArray);
        }
    }
</script>

<style scoped>
    .menu-btn {
        width: 100px;
        height: 35px;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        background-color: #f1f2fa;
        border: solid 1px #e9e6ed;
        position: relative;
        z-index: 10;
    }

    .menu-btn-on {
        border-bottom: 0;
    }

    .menu-btn span {
        vertical-align: middle;
    }

    .subjects-container {
        width: 400px;
        padding: 28px 7px 25px 10px;
        background-color: #f1f2fa;
        border-top-right-radius: 6px;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
        border: solid 1px #e9e6ed;
        position: relative;
        top: -1px;
        z-index: 1;
    }

    .unselected-btn {
        display: inline-block;
        font-size: 16px;
        color: #b5b5b5;
        background-color: #f8f9ff;
        padding: 6px 7px 6px 7px;
        border-radius: 8px;
        margin: 0 10px 10px 0;
    }

    .selected-btn {
        display: inline-block;
        font-size: 16px;
        color: #fafaf8;
        background-color: #f6b73f;
        padding: 6px 7px 6px 7px;
        border-radius: 8px;
        margin: 0 10px 10px 0;
    }

    .triangle-down {
        display: inline-block;
        width: 0;
        height: 0;
        border-top: 6px;
        border-left: 4px;
        border-right: 4px;
        border-bottom: 0;
        border-color: #000000 transparent transparent transparent;
        border-style: solid;
        margin-left: 10px;
    }

    .triangle-right {
        display: inline-block;
        width: 0;
        height: 0;
        border-top: 4px;
        border-left: 6px;
        border-right: 0;
        border-bottom: 4px;
        border-color: transparent transparent transparent #000000;
        border-style: solid;
        margin-left: 10px;
    }
</style>