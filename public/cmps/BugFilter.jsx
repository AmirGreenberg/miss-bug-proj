const { useState, useEffect } = React

export function BugFilter({
    filterBy,
    onSetFilter,
    onSetSortDir,
    onSetSortBy,
    sortBy,
    sortDir,
}) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    function onSetFilterBy(ev) {
        ev.preventDefault()
        onSetFilter(filterByToEdit)
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break

            case 'checkbox':
                value = target.checked
                break

            default:
                break
        }

        setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
    }

    function handleSortBy({ target }) {
        if (!sortDir) onSetSortDir(1)
        onSetSortBy(target.value)
    }

    function handleSortDir({ target }) {
        const DirVal = target.checked ? 1 : -1
        onSetSortDir(DirVal)
    }

    const { title, severity, description, label } = filterByToEdit
    return (
        <section className="bug-filter main-layout full">
            <h2>Filter Our Bugs</h2>
            <form onSubmit={onSetFilterBy}>
                <label htmlFor="title">Title: </label>
                <input
                    value={title || ''}
                    onChange={handleChange}
                    type="text"
                    id="title"
                    name="title"
                />
                <br />
                <label htmlFor="severity">Min severity: </label>
                <input
                    value={severity || ''}
                    onChange={handleChange}
                    type="number"
                    id="severity"
                    name="severity"
                />
                <br />
                <label htmlFor="description">Description: </label>
                <input
                    value={description || ''}
                    onChange={handleChange}
                    type="text"
                    id="description"
                    name="description"
                />
                <br />
                <label htmlFor="label">Label: </label>
                <input
                    value={label || ''}
                    onChange={handleChange}
                    type="text"
                    id="label"
                    name="label"
                />

                <br />
                <label htmlFor="sortBy">Sort By:</label>
                <select
                    name="sortBy"
                    id="sortBy"
                    onChange={handleSortBy}
                    defaultValue={sortBy}
                >
                    <option disabled value="">
                        Choose option
                    </option>
                    <option value="title">Title</option>
                    <option value="severity">Severity</option>
                    <option value="createdAt">Created At</option>
                </select>

                <label htmlFor="SortDir">Ascending </label>
                <input
                    disabled={!sortBy}
                    checked={sortDir === 1}
                    onChange={handleSortDir}
                    type="checkbox"
                    id="SortDir"
                    name="SortDir"
                />

                <button>Submit</button>
            </form>
        </section>
    )
}
