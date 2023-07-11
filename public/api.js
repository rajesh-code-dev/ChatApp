const express = require('express');
const app = express()
const path = require('path');
const cors = require('cors');


const createViewApi = app => {
    app.get('/', async (request, response) => {
     if(request.session.userId){
        return response.sendFile(path.join(__dirname, 'homeScreen.html'))
     }
     else{
        return response.sendFile(path.join(__dirname, '../loginPage.html'))
     }
    
    })

    app.get('/register', async (request, response) => {
        if(request.session.userId == null){
            return response.sendFile(path.join(__dirname, 'createUser.html'))
        }else{
           
        }
    })
}

module.exports= {
    createViewApi
}


const respone = fetch('https://g.co/kgs/yHWyww')
.then(response => {
    console.log(response.timingInfo)
})