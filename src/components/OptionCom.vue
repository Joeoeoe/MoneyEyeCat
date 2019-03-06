<template>
    <div class="option-com" @click="getChoices">
        <button v-for="(item, index) in chartOptionArray"
              :class="selectedIndex === index? 'selected-option':'unselected-option'"
              :data-index="index"
                class="option-btn"
        >{{item}}</button>
    </div>
</template>

<script>
    export default {
        name: "option-com",
        props: {
            paramOptionArray: Array
        },
        data: function () {
            return {
                chartOptionArray: this.paramOptionArray,
                selectedIndex: 0  //被选中下标
            }
        },
        methods: {
            getChoices: function (e) {
                let target = e.target;
                if(target.getAttribute('data-index') !== null){
                    let index = ~~target.getAttribute('data-index');
                    if(index === this.selectedIndex){
                        this.selectedIndex = -1;
                        this.$emit('get-chart-option', null)
                    }else{
                        this.selectedIndex = index;
                        let option = target.innerText;
                        this.$emit('get-chart-option', option)
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .unselected-option {
        display: inline-block;
        font-size: 16px;
        color: #b5b5b5;
        background-color: #f8f9ff;
        padding: 6px 7px 6px 7px;
        border-radius: 8px;
        margin: 0 10px 10px 0;
        border: solid 1px #b5b5b5;
    }

    .selected-option {
        display: inline-block;
        font-size: 16px;
        color: #fafaf8;
        background-color: #f6b73f;
        padding: 6px 7px 6px 7px;
        border-radius: 8px;
        margin: 0 10px 10px 0;
    }
    .option-btn{
        width: 40px;
        height: 25px;
        font-size: 10px;
    }
</style>