import AppointmentCard from './components/AppointmentCard'
import './App.css'

function App() {


  return (
    <>
    <div className="App">
      <AppointmentCard 
  patientName="Abebe Bikila" 
  caseType="Cardiac Checkup" 
  time="10:30 AM" 
  status="confirmed" 
/>
</div>
    </>
  )
}

export default App
