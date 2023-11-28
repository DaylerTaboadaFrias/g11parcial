import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import Layout from '../components/Layout';
import { urlNodeMicroservicio } from './../helpers/Url'; // Cambio en la importación

function SermonCreate() {
  const [name, setName] = useState('');
  const [file, setFile] = useState(null); // Cambio en el estado para el campo 'file'
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token') == null) {
      navigate('/');
    }
  }, []);

  const axiosInstance = axios.create({
    baseURL: `${urlNodeMicroservicio}sermon/`, // Cambio en la URL
  });

  const handleSave = () => {
    setIsSaving(true);

    // Crear un objeto FormData para enviar el archivo
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);

    axiosInstance
      .post('/', formData)
      .then(function (response) {
        Swal.fire({
          icon: 'success',
          title: 'Sermon saved successfully!',
          showConfirmButton: false,
          timer: 1500,
        });
        setIsSaving(false);
        setName('');
        setFile(null);
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

  return (
    <Layout>
      <div className="container">
        <h2 className="text-center mt-5 mb-3">Crear nuevo sermon</h2>
        <div className="card">
          <div className="card-header">
            <Link
              className="btn btn-outline-info float-right"
              to="/sermon"
            >
              Gestionar sermon
            </Link>
          </div>
          <div className="card-body">
            <form>
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                  value={name}
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="file">Archivo</label>
                <input
                  onChange={(event) => {
                    setFile(event.target.files[0]);
                  }}
                  type="file"
                  className="form-control"
                  id="file"
                  name="file"
                />
              </div>
              <button
                disabled={isSaving}
                onClick={handleSave}
                type="button"
                className="btn btn-outline-primary mt-3"
              >
                Guardar sermon
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default SermonCreate;
