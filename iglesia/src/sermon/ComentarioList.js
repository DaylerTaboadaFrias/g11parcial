import React, { useState, useEffect } from 'react';
import { Link, useNavigate,useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import Layout from '../components/Layout';
import NavSidebar from '../components/NavSidebar';
import { urlNodeMicroservicio } from '../helpers/Url';

function ComentarioList() {
  const [id, setId] = useState(useParams().id)
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [sermonList, setSermonList] = useState([]);

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
      })
      .catch(function (error) {
        console.log(error);
      });
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
            <form>
              <div className="form-group">
                  <label htmlFor="descripcion">Descripcion</label>
                  <textarea
                      onChange={(event) => { setDescripcion(event.target.value) }}
                      value={descripcion}
                      type="text"
                      className="form-control"
                      id="descripcion"
                      name="descripcion" />
              </div>
              
              <button
                  disabled={isSaving}
                  onClick={handleSave}
                  type="button"
                  className="btn btn-outline-primary mt-3">
                  Enviar comentario
              </button>
          </form>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Descripcion</th>
                  </tr>
                </thead>
                <tbody>
                  {sermonList.map((sermon) => (
                    <tr key={sermon._id}>
                      <td>{sermon._id}</td>
                      <td>{sermon.descripcion}</td>
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

export default ComentarioList;
