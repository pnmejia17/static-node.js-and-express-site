// dependencies

const express = require('express')
const app = express()
const path = require('path')
const data = require('./data.json')


// middleware
app.set('view engine', 'pug')

//static files in public folder
app.use('/static', express.static(path.join(__dirname, 'public')))

//set routes

app.get('/', (req, res) => {
    res.locals.projects = data.projects
    res.render('index')
})

app.get('/about', (req, res) => {
    res.render('about')
})

app.get('/project/:id', (req, res, next) => {
    const projID = req.params.id
    const projects = data.projects
    
    const project = projects.find(({id}) => id === +projID)

    if (project) {
        return res.render('project', {project})
    } else {
        const error = new Error('404 Error')
        error.message = 'The page you are looking does not exist. Sorry!'
        error.status = 404
        next(error)
    }
})

//server listening

app.listen(3000, () => {
    console.log("Application running on localhost:3000")
})

//error handling

// 404 error handler

app.use((req, res, next) => {
    const error = new Error('404 Error')
    error.message = 'The page you are looking does not exist. Sorry!'
    error.status = 404
    next(error)
})

// global error handler
app.use((err, req, res, next) => {
    err.status = err.status || 500
    err.message = err.message || 'Server Error'
    console.error(`Error: ${err.message}, Status: ${err.status}`)
    res.status(err.status).json({ error: err.message })
    })
        