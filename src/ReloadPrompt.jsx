import React from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      { (offlineReady || needRefresh)
        && <div className="bg-white border-l-4 border-blue-500 rounded-lg shadow-lg p-4 max-w-md animate-slide-in-right">
            <div className="mb-3">
              { offlineReady
                ? <p className="text-sm text-gray-800 font-medium">Aplicación lista para trabajar de manera offline</p>
                : <p className="text-sm text-gray-800 font-medium">Nuevo contenido disponible. Click en el botón Reload para actualizar.</p>
              }
            </div>
            <div className="flex gap-2 justify-end">
              { needRefresh && <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition" onClick={() => updateServiceWorker(true)}>Reload</button> }
              <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition" onClick={() => close()}>Close</button>
            </div>
        </div>
      }
    </div>
  )
}

export default ReloadPrompt