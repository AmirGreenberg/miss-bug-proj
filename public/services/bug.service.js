import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const BUG_KEY = 'bugDB'
const BASE_URL = '/api/bug/'
_createBugs()

export const bugService = {
    query,
    get,
    remove,
    save,
    getEmptyBug,
    getDefaultFilter,
}

function query(filterBy) {
    return axios.get(BASE_URL).then(res => res.data)
        .then(bugs => {
            if (filterBy.title) {
                const regExp = new RegExp(filterBy.title, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title))
            }
            if (filterBy.description) {
                const regExp = new RegExp(filterBy.description, 'i')
                bugs = bugs.filter((bug) => regExp.test(bug.description))
            }
            if (filterBy.severity) {
                bugs = bugs.filter((bug) => bug.severity >= filterBy.severity)
            }
            return bugs
        })
}

function get(bugId) {
    return axios.get(BASE_URL + bugId).then(res => res.data)
    return storageService.get(BUG_KEY, bugId)
}

function remove(bugId) {
    return axios.get(BASE_URL + bugId + '/remove')
    return storageService.remove(BUG_KEY, bugId)
}

function save(bug) {
    const url = BASE_URL + 'save'
    let queryParams = `?title=${bug.title}&severity=${bug.severity}&description=${bug.description}`
    if (bug._id) queryParams += `&_id=${bug._id}`
    return axios.get(url + queryParams)
    // if (bug._id) {
    //     return storageService.put(BUG_KEY, bug)
    // } else {
    //     return storageService.post(BUG_KEY, bug)
    // }
}

function getEmptyBug(title = '', severity = '', description = '') {
    return { title, severity, description }
}

function getDefaultFilter() {
    return { txt: '', title: '', severity: '', description:'' }
}


function _createBugs() {
    let bugs = utilService.loadFromStorage(BUG_KEY)
    if (!bugs || !bugs.length) {
        bugs = [
            {
                title: 'Infinite Loop Detected',
                severity: 4,
                _id: '1NF1N1T3',
            },
            {
                title: 'Keyboard Not Found',
                severity: 3,
                _id: 'K3YB0RD',
            },
            {
                title: '404 Coffee Not Found',
                severity: 2,
                _id: 'C0FF33',
            },
            {
                title: 'Unexpected Response',
                severity: 1,
                _id: 'G0053',
            },
        ]
        utilService.saveToStorage(BUG_KEY, bugs)
    }
}


// function _createBug(title, severity = 250, description) {
//     const bug = getEmptyBug(title, severity, description)
//     bug._id = utilService.makeId()
//     return bug
// }