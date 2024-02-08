import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import type { ReactNode } from 'react'
import { localItem } from '../../lib/storage'

const ANALYTICS_PREFERENCE_KEY = 'analyticsPreference'
const analyticsPreference = localItem<boolean>(ANALYTICS_PREFERENCE_KEY)
interface CookieBannerContextType {
  isBannerOpen: boolean
  openBanner: () => void
  closeBanner: () => void
  isAnalyticsEnabled: boolean
  setIsAnalyticsEnabled: (preference: boolean) => void
}

const CookieBannerContext = createContext<CookieBannerContextType>({
  isBannerOpen: false,
  openBanner: () => {},
  closeBanner: () => {},
  isAnalyticsEnabled: false,
  setIsAnalyticsEnabled: () => {}
})

export const CookieBannerContextProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [isBannerOpen, setIsBannerOpen] = useState(false)
  const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useState(false)

  const openBanner = useCallback(() => {
    setIsBannerOpen(true)
  }, [])

  const closeBanner = useCallback(() => {
    setIsBannerOpen(false)
  }, [])

  // Sync local state
  useEffect(() => {
    const preference = analyticsPreference.get()

    // Open cookie banner if no preference is set
    if (preference == null) {
      openBanner()
    } else {
      setIsAnalyticsEnabled(Boolean(preference))
    }
  }, [openBanner])

  const storeIsAnalyticsEnabled = useCallback((preference: boolean) => {
    analyticsPreference.set(preference)
    setIsAnalyticsEnabled(preference)
  }, [])

  return (
    <CookieBannerContext.Provider
      value={{
        isBannerOpen,
        openBanner,
        closeBanner,
        isAnalyticsEnabled,
        setIsAnalyticsEnabled: storeIsAnalyticsEnabled
      }}
    >
      {children}
    </CookieBannerContext.Provider>
  )
}

export const useCookieBannerContext = (): CookieBannerContextType => {
  const cookieContext = useContext(CookieBannerContext)

  if (cookieContext == null) {
    throw new Error(
      'useCookieBannerContext must be used within a CookieBannerContextProvider'
    )
  }

  return cookieContext
}
