module.exports={
    // devServer:{
    //     "proxy":"http://127.0.0.1:8000"
    // }
    pages:{
        LoginPage:{
            entry:'src/modules/LPMain.js',
            template:'public/LoginPage.html',
            filename:'LoginPage.html',
            title:'登录',
            chunks:['LoginPage']
        },
        App:{
            entry:'src/'
        }
    }
};
