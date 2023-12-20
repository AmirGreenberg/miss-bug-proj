import { utilService } from './util.service.js'

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

function query(filterBy, sortBy = 'severity', sortDir = 1) {
    return axios
        .get(BASE_URL, { params: { ...filterBy, sortBy, sortDir } })
        .then((res) => {
            console.log('res.data', res.data)
            return res.data
        })
}

function get(bugId) {
    return axios.get(BASE_URL + bugId).then((res) => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId).then((res) => res.data)
}

function save(bug) {
    if (bug._id) {
        return axios.put(BASE_URL, bug).then((res) => res.data)
    } else {
        return axios.post(BASE_URL, bug).then((res) => res.data)
    }
}

function getEmptyBug(
    title = '',
    severity = '',
    description = '',
    labels = '',
    createdAt = Date.now()
) {
    return { title, severity, description, labels, createdAt }
}

function getDefaultFilter() {
    return {
        title: '',
        severity: '',
        description: '',
        label: '',
        pageIdx: 0,
    }
}

function _createBugs() {
    let bugs = utilService.loadFromStorage(BUG_KEY)
    if (!bugs || !bugs.length) {
        bugs = [
            {
                title: 'Infinite Loop Detected',
                severity: 4,
                description: 'Amazing bug',
                labels: ['handsome', 'tall'],
                _id: '1NF1N1T3',
            },
            {
                title: 'Keyboard Not Found',
                severity: 3,
                description: 'bug 2000',
                labels: ['stupid', 'poor'],
                _id: 'K3YB0RD',
            },
            {
                title: '404 Coffee Not Found',
                severity: 2,
                description: 'bug bug bigolo',
                labels: ['fat', 'poor', 'tall'],
                _id: 'C0FF33',
            },
            {
                title: 'Unexpected Response',
                description: 'boged',
                labels: ['loyal', 'handsome'],
                severity: 1,
                _id: 'G0053',
            },
        ]
        utilService.saveToStorage(BUG_KEY, bugs)
    }
}
