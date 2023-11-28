import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
import axios from 'axios'
import Layout from "../../components/Layout"
import { urlPhpMicroservicio } from '../../helpers/Url';
import NavSidebar from '../../components/NavSidebar'

function ProjectEdit() {
    const { id, nombre } = useParams();
    const navigate = useNavigate();
    const [recaudacionList, setRecaudacion] = useState([])

    useEffect(() => {
        if (localStorage.getItem('token') == null) {
            navigate("/");
        }
        fetchProjectList();

    }, [])

    const axiosInstance = axios.create({
        baseURL: `${urlPhpMicroservicio}recaudacion/`,
    });

    const Logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("tipo");
        navigate("/");
    }
    const fetchProjectList = () => {
        axiosInstance.get(`actividad/${id}`)
            .then(function (response) {
                setRecaudacion(response.data.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    const handleDelete = (actividad_id, ingreso_id) => {
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
                axiosInstance.post(`/eliminar`, { actividad_id: actividad_id, ingreso_id: ingreso_id })
                    .then(function (response) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Recaudación eliminada exitosamente!',
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
                    <h3 className="text-start mt-5 mb-3">Recaudación {nombre}</h3>
                    <div className="card">
                        <div className="card-header">
                            <Link
                                className="btn btn-outline-info float-right"
                                to={`/actividad/list`}>Volver
                            </Link>
                            <Link className="btn btn-outline-success mx-1"
                                to={`/recaudacion/create/${id}/${nombre}`}>
                                Registrar recaudacion
                            </Link>

                            <button onClick={() => Logout()} className="btn btn-outline-danger float-end"> Logout </button>
                        </div>
                        <div className="card-body">

                            <table className="table table-bordered table-striped" id="tabla-recaudacion">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Ingreso</th>
                                        <th>Monto</th>
                                        <th>Actualización</th>
                                        <th width="240px">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recaudacionList.map((recaudacion, key) => {
                                        return (
                                            <tr key={key}>

                                                <td>{recaudacion.id}</td>
                                                <td>{recaudacion.nombre}</td>
                                                <td>{recaudacion.pivot['monto']}</td>
                                                <td>{(new Date(recaudacion.pivot['updated_at'])).toLocaleDateString("es-ES",{ day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                                <td>

                                                    <button
                                                        onClick={() => handleDelete(recaudacion.pivot['actividad_id'], recaudacion.pivot['ingreso_id'])}
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