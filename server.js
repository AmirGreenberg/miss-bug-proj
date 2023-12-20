import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// Get Bugs (READ)
app.get('/api/bug', (req, res) => {
    const filterBy = {
        title: req.query.title || '',
        severity: req.query.severity || 0,
        pageIdx: req.query.pageIdx,
        description: req.query.description || '',
        label: req.query.label || '',
    }
    bugService
        .query(filterBy)
        .then((bugs) => {
            res.send(bugs)
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
    const bugToSave = {
        title: req.body.title,
        severity: req.body.severity,
        description: req.body.description,
        createdAt: req.body.createdAt || Date.now(),
        labels: req.body.labels || [],
    }

    bugService
        .save(bugToSave)
        .then((bug) => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot add bug', err)
            res.status(400).send('Cannot add bug')
        })
})

// Edit Bug (READ)
app.put('/api/bug/', (req, res) => {
    const bugToSave = {
        title: req.body.title,
        severity: req.body.severity,
        description: req.body.description,
        createdAt: req.body.createdAt || Date.now(),
        labels: req.body.labels || [],
        _id: req.body._id,
    }

    bugService
        .save(bugToSave)
        .then((bug) => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

// Remove Bug (DELETE)
app.delete('/api/bug/:id/', (req, res) => {
    const bugId = req.params.id
    bugService
        .remove(bugId)
        .then(() => res.send(bugId))
        .catch((err) => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })
})

const port = 3031
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)
