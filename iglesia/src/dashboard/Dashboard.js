import React, { useState, useEffect} from 'react';
import axios from 'axios';
import {urlPythonMicroservicio ,urlPhpMicroservicio} from './../helpers/Url';
import Layout from "../components/Layout"
import Swal from 'sweetalert2'
import { useSpring, animated } from 'react-spring';
import NavSidebar from '../components/NavSidebar'
const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [actividad, setActividad] = useState(0);
  const [actividades, setActividades] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [showChart, setShowChart] = useState(false);

  const axiosInstance = axios.create({
      baseURL: `${urlPythonMicroservicio}`,
  });
  const fadeIn = useSpring({
    opacity: showChart ? 1 : 0,
    from: { opacity: 0 },
  });
  useEffect(() => {
    // Llama a los servicios cuando el componente carga
    fetchActividades();
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      // Lista de servicios a consumir
      const serviceEndpoints = [
        '/grafica',
        '/grafico_ingresos_actividad',
        '/grafica_porcentaje_asistencias',
        '/grafico_top10_asistencias_actividades',
      ];

      // Realiza las llamadas a los servicios en paralelo usando Promise.all
      const responses = await Promise.all(
        serviceEndpoints.map(async (endpoint) => {
          try {
            const response = await axiosInstance.post(
              endpoint,
              { fecha_inicio: startDate, fecha_fin: endDate , actividad_id: actividad},
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );
            return { endpoint, chartBase64: response.data.imagen_base64 };
          } catch (error) {
            console.error(`Error al obtener datos de ${endpoint}`, error);
            return { endpoint, chartBase64: null };
          }
        })
      );

      // Actualiza el estado con la información de las gráficas
      setChartData(responses);
      setShowChart(true);
    } catch (error) {
      console.error('Error al obtener la información de las gráficas', error);
    }
  };
  const fetchActividades = () => {
    axios.create({
      baseURL: `${urlPhpMicroservicio}actividad/`,
  }).get('/listar')
        .then(function (response) {
          setActividades(response.data.data);
        })
        .catch(function (error) {
            console.log(error);
        })
}
  const handleButtonClick = () => {
    // Llama a los servicios cuando el botón es presionado
    setShowChart(false);
    fetchChartData();
  };
  
  return (
    <NavSidebar>
      <Layout>
      <div className="container mt-4">
      <h2>Dashboard</h2>
      <div className="form-group">
        <label htmlFor="startDate">Fecha de Inicio:</label>
        <input
          type="date"
          id="startDate"
          className="form-control"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="endDate">Fecha de Fin:</label>
        <input
          type="date"
          id="endDate"
          className="form-control"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div className="form-group">
          <label htmlFor="actividad">Actividad</label>
          <select
              onChange={(event) => { setActividad(event.target.value) }}
              value={actividad}
              type="text"
              className="form-control"
              id="actividad"
              name="actividad" >
              <option value="0">Seleccione una actividad</option>
                  {actividades.map((actividad, key) => {
                      return (
                          <option value={actividad.id}>{actividad.nombre}</option>
                      )
                  })}
          </select>
      </div>
      
      <button className="btn btn-primary" onClick={handleButtonClick}>
        Obtener Gráficas
      </button>
      <div className="row mt-4">
        {chartData.map((data, index) => (
          <div className="col-md-6" key={index}>
            <h3>Gráfica {index + 1}:</h3>
            {data.chartBase64 ? (
               <animated.img style={{ width: '100%', height: 'auto',
              ...fadeIn }} src={`data:image/png;base64, ${data.chartBase64}`} alt={`Gráfica ${index + 1}`} />
            ) : (
              <p>No se pudo obtener la gráfica desde {data.endpoint}</p>
            )}
          </div>
        ))}
      </div>
    </div>
      </Layout>
    </NavSidebar>
    
  );
};

export default Dashboard;
