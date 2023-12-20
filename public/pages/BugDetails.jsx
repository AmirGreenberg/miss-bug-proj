import { bugService } from '../services/bug.service.local.js'
import { showErrorMsg } from '../services/event-bus.service.js'

const { useState, useEffect } = React
const { useParams, useNavigate, Link } = ReactRouterDOM

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
                navigate('/bug')
            })
    }

    function onBack() {
        navigate('/bug')
    }

    if (!bug) return <h1>Loading....</h1>
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
                <p>
                    Labels: <span>{bug.labels.join(', ')}</span>
                </p>
                <p>
                    Created at:{' '}
                    <span>
                        {new Date(bug.createdAt).toString().substring(0, 25)}
                    </span>
                </p>
                <button onClick={onBack}>Back</button>
            </div>
        )
    )
}
