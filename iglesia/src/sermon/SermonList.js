import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import Layout from '../components/Layout';
import NavSidebar from '../components/NavSidebar';
import { urlNodeMicroservicio } from './../helpers/Url';

function SermonList() {
  const navigate = useNavigate();
  const [sermonList, setSermonList] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('token') == null) {
      navigate('/');
    }
    fetchSermonList();
  }, []);

  const axiosInstance = axios.create({
    baseURL: `${urlNodeMicroservicio}sermon`,
  });

  const fetchSermonList = () => {
    axiosInstance
      .get('/',
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

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .delete(`/${id}`)
          .then(function (response) {
            Swal.fire({
              icon: 'success',
              title: 'Sermon deleted successfully!',
              showConfirmButton: false,
              timer: 1500,
            });
            fetchSermonList();
          })
          .catch(function (error) {
            Swal.fire({
              icon: 'error',
              title: 'An Error Occurred!',
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
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
              <Link className="btn btn-outline-primary" to="/sermon/create">
                Crear Sermon{' '}
              </Link>
              <button
                onClick={() => Logout()}
                className="btn btn-outline-danger float-end"
              >
                Logout
              </button>
            </div>
            <div className="card-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Imagen</th>
                    <th width="240px">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sermonList.map((sermon) => (
                    <tr key={sermon._id}>
                      <td>{sermon._id}</td>
                      <td>{sermon.name}</td>
                      <td>
                        <img
                          src="/misa.jpg"
                          alt={`${sermon.name}`}
                          style={{ maxWidth: '100px', maxHeight: '100px' }}
                        />
                      </td>
                      <td>
                        
                        <button
                          onClick={() => handleDelete(sermon._id)}
                          className="btn btn-outline-danger mx-1"
                        >
                          Delete
                        </button>
                        <Link
                        className="btn btn-outline-success mx-1"
                        to={`/comentarios/administrador/${sermon._id}`}>
                        Ver comentarios
                    </Link>
                      </td>
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

export default SermonList;
