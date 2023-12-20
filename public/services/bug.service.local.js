import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'
import { userService } from './user.service.js'

const BUG_KEY = 'bugDB'
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
    return storageService.query(BUG_KEY).then((bugs) => {
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
            bugsToReturn.sort(
                (b1, b2) => (b1.createdAt - b2.createdAt) * sortDir
            )
        } else if (sortBy === 'title') {
            bugsToReturn.sort(
                (b1, b2) => b1.title.localeCompare(b2.title) * sortDir
            )
        }
        const maxPage = Math.ceil(bugsToReturn.length / PAGE_SIZE)
        console.log('🚀  maxPage:', maxPage)
        return bugsToReturn
    })
}

function get(bugId) {
    return storageService.get(BUG_KEY, bugId).then((bug) => {
        bug = _setNextPrevBugId(bug)
        return bug
    })
}

function remove(bugId) {
    return storageService.remove(BUG_KEY, bugId)
}

function save(bug) {
    if (bug._id) {
        return storageService.put(BUG_KEY, bug)
    } else {
        bug.owner = userService.getLoggedinUser()
        return storageService.post(BUG_KEY, bug)
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

function getDefaultFilter(
    filterBy = { title: '', severity: '', description: '', labels: '' }
) {
    return {
        title: filterBy.title,
        severity: filterBy.severity,
        description: filterBy.description,
        labels: filterBy.labels,
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

function _setNextPrevBugId(bug) {
    return storageService.query(BUG_KEY).then((bugs) => {
        const bugIdx = bugs.findIndex((currBug) => currBug._id === bug._id)
        const nextBug = bugs[bugIdx + 1] ? bugs[bugIdx + 1] : bugs[0]
        const prevBug = bugs[bugIdx - 1]
            ? bugs[bugIdx - 1]
            : bugs[bugs.length - 1]
        bug.nextBugId = nextBug._id
        bug.prevBugId = prevBug._id
        return bug
    })
}
