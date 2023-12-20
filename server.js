import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { userService } from './services/user.service.js'

import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// Get Bugs (READ)
app.get('/api/bug', (req, res) => {
    const {
        title = '',
        severity = 0,
        label = '',
        pageIdx,
        sortBy = '',
        sortDir = 1,
        description = '',
    } = req.query
    const filterBy = {
        title,
        severity,
        label,
        pageIdx,
        description,
    }

    bugService
        .query(filterBy, sortBy, sortDir)
        .then(({ bugs, maxPage }) => {
            res.send({ bugs, maxPage })
        })
        .catch((err) => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

// Get Bug (READ)
app.get('/api/bug/:id', (req, res) => {
    const bugId = req.params.id

    ////Limit user to 3 bugs views in, restart every 7 seconds //////
    let visitedCount = req.cookies.visitedCount || '[]'
    console.log('🚀  visitedCount before push:', visitedCount)

    const valParse = JSON.parse(visitedCount)
    console.log('🚀  visitedCount before push after parse:', valParse)

    let countLength = valParse.length

    if (countLength >= 3) {
        loggerService.error('Wait for a bit')
        return res.status(401).send('Wait for a bit')
    }

    let isExist = valParse.some((id) => id === bugId)

    if (!isExist) valParse.push(bugId)
    console.log('🚀  visitedCount after parse after push:', valParse)

    const valStr = JSON.stringify(valParse)
    console.log('🚀  visitedCount after stringify:', valStr)

    res.cookie('visitedCount', valStr, {
        maxAge: 1000 * 7,
        /////////End of limitation test and continue get bug///////
    })
    bugService
        .getById(bugId)
        .then((bug) => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})

// Add Bug (READ)
app.post('/api/bug/', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')

    const bugToSave = {
        title: req.body.title,
        severity: req.body.severity,
        description: req.body.description,
        labels: req.body.labels || [],
    }

    bugService
        .save(bugToSave, loggedinUser)
        .then((bug) => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot add bug', err)
            res.status(400).send('Cannot add bug')
        })
})

// Edit Bug (READ)
app.put('/api/bug/:id', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update bug')

    const bugToSave = {
        title: req.body.title,
        severity: req.body.severity,
        description: req.body.description,
        labels: req.body.labels || [],
        _id: req.body._id,
    }

    bugService
        .save(bugToSave, loggedinUser)
        .then((bug) => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

// Remove Bug (DELETE)
app.delete('/api/bug/:id/', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot remove bug')

    const bugId = req.params.id
    bugService
        .remove(bugId, loggedinUser)
        .then(() => {
            loggerService.info(`Bug ${bugId} removed`)

            res.send('Removed!')
        })
        .catch((err) => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })
})

app.get('/api/user', (req, res) => {
    userService
        .query()
        .then((users) => {
            res.send(users)
        })
        .catch((err) => {
            console.log('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials).then((user) => {
        if (user) {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        } else {
            res.status(401).send('Invalid Credentials')
        }
    })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials).then((user) => {
        if (user) {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        } else {
            res.status(400).send('Cannot signup')
        }
    })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const port = 3031
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)
