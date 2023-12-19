const { useState, useEffect } = React
const { useParams, useNavigate, Link } = ReactRouterDOM

import { bugService } from '../services/bug.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'

export function BugDetails() {
    const [bug, setBug] = useState(null)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadBug()
    }, [params.bugId])

    function loadBug() {
        bugService
            .get(params.bugId)
            .then((bug) => setBug(bug))
            .catch((err) => {
                showErrorMsg('Cannot load bug')
                // navigate('/')
            })
    }

    if (!bug) return <h1>Loading....</h1>
    console.log('🚀  bug:', bug)
    return (
        bug && (
            <div>
                <h3>Bug Details 🐛</h3>
                <h4>{bug.title}</h4>
                <p>
                    Severity: <span>{bug.severity}</span>
                </p>
                <p>
                    Description: <span>{bug.description}</span>
                </p>
                <Link to="/bug">Back to List</Link>
            </div>
        )
    )
}
