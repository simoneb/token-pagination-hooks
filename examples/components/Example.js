const choices = [SimpleDeclarative, SimpleImperative, InternalState].reduce(
  (acc, c) => ({ ...acc, [c.name]: c }),
  {}
)

function Example() {
  const [choice, setChoice] = React.useState(SimpleDeclarative.name)

  const Component = choices[choice]

  return (
    <div>
      <select value={choice} onChange={e => setChoice(e.target.value)}>
        {Object.keys(choices).map(c => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <div style={{ display: 'flex' }}>
        <div>
          <Component />
        </div>
        <div style={{ marginLeft: '3rem' }}>
          <Source fileName={choice} />
        </div>
      </div>
    </div>
  )
}

Example.propTypes = {}
