import React, { useState, useEffect } from 'react';
import { Link, useNavigate,useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import Layout from '../components/Layout';
import NavSidebar from '../components/NavSidebar';
import { urlNodeMicroservicio } from '../helpers/Url';

function ComentarioAdministradorList() {
  const [id, setId] = useState(useParams().id)
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [sermonList, setSermonList] = useState([]);
  const [promedio, setPromedio] = useState(0);

  useEffect(() => {
    if (localStorage.getItem('token') == null) {
      navigate('/');
    }
    fetchSermonList();
  }, []);

  const axiosInstance = axios.create({
    baseURL: `${urlNodeMicroservicio}comentario`,
  });

  const handleSave = () => {
    setIsSaving(true);
   
    axiosInstance
      .post('/', {
          idSermon: id,
          descripcion: descripcion
      })
      .then(function (response) {
        Swal.fire({
          icon: 'success',
          title: 'Sermon saved successfully!',
          showConfirmButton: false,
          timer: 1500,
        });
        setIsSaving(false);
        setDescripcion('');
        fetchSermonList();
      })
      .catch(function (error) {
        Swal.fire({
          icon: 'error',
          title: 'An Error Occurred!',
          showConfirmButton: false,
          timer: 1500,
        });
        setIsSaving(false);
      });
  };

  const fetchSermonList = () => {
    axiosInstance
      .get('/'+id,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        setSermonList(response.data.body);
        setPromedio(calcularPromedio(response.data.body));
        
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const calcularPromedio = (array) => {
    const valores = array.map((item) => parseInt(item.valor, 10) || 0);
    const suma = valores.reduce((acc, valor) => acc + valor, 0);
    const promedio = valores.length > 0 ? suma / valores.length : 0;
    return promedio;
  };
  const Logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('tipo');
    navigate('/');
  };

  return (
    <NavSidebar>
      <Layout>
        <div className="container">
          <h2 className="text-center mt-5 mb-3">Gestionar Sermon</h2>
          <div className="card">
            <div className="card-header">
              <button
                onClick={() => Logout()}
                className="btn btn-outline-danger float-end"
              >
                Logout
              </button>
            </div>
            <div className="card-body">
            
          <h3> PROMEDIO DE CALIFICACION DEL SERMON ES  : {promedio}</h3>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Descripcion</th>
                    <th>Sentimiento</th>
                    <th>Calificacion</th>
                  </tr>
                </thead>
                <tbody>
                  {sermonList.map((sermon) => (
                    <tr key={sermon._id}>
                      <td>{sermon.descripcion}</td>
                      <td>{sermon.sentimiento}</td>
                      <td>{sermon.valor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Layout>
    </NavSidebar>
  );
}

export default ComentarioAdministradorList;
