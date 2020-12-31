import { localPersister, sessionPersister } from './persisters'

describe('persisters', () => {
  describe('local', persisterTests(localPersister, 'localStorage'))

  describe('session', persisterTests(sessionPersister, 'sessionStorage'))
})

function persisterTests(persisterFactory, storageName) {
  return function () {
    let persister, storage

    beforeEach(() => {
      Object.defineProperty(window, storageName, {
        value: { setItem: jest.fn(), getItem: jest.fn() },
      })
      storage = window[storageName]
      persister = persisterFactory('key')
    })

    it('persists', () => {
      persister.persist({ some: 'value' })

      expect(storage.setItem).toHaveBeenCalledWith(
        'key',
        JSON.stringify({ some: 'value' })
      )
    })

    it('hydrates', () => {
      const stored = { some: 'value' }
      storage.getItem.mockReturnValue(JSON.stringify(stored))

      expect(persister.hydrate()).toEqual(stored)
    })

    it('merges with existing value when persisting', () => {
      const stored = { some: 'value' }
      storage.getItem.mockReturnValue(JSON.stringify(stored))

      persister.persist({ another: 'value' })

      expect(storage.setItem).toHaveBeenCalledWith(
        'key',
        JSON.stringify({ some: 'value', another: 'value' })
      )
    })

    it('handles errors', () => {
      storage.getItem.mockReturnValue('invalid json')
      expect(persister.hydrate()).toEqual({})
    })
  }
}
