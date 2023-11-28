import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route ,BrowserRouter} from "react-router-dom"
import MiembroList from "./miembro/MiembroList"
import MiembroCreate from "./miembro/MiembroCreate"
import MiembroEdit from "./miembro/MiembroEdit"
import IngresoList from "./screen/ingreso/IngresoList"
import IngresoCreate from "./screen/ingreso/IngresoCreate"
import IngresoEdit from "./screen/ingreso/IngresoEdit"
import ActividadList from "./screen/actividad/ActividadList"
import ActividadCreate from "./screen/actividad/ActividadCreate"
import ActividadEdit from "./screen/actividad/ActividadEdit"
import RecaudacionList from "./screen/recaudacion/RecaudacionList"
import RecaudacionCreate from "./screen/recaudacion/RecaudacionCreate"
import AsistenciaList from "./screen/asistencia/AsistenciaList"
import AsistenciaCreate from "./screen/asistencia/AsistenciaCreate"
import Login from "./pages/Login"
import Registration from "./pages/Registration"
import Dashboard from './dashboard/Dashboard';
import SermonList from './sermon/SermonList';
import SermonCreate from './sermon/SermonCreate';
import SermonMiembroList from './sermon/SermonMiembroList';
import ComentarioList from './sermon/ComentarioList';
import ComentarioAdministradorList from './sermon/ComentarioAdministadorList';

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/signup" element={<Registration />} />
        <Route exact path="/bi" element={<Dashboard />} />
        <Route exact path="/dashboard" element={<MiembroList />} />
        <Route exact path="/sermon" element={<SermonList />} />
        <Route exact path="/sermonMiembro" element={<SermonMiembroList />} />
        <Route exact path="/comentarios/:id" element={<ComentarioList />} />
        <Route exact path="/comentarios/administrador/:id" element={<ComentarioAdministradorList />} />
        <Route exact path="/sermon/create" element={<SermonCreate />} />
        <Route path="/create" element={<MiembroCreate />} />
        <Route path="/edit/:id" element={<MiembroEdit />} />

        <Route path="miembro/create" element={<MiembroCreate />} />
        <Route path="miembro/edit/:id" element={<MiembroEdit />} />

        <Route path="actividad/list" element={<ActividadList />} />
        <Route path="actividad/create" element={<ActividadCreate />} />
        <Route path="actividad/edit/:id" element={<ActividadEdit />} />
        <Route path="actividad/asistencia/:id/:nombre" element={<AsistenciaList />} />
        <Route path="actividad/recaudacion/:id/:nombre" element={<RecaudacionList />} />

        <Route path="Ingreso/list" element={<IngresoList />} />
        <Route path="ingreso/create" element={<IngresoCreate />} />
        <Route path="ingreso/edit/:id" element={<IngresoEdit />} />
        
        <Route path="recaudacion/create/:id/:nombre" element={<RecaudacionCreate />} />
        <Route path="asistencia/create/:id/:nombre" element={<AsistenciaCreate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
