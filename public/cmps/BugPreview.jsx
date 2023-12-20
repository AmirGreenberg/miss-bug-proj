export function BugPreview({ bug }) {
    return (
        <article>
            <h4>{bug.title}</h4>
            {bug.owner && <h4>Owner: {bug.owner.fullname}</h4>}

            <h1>🐛</h1>
            <p>
                Severity: <span>{bug.severity}</span>
            </p>
            <p>
                Description: <span>{bug.description}</span>
            </p>
            {bug.createdAt && (
                <p>
                    Created at:{' '}
                    <span>
                        {new Date(bug.createdAt).toString().substring(0, 25)}
                    </span>
                </p>
            )}
            {bug.labels && (
                <p>
                    Labels: <span>{bug.labels.join(', ')}</span>
                </p>
            )}
        </article>
    )
}
