import { useEffect, useState } from 'react'
import { X, DownloadCloud, RefreshCw, CheckCircle2, WifiOff } from 'lucide-react'
import { registerSW } from 'virtual:pwa-register'

// Simple PWA prompts in French: Update available + Install banner + Offline ready
export default function PWAPrompt() {
  const [needRefresh, setNeedRefresh] = useState(false)
  const [offlineReady, setOfflineReady] = useState(false)
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstall, setShowInstall] = useState(false)
  const [showOffline, setShowOffline] = useState(false)

  useEffect(() => {
    // Register service worker and wire callbacks
    registerSW({
      immediate: true,
      onNeedRefresh() {
        setNeedRefresh(true)
      },
      onOfflineReady() {
        setOfflineReady(true)
        setShowOffline(true)
        // Auto-hide after a few seconds
        setTimeout(() => setShowOffline(false), 4000)
      }
    })

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault()
      // @ts-expect-error types for BeforeInstallPromptEvent are not in lib.dom by default
      setInstallEvent(e)
      setShowInstall(true)
    }
    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const refreshNow = () => {
    setNeedRefresh(false)
    // Force reload to let the new Service Worker take control
    window.location.reload()
  }

  const installApp = async () => {
    if (!installEvent) return
    // @ts-ignore - showPrompt is not standard; prompt() exists on the event
    await installEvent.prompt?.()
    // close banner regardless
    setShowInstall(false)
  }

  return (
    <>
      {/* Update available banner */}
      {needRefresh && (
        <div className="fixed inset-x-0 bottom-4 z-[60] px-4">
          <div className="mx-auto max-w-md rounded-xl bg-gray-900 text-white shadow-2xl ring-1 ring-white/10">
            <div className="flex items-start gap-3 p-4">
              <div className="shrink-0 mt-0.5"><RefreshCw className="h-5 w-5 text-yellow-300"/></div>
              <div className="text-sm">
                <p className="font-semibold">Nouvelle version disponible</p>
                <p className="text-white/80">Mettez à jour l'application pour profiter des dernières améliorations.</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => setNeedRefresh(false)} className="px-3 py-1.5 text-xs rounded-md bg-white/10 hover:bg-white/15">Plus tard</button>
                  <button onClick={refreshNow} className="px-3 py-1.5 text-xs rounded-md bg-primary-500 hover:bg-primary-400 text-white">Mettre à jour</button>
                </div>
              </div>
              <button className="ml-auto p-1 text-white/70 hover:text-white" onClick={() => setNeedRefresh(false)}><X className="h-4 w-4"/></button>
            </div>
          </div>
        </div>
      )}

      {/* Install app banner */}
      {showInstall && (
        <div className="fixed inset-x-0 bottom-4 z-[60] px-4">
          <div className="mx-auto max-w-md rounded-xl bg-white shadow-2xl ring-1 ring-black/5">
            <div className="flex items-start gap-3 p-4">
              <div className="shrink-0 mt-0.5"><DownloadCloud className="h-5 w-5 text-primary-600"/></div>
              <div className="text-sm">
                <p className="font-semibold text-gray-900">Installer l'application</p>
                <p className="text-gray-600">Accédez à SchoolConnect directement depuis votre écran d'accueil.</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => setShowInstall(false)} className="px-3 py-1.5 text-xs rounded-md bg-gray-100 hover:bg-gray-200">Plus tard</button>
                  <button onClick={installApp} className="px-3 py-1.5 text-xs rounded-md bg-primary-600 hover:bg-primary-500 text-white">Installer</button>
                </div>
              </div>
              <button className="ml-auto p-1 text-gray-500 hover:text-gray-700" onClick={() => setShowInstall(false)}><X className="h-4 w-4"/></button>
            </div>
          </div>
        </div>
      )}

      {/* Offline ready toast */}
      {showOffline && offlineReady && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-20 z-[60] px-4">
          <div className="flex items-center gap-2 rounded-full bg-gray-900 text-white px-3 py-2 text-xs shadow-lg">
            <CheckCircle2 className="h-4 w-4 text-emerald-400"/>
            <span>Disponible hors ligne</span>
          </div>
        </div>
      )}

      {/* Offline indicator if connection lost */}
      <NetworkIndicator />
    </>
  )
}

function NetworkIndicator() {
  const [offline, setOffline] = useState(!navigator.onLine)
  useEffect(() => {
    const on = () => setOffline(false)
    const off = () => setOffline(true)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  if (!offline) return null
  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-4 z-[60] px-4">
      <div className="flex items-center gap-2 rounded-full bg-gray-900 text-white px-3 py-2 text-xs shadow-lg">
        <WifiOff className="h-4 w-4 text-yellow-300"/>
        <span>Vous êtes hors ligne</span>
      </div>
    </div>
  )
}

// Types
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
  prompt: () => Promise<void>
}
