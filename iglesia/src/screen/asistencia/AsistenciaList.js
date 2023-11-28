import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
import axios from 'axios'
import Layout from "../../components/Layout"
import { urlPhpMicroservicio } from '../../helpers/Url';
import NavSidebar from '../../components/NavSidebar'

function ProjectEdit() {
    const { id, nombre } = useParams();
    // const [id, setId] = useState(useParams().id)
    const navigate = useNavigate();
    const [asistenciaList, setAsistencia] = useState([])
    const [getAsistencia, setGetAsistencia] = useState([])

    useEffect(() => {
        if (localStorage.getItem('token') == null) {
            navigate("/");
        }
        fetchProjectList();
        fetchProjectListAsistencia();
    }, [])

    const axiosInstance = axios.create({
        baseURL: `${urlPhpMicroservicio}asistencia/`,
    });

    const axiosInstanceActividad = axios.create({
        baseURL: `${urlPhpMicroservicio}actividad/`,
    });
    const fetchProjectListAsistencia = () => {
        axiosInstanceActividad.get(`obtener/${id}`)
         
            .then(function (response) {
                
                setGetAsistencia(response.data.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    const fetchProjectList = () => {
        axiosInstance.get(`actividad/${id}`)
            .then(function (response) {
                setAsistencia(response.data.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    const Logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("tipo");
        navigate("/");
    }
    const handleDelete = (actividad_id, persona_id) => {
        Swal.fire({
            title: 'Está seguro?',
            text: "No podrás revertir esto.!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminalo!'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosInstance.post(`/eliminar`, { actividad_id: actividad_id, persona_id: persona_id })
                    .then(function (response) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Asistencia eliminada exitosamente!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        fetchProjectList()
                    })
                    .catch(function (error) {
                        Swal.fire({
                            icon: 'error',
                            title: `${error}`,
                            showConfirmButton: false,
                            timer: 1500
                        })
                    });
            }
        })
    }

    return (
        <NavSidebar>
            <Layout>
                <div className="container">
                    <h3 className="text-start mt-5 mb-3">Asistencia {nombre}</h3>

                    <div className="card">
                        <div className="card-header">
                            <p><strong>Fecha de Actividad:</strong> {getAsistencia.fecha}</p>
                            <p><strong>Hora de Actividad:</strong> {getAsistencia.horainicio}</p>
                            <div style={{ marginBottom: '20px' }}></div>
                            <Link
                                className="btn btn-outline-info float-right"
                                to={`/actividad/list`}>Volver
                            </Link>
                            <Link className="btn btn-outline-success mx-1"
                                to={`/asistencia/create/${id}/${nombre}`}>
                                Registrar Asistencia
                            </Link>
                            <button onClick={() => Logout()} className="btn btn-outline-danger float-end"> Logout </button>
                        </div>
                        <div className="card-body">

                            <table className="table table-bordered table-striped" id="tabla-asistencia">
                                <thead>
                                    <tr>
                                        <th>CI</th>
                                        <th>Miembro</th>
                                        <th>Hora de llegada</th>
                                        <th>Actualización</th>
                                        <th width="240px">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {asistenciaList.map((asistencia, key) => {
                                        return (
                                            <tr key={key}>
                                                <td>{asistencia.id}</td>
                                                <td>{asistencia.nombre} {asistencia.apellido}</td>
                                                <td>{asistencia.pivot['horallegada']}</td>
                                                <td>{(new Date(asistencia.pivot['updated_at'])).toLocaleDateString("es-ES", { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                                <td>
                                                    <button
                                                        onClick={() => handleDelete(asistencia.pivot['actividad_id'], asistencia.pivot['persona_id'])}
                                                        className="btn btn-outline-danger mx-1">
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Layout>
        </NavSidebar>

    );
}

export default ProjectEdit;