<template>
    <div class="right-side-bar-com">
        <button class="top-button"></button>
        <button class="choice-btn chart-unselected-icon"></button>
        <button class="choice-btn trash-unselected-icon"></button>
        <button class="choice-btn help-unselected-icon"></button>
    </div>
</template>

<script>
    export default {
        name: "right-side-bar-com"
    }
</script>

<style scoped>
    .right-side-bar-com{
        width: 100%;
        height: 100%;
        background-color: #fafafa;
        border-left: 1px solid #e9e6ed;
    }
    .top-button{
        width: 100%;
        height: 56px;
        background-color: #fafafa;
        border-bottom: 1px solid #e9e6ed;
        background-image: url("../assets/components/RightSideBarCom/menu.png");
        background-size: 40% 27%;
        background-repeat: no-repeat;
        background-position: center center;
    }
    .choice-btn{
        width: 100%;
        height: 40px;
        margin-top: 50px;
        background-color: #fafafa;
        background-repeat: no-repeat;
        background-position: center center;
    }
    .choice-btn:hover{
        border-left: 4px solid #f6b73f;
    }
    .chosen-btn{
        border-left: 4px solid #f6b73f;
    }
    .chart-unselected-icon{
        background-image: url("../assets/components/RightSideBarCom/chart-unselected.png");
    }
    .chart-unselected-icon:hover{
        background-image: url("../assets/components/RightSideBarCom/chart-selected.png");
    }
    .chart-selected-icon{
        background-image: url("../assets/components/RightSideBarCom/chart-selected.png");
    }

    .trash-unselected-icon{
        background-image: url("../assets/components/RightSideBarCom/trash-unselected.png");
    }
    .trash-unselected-icon:hover{
        background-image: url("../assets/components/RightSideBarCom/trash-selected.png");
    }
    .chart-selected-icon{
        background-image: url("../assets/components/RightSideBarCom/trash-selected.png");
    }

    .help-unselected-icon{
        background-image: url("../assets/components/RightSideBarCom/help-unselected.png");
    }
    .help-unselected-icon:hover{
        background-image: url("../assets/components/RightSideBarCom/help-selected.png");
    }
    .help-selected-icon{
        background-image: url("../assets/components/RightSideBarCom/help-selected.png");
    }


</style>