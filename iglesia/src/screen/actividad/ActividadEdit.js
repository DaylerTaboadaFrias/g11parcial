import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
import axios from 'axios'
import Layout from "../../components/Layout"
import { urlPhpMicroservicio } from '../../helpers/Url';

function ProjectEdit() {
    const [id, setId] = useState(useParams().id)
    const [nombre, setNombre] = useState('');
    const [fecha, setFecha] = useState('');
    const [horainicio, setHoraInicio] = useState('');
    const [horafin, setHoraFin] = useState('');
    const [montototal, setMontoTotal] = useState('');

    const [isSaving, setIsSaving] = useState(false)
    const navigate = useNavigate();

    const axiosInstance = axios.create({
        baseURL: `${urlPhpMicroservicio}actividad/`,
    });

    useEffect(() => {
        if (localStorage.getItem('token') == null) {
            navigate("/");
        }

        axiosInstance.get(`/obtener/${id}`)
            .then(function (response) {
                let project = response.data.data
                setNombre(project.nombre);
                setFecha(project.fecha);
                setHoraInicio(project.horainicio);
                setHoraFin(project.horafin);
                setMontoTotal(project.montotoal);
               
            })
            .catch(function (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'An Error Occured!',
                    showConfirmButton: false,
                    timer: 1500
                })
            })

    }, [])


    const handleSave = () => {
        setIsSaving(true);
        axiosInstance.put(`/editar/${id}`, {
            nombre: nombre,
            fecha: fecha,
            horainicio: horainicio,
            horafin: horafin,
            montototal: montototal,
        })
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Actividad updated successfully!',
                    showConfirmButton: false,
                    timer: 1500
                })
                setIsSaving(false);
            })
            .catch(function (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'An Error Occured!',
                    showConfirmButton: false,
                    timer: 1500
                })
                setIsSaving(false)
            });
    }


    return (
        <Layout>
            <div className="container">
                <h2 className="text-start mt-5 mb-3">Editar actividad</h2>
                <div className="card">
                    <div className="card-header">
                        <Link
                            className="btn btn-outline-info float-right"
                            to="/actividad/list">Volver
                        </Link>
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre</label>
                                <input
                                    onChange={(event) => { setNombre(event.target.value) }}
                                    value={nombre}
                                    type="text"
                                    className="form-control"
                                    id="nombre"
                                    name="nombre" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="fecha">Fecha</label>
                                <input
                                    onChange={(event) => { setFecha(event.target.value) }}
                                    value={fecha}
                                    type="date"
                                    className="form-control"
                                    id="fecha"
                                    name="fecha" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="horainicio">Hora de inicio</label>
                                <input
                                    value={horainicio}
                                    onChange={(event) => { setHoraInicio(event.target.value) }}
                                    type="time"
                                    className="form-control"
                                    id="horainicio"
                                    name="horainicio"></input>
                            </div>
                            <div className="form-group">
                                <label htmlFor="horafin">Hora de finalización</label>
                                <input
                                    value={horafin}
                                    onChange={(event) => { setHoraFin(event.target.value) }}
                                    type="time"
                                    className="form-control"
                                    id="horafin"
                                    name="horafin"></input>
                            </div>
                            <button
                                disabled={isSaving}
                                onClick={handleSave}
                                type="button"
                                className="btn btn-outline-success mt-3">
                                Actualizar Actividad
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default ProjectEdit;