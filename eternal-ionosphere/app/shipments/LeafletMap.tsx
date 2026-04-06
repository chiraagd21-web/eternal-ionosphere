'use client'

import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface ShipmentData {
  id: string
  origin: string
  destination: string
  originLat?: number
  originLon?: number
  destLat?: number
  destLon?: number
  type: string
  shipDate: string
  eta: string
  supplier: string
  product: string
}

const PORTS: Record<string, [number, number]> = {
  'Shenzhen': [22.5431, 114.0579],
  'Shanghai': [31.2304, 121.4737],
  'Ho Chi Minh': [10.8231, 106.6297],
  'Los Angeles': [34.0522, -118.2437],
  'New York': [40.7128, -74.0060],
  'Rotterdam': [51.9225, 4.4777],
  'Jebel Ali': [25.0112, 55.0273],
  'Mumbai': [19.0760, 72.8777],
  'London': [51.5074, -0.1278],
  'Tokyo': [35.6762, 139.6503],
}

// Great Circle calculations
const toRad = (n: number) => (n * Math.PI) / 180
const toDeg = (n: number) => (n * 180) / Math.PI

const getGreatCirclePoints = (start: [number, number], end: [number, number], segments = 50) => {
  const points: [number, number][] = []
  const [lat1, lon1] = start.map(toRad)
  const [lat2, lon2] = end.map(toRad)

  const d = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin((lat1 - lat2) / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lon1 - lon2) / 2), 2)))

  for (let i = 0; i <= segments; i++) {
    const f = i / segments
    const A = Math.sin((1 - f) * d) / Math.sin(d)
    const B = Math.sin(f * d) / Math.sin(d)
    const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2)
    const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2)
    const z = A * Math.sin(lat1) + B * Math.sin(lat2)
    const lat = Math.atan2(z, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)))
    const lon = Math.atan2(y, x)
    points.push([toDeg(lat), toDeg(lon)])
  }
  return points
}

const interpolateGreatCircle = (start: [number, number], end: [number, number], progress: number): [number, number] => {
  if (progress <= 0) return start
  if (progress >= 1) return end
  
  const [lat1, lon1] = start.map(toRad)
  let lat2 = toRad(end[0])
  let lon2 = toRad(end[1])

  // Handle anti-meridian wrap for shortest path
  let dLon = lon2 - lon1
  if (dLon > Math.PI) lon2 -= 2 * Math.PI
  else if (dLon < -Math.PI) lon2 += 2 * Math.PI

  const d = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin((lat1 - lat2) / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lon1 - lon2) / 2), 2)))

  const f = progress
  if (d === 0) return start;
  const A = Math.sin((1 - f) * d) / Math.sin(d)
  const B = Math.sin(f * d) / Math.sin(d)
  
  const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2)
  const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2)
  const z = A * Math.sin(lat1) + B * Math.sin(lat2)
  const lat = Math.atan2(z, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)))
  const lon = Math.atan2(y, x)
  
  return [toDeg(lat), toDeg(lon)]
}

const getLatLng = (location: string, lat?: number, lon?: number): [number, number] => {
  if (lat !== undefined && lon !== undefined && lat !== 0 && lon !== 0) {
    return [lat, lon]
  }
  const port = PORTS[location]
  if (port) return port
  // Try to find a partial match
  for (const [key, val] of Object.entries(PORTS)) {
    if (location.toLowerCase().includes(key.toLowerCase())) return val
  }
  return [0, 0]
}

const calculateProgress = (shipDateStr: string, etaStr: string) => {
  const start = new Date(shipDateStr).getTime()
  const end = new Date(etaStr).getTime()
  const now = new Date().getTime()
  if (now <= start) return 0
  if (now >= end) return 1
  return (now - start) / (end - start)
}

const getIconForType = (type: string, isNearArrival: boolean) => {
  const truckSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-5h-7v6h2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>`
  const shipSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.2.9 4.2 2.38 5.71"/><path d="M12 10V3"/><path d="M12 3L9 6"/><path d="M12 3l3 3"/></svg>`
  const planeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`
  
  if (isNearArrival) return truckSvg
  if (type === 'sea') return shipSvg
  if (type === 'air') return planeSvg
  return truckSvg
}

const getBorderColor = (type: string, isNearArrival: boolean) => {
  if (isNearArrival) return '#34d399'
  if (type === 'sea') return '#6366f1'
  if (type === 'air') return '#38bdf8' // Better sky blue
  return '#fbbf24'
}

const LeafletMap = ({ shipments }: { shipments: ShipmentData[] }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const layerGroupRef = useRef<L.LayerGroup | null>(null)

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      center: [20, 10],
      zoom: 2,
      minZoom: 1.5,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
      worldCopyJump: true,
    })

    // Lively Map Styles: Use a high-quality satellite hybrid approach
    // Base satellite layer
    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri'
    })

    // Dark labels and streets for that premium look
    const labels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
    })

    // Voyage - a more colorful and lively street map (fallback/alternative)
    const voyage = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
    })

    // We'll use the Voyage map for "Lively" and "Interesting" as requested
    voyage.addTo(map)

    // Add zoom control to bottom left
    L.control.zoom({ position: 'bottomleft' }).addTo(map)

    layerGroupRef.current = L.layerGroup().addTo(map)
    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Update markers whenever shipments change
  useEffect(() => {
    const map = mapInstanceRef.current
    const layerGroup = layerGroupRef.current
    if (!map || !layerGroup) return

    layerGroup.clearLayers()

    shipments.forEach((s) => {
      const originLatLng = getLatLng(s.origin, s.originLat, s.originLon)
      const destLatLng = getLatLng(s.destination, s.destLat, s.destLon)
      
      if (originLatLng[0] === 0 && originLatLng[1] === 0) return

      const progress = calculateProgress(s.shipDate, s.eta)
      const currentPos = interpolateGreatCircle(originLatLng, destLatLng, progress)
      const isNearArrival = progress > 0.9

      // Use Great Circle path for route
      const arcPoints = getGreatCirclePoints(originLatLng, destLatLng)

      // Background route line (faded)
      const routeLine = L.polyline(arcPoints, {
        color: getBorderColor(s.type, false),
        weight: 2,
        opacity: 0.2,
        dashArray: '4 6',
      })
      layerGroup.addLayer(routeLine)

      // Completed portion (Great Circle)
      const completedPoints = getGreatCirclePoints(originLatLng, currentPos)
      const completedLine = L.polyline(completedPoints, {
        color: getBorderColor(s.type, isNearArrival),
        weight: 3,
        opacity: 0.8,
      })
      layerGroup.addLayer(completedLine)

      // Origin marker
      const originMarker = L.circleMarker(originLatLng, {
        radius: 4,
        fillColor: '#6366f1',
        fillOpacity: 1,
        color: 'white',
        weight: 2,
      })
      originMarker.bindTooltip(`<strong>From:</strong> ${s.origin}`, { direction: 'top', className: 'custom-tooltip' })
      layerGroup.addLayer(originMarker)

      // Destination marker
      const destMarker = L.circleMarker(destLatLng, {
        radius: 4,
        fillColor: '#ef4444',
        fillOpacity: 1,
        color: 'white',
        weight: 2,
      })
      destMarker.bindTooltip(`<strong>To:</strong> ${s.destination}`, { direction: 'top', className: 'custom-tooltip' })
      layerGroup.addLayer(destMarker)

      // Shipment marker
      const borderColor = getBorderColor(s.type, isNearArrival)
      const iconUrl = getIconForType(s.type, isNearArrival)

      const shipIcon = L.divIcon({
        className: 'shipment-marker',
        html: `
          <div style="position:relative; width:44px; height:44px;">
            <div style="
              position:absolute; inset:0;
              border-radius:50%;
              background: ${borderColor}44;
              animation: ship-pulse 2s infinite ease-out;
            "></div>
            <div style="
              position:absolute; top:4px; left:4px; width:36px; height:36px;
              border-radius:50%;
              border: 3px solid ${borderColor};
              background: white;
              overflow:hidden;
              box-shadow: 0 4px 15px ${borderColor}66;
              display:flex; align-items:center; justify-content:center;
              transform: scale(1);
              transition: transform 0.2s;
              color: ${borderColor};
              padding: 4px;
            " class="ship-inner">
              ${iconUrl}
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      })

      const shipMarker = L.marker(currentPos, { icon: shipIcon })
      shipMarker.bindPopup(`
        <div style="min-width:220px; font-family:Inter,sans-serif; padding:4px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-size:10px; font-weight:800; background:${borderColor}22; color:${borderColor}; padding:2px 6px; border-radius:4px; letter-spacing:0.5px;">${s.id}</span>
            <span style="font-size:10px; color:#64748b; font-weight:600;">${Math.round(progress * 100)}% Complete</span>
          </div>
          <div style="font-size:14px; font-weight:700; margin-bottom:2px; color:#1e293b;">${s.supplier}</div>
          <div style="font-size:11px; color:#64748b; margin-bottom:12px;">${s.product}</div>
          
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; background:#f8fafc; padding:8px; border-radius:8px;">
            <div style="flex:1; font-size:10px;">
              <div style="color:#94a3b8; margin-bottom:2px;">ORIGIN</div>
              <div style="font-weight:600; color:#475569;">${s.origin}</div>
            </div>
            <div style="color:#cbd5e1;">&rarr;</div>
            <div style="flex:1; font-size:10px;">
              <div style="color:#94a3b8; margin-bottom:2px;">DESTINATION</div>
              <div style="font-weight:600; color:#475569;">${s.destination}</div>
            </div>
          </div>

          <div style="position:relative; height:8px; background:#e2e8f0; border-radius:4px; overflow:hidden;">
            <div style="position:absolute; height:100%; width:${progress * 100}%; background:linear-gradient(90deg, ${borderColor}, #8b5cf6); border-radius:4px;"></div>
          </div>
        </div>
      `, { className: 'premium-popup' })
      layerGroup.addLayer(shipMarker)
    })
  }, [shipments])

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      <style jsx global>{`
        .custom-tooltip {
          background: rgba(15, 23, 42, 0.9) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 6px !important;
          color: white !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
          font-size: 11px !important;
          padding: 4px 8px !important;
        }
        .premium-popup .leaflet-popup-content-wrapper {
          border-radius: 16px !important;
          padding: 8px !important;
          box-shadow: 0 20px 50px rgba(0,0,0,0.15) !important;
          border: 1px solid rgba(0,0,0,0.05) !important;
        }
        .premium-popup .leaflet-popup-tip-container {
          display: none;
        }
        @keyframes ship-pulse {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2); opacity: 0; }
        }
        .shipment-marker:hover .ship-inner {
          transform: scale(1.1) !important;
          z-index: 1000;
        }
        .leaflet-container {
          background: #f1f5f9;
        }
      `}</style>
    </div>
  )
}

export default LeafletMap
