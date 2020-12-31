const { useState, useEffect } = React
const T = PropTypes

function Source({ fileName }) {
  const [source, setSource] = useState()

  useEffect(() => {
    async function fetchSource() {
      const res = await fetch(`/components/${fileName}.js`)

      setSource(await res.text())
    }

    fetchSource()
  }, [fileName])

  return (
    <div>
      <h3>{fileName} source code</h3>
      <pre>
        <code>{source}</code>
      </pre>
    </div>
  )
}

Source.propTypes = {
  fileName: T.string.isRequired,
}
