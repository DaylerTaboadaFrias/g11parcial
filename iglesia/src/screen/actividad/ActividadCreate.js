import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
import axios from 'axios'
import Layout from "../../components/Layout"
import { urlPhpMicroservicio } from '../../helpers/Url';

function ProjectList() {
    const [nombre, setNombre] = useState('');
    const [fecha, setFecha] = useState('');
    const [horainicio, setHoraInicio] = useState('');
    const [horafin, setHoraFin] = useState('');

    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token') == null) {
            navigate("/");
        }
    }, [])

    const axiosInstance = axios.create({
        baseURL: `${urlPhpMicroservicio}actividad/`,
    });

    const handleSave = () => {
        setIsSaving(true);
        axiosInstance.post('/registrar', {
            nombre: nombre,
            fecha: fecha,
            horainicio: horainicio,
            horafin: horafin,
            montototal: 0,
        })
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Actividad saved successfully!',
                    showConfirmButton: false,
                    timer: 1500
                })
                setIsSaving(false);
                setNombre('')
                setFecha('')
                setHoraInicio('')
                setHoraFin('')
            })
            .catch(function (error) {
                console.log("error: ",error);
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
                <h2 className="text-start mt-5 mb-3">Crear nueva actividad</h2>
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
                                className="btn btn-outline-primary mt-3">
                                Registrar Actividad
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
export default ProjectList;