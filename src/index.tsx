import '@ibm/plex/css/ibm-plex.css'
import { App } from './components/App'
import { createRoot } from 'react-dom/client'

import 'tailwindcss/tailwind.css'
import './index.css'

// @ts-ignore https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/1615
screen.orientation.lock('portrait')

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

root.render(<App />)
