import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import NavSidebar from '../components/NavSidebar';
import { urlNodeMicroservicio } from './../helpers/Url';

function SermonMiembroList() {
  const navigate = useNavigate();
  const [sermonList, setSermonList] = useState([]);

  useEffect(() => {
    fetchSermonList();
  }, []);

  const axiosInstance = axios.create({
    baseURL: `${urlNodeMicroservicio}sermon/`,
  });

  const fetchSermonList = () => {
    axiosInstance
      .get('/')
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
          <h2 className="text-center mt-5 mb-3">Lista de Sermones de Miembros</h2>
          <div className="card" >
            <div className="card-header">
            <button
                onClick={() => Logout()}
                className="btn btn-outline-danger float-end"
              >
                Logout
              </button>
            </div>
            <div className="card-body" style={{ alignSelf : 'center' }}>
              {sermonList.map((sermon) => (
                <div key={sermon._id} className="mb-4">
                  <div className="card">
                    <img
                          src="/misa.jpg"
                      alt={sermon.name}
                      className="card-img-top"
                      style={{ objectFit: 'cover', height: '200px' }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{sermon.name}</h5>
                      {/* Puedes agregar más detalles si es necesario */}
                      {/* Por ejemplo, podrías mostrar la fecha del sermón, etc. */}
                      <Link
                        className="btn btn-outline-success mx-1"
                        to={`/comentarios/${sermon._id}`}>
                        Ver comentarios
                    </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </NavSidebar>
  );
}

export default SermonMiembroList;
