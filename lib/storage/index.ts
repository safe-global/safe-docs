export const LS_NAMESPACE = 'SAFE__'

type BrowserStorage = typeof localStorage | typeof sessionStorage

class Storage {
  private readonly prefix: string
  private readonly storage?: BrowserStorage

  constructor(storage?: BrowserStorage, prefix = LS_NAMESPACE) {
    this.prefix = prefix
    this.storage = storage
  }

  public getPrefixedKey = (key: string): string => {
    return `${this.prefix}${key}`
  }

  public getItem = <T>(key: string): T | null => {
    const fullKey = this.getPrefixedKey(key)
    let saved: string | null = null
    try {
      saved = this.storage?.getItem(fullKey) ?? null
    } catch (err) {
      console.error('Failed to read from local/session storage')
    }

    if (saved == null) return null

    try {
      return JSON.parse(saved) as T
    } catch (err) {
      console.error('Failed to read from local/session storage')
    }
    return null
  }

  public setItem = <T>(key: string, item: T): void => {
    const fullKey = this.getPrefixedKey(key)
    try {
      if (item == null) {
        this.storage?.removeItem(fullKey)
      } else {
        this.storage?.setItem(fullKey, JSON.stringify(item))
      }
    } catch (err) {
      console.error('Failed to write to local/session storage')
    }
  }

  public removeItem = (key: string): void => {
    const fullKey = this.getPrefixedKey(key)
    try {
      this.storage?.removeItem(fullKey)
    } catch (err) {
      console.error('Failed to remove from local/session storage')
    }
  }
}

const local = new Storage(
  typeof window !== 'undefined' ? window.localStorage : undefined
)

export const localItem = <T>(
  key: string
): { get: () => T | null; set: (value: T) => void; remove: () => void } => ({
  get: () => local.getItem<T>(key),
  set: (value: T) => {
    local.setItem<T>(key, value)
  },
  remove: () => {
    local.removeItem(key)
  }
})

export default local
