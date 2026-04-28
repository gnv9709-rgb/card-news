import { CardViewer } from './components/viewer/CardViewer'
import { sampleCardNews } from './data/cards'
import './App.css'

function App() {
  return (
    <main>
      <CardViewer cardNews={sampleCardNews} />
    </main>
  )
}

export default App
