const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilter }) {
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

    const { title, severity, description } = filterByToEdit
    console.log('🚀  filterByToEdit:', filterByToEdit)
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
                <button>Submit</button>
            </form>
        </section>
    )
}
