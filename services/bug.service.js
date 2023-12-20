import fs from 'fs'
import { utilService } from './utils.service.js'

const PAGE_SIZE = 3
export const bugService = {
    query,
    getById,
    save,
    remove,
}

const bugs = utilService.readJsonFile('data/bug.json')

function query(filterBy = {}, sortBy, sortDir) {
    let bugsToReturn = bugs
    if (filterBy.title) {
        const regExp = new RegExp(filterBy.title, 'i')
        bugsToReturn = bugsToReturn.filter((bug) => regExp.test(bug.title))
    }
    if (filterBy.description) {
        const regExp = new RegExp(filterBy.description, 'i')
        bugsToReturn = bugsToReturn.filter((bug) =>
            regExp.test(bug.description)
        )
    }
    if (filterBy.label) {
        const regExp = new RegExp(filterBy.label, 'i')
        bugsToReturn = bugsToReturn.filter((bug) => regExp.test(bug.labels))
    }

    if (filterBy.severity) {
        bugsToReturn = bugsToReturn.filter(
            (bug) => bug.severity >= filterBy.severity
        )
    }

    if (filterBy.pageIdx !== undefined) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE
        bugsToReturn = bugsToReturn.slice(startIdx, startIdx + PAGE_SIZE)
    }

    if (sortBy === 'severity') {
        bugsToReturn.sort((b1, b2) => (b1.severity - b2.severity) * sortDir)
    } else if (sortBy === 'createdAt') {
        bugsToReturn.sort((b1, b2) => (b1.createdAt - b2.createdAt) * sortDir)
    } else if (sortBy === 'title') {
        bugsToReturn.sort(
            (b1, b2) => b1.title.localeCompare(b2.title) * sortDir
        )
    }
    const maxPage = Math.ceil(bugsToReturn.length / PAGE_SIZE)
    console.log("🚀  maxPage:", maxPage)
    return Promise.resolve({ bugs: bugsToReturn, maxPage })
}

function getById(bugId) {
    const bug = bugs.find((bug) => bug._id === bugId)
    if (!bug) return Promise.reject('Bug dosent exist!')

    return Promise.resolve(bug)
}

function remove(bugId) {
    const bugIdx = bugs.findIndex((bug) => bug._id === bugId)
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}

function save(bug) {
    if (bug._id) {
        const bugIdx = bugs.findIndex((currBug) => currBug._id === bug._id)
        bugs[bugIdx] = bug
    } else {
        bug._id = utilService.makeId()
        bugs.unshift(bug)
    }

    return _saveBugsToFile().then(() => bug)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                console.log(err)
                return reject(err)
            }
            resolve()
        })
    })
}
