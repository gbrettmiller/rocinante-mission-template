import { useState, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import { useVsmStore } from '../../stores/vsmStore'
import { toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'

function Header() {
  const { name, updateMapName, exportToJson, importFromJson, clearMap } =
    useVsmStore()
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState(name)
  const fileInputRef = useRef(null)

  const handleNameClick = useCallback(() => {
    setTempName(name)
    setIsEditingName(true)
  }, [name])

  const handleNameSubmit = useCallback(() => {
    if (tempName.trim()) {
      updateMapName(tempName.trim())
    }
    setIsEditingName(false)
  }, [tempName, updateMapName])

  const handleNameKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        handleNameSubmit()
      } else if (e.key === 'Escape') {
        setIsEditingName(false)
      }
    },
    [handleNameSubmit]
  )

  const handleExportJson = useCallback(() => {
    const json = exportToJson()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name || 'vsm'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [exportToJson, name])

  const handleExportPng = useCallback(async () => {
    const canvas = document.querySelector('.react-flow')
    if (!canvas) return

    try {
      const dataUrl = await toPng(canvas, {
        backgroundColor: '#f3f4f6',
        quality: 1,
      })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `${name || 'vsm'}.png`
      a.click()
    } catch (err) {
      console.error('Failed to export PNG:', err)
    }
  }, [name])

  const handleExportPdf = useCallback(async () => {
    const canvas = document.querySelector('.react-flow')
    if (!canvas) return

    try {
      const dataUrl = await toPng(canvas, {
        backgroundColor: '#f3f4f6',
        quality: 1,
      })
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
      })
      const imgProps = pdf.getImageProperties(dataUrl)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`${name || 'vsm'}.pdf`)
    } catch (err) {
      console.error('Failed to export PDF:', err)
    }
  }, [name])

  const handleImport = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        const result = importFromJson(event.target.result)
        if (!result) {
          alert('Failed to import file. Please check the format.')
        }
      }
      reader.readAsText(file)
      e.target.value = ''
    },
    [importFromJson]
  )

  const handleNewMap = useCallback(() => {
    if (confirm('Create a new map? This will clear the current map.')) {
      clearMap()
    }
  }, [clearMap])

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🗺️</span>
          <span className="font-semibold text-gray-700">VSM Workshop</span>
        </div>
        <div className="h-6 w-px bg-gray-300" />
        {isEditingName ? (
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={handleNameKeyDown}
            className="px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
            data-testid="map-name-input"
          />
        ) : (
          <button
            onClick={handleNameClick}
            className="text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors"
            data-testid="map-name"
          >
            {name}
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleNewMap}
          className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
          data-testid="new-map-button"
        >
          New Map
        </button>
        <button
          onClick={handleImport}
          className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
          data-testid="import-button"
        >
          Import
        </button>
        <div className="relative group">
          <button
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            data-testid="export-button"
          >
            Export ▾
          </button>
          <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <button
              onClick={handleExportJson}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              data-testid="export-json"
            >
              Export as JSON
            </button>
            <button
              onClick={handleExportPng}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              data-testid="export-png"
            >
              Export as PNG
            </button>
            <button
              onClick={handleExportPdf}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              data-testid="export-pdf"
            >
              Export as PDF
            </button>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </header>
  )
}

export default Header
