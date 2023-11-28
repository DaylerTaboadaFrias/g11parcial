import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom"
import Swal from 'sweetalert2'
import axios from 'axios'
import Layout from "../../components/Layout"
import { urlPhpMicroservicio } from '../../helpers/Url';

function ProjectList() {
    const { id, nombre } = useParams();
    const [actividad_id, setActividadId] = useState(id);
    const [horallegada, setHoraLlegada] = useState('');
    const [miembro_id, setMiembroId] = useState(1);

    const [miembroList, setMiembro] = useState([])

    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token') == null) {
            navigate("/");
        }
        fetchProjectList();
    }, [])

    const axiosInstance = axios.create({
        baseURL: `${urlPhpMicroservicio}asistencia/`,
    });

    const axiosInstanceIngreso = axios.create({
        baseURL: `${urlPhpMicroservicio}miembro/`,
    });

    const fetchProjectList = () => {
        axiosInstanceIngreso.get(`listar`)
            .then(function (response) {
                setMiembro(response.data.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    const handleSave = () => {
        setIsSaving(true);
        console.log("El valor de ingreso_id es: ",miembro_id);
        axiosInstance.post('registrar', {
            "actividad_id": actividad_id,
            "persona_id": parseInt(miembro_id),
            "horallegada": horallegada
        })
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Asistencia registrada exitosamente',
                    showConfirmButton: false,
                    timer: 1500
                })
                setIsSaving(false);
                setMiembroId('');
                setHoraLlegada('');
            })
            .catch(function (error) {
                console.log("error: ", error);
                Swal.fire({
                    icon: 'error',
                    title: "Error: "+error.response.data['message'],
                    showConfirmButton: false,
                    timer: 1500
                })
                setIsSaving(false)
            });
    }

    return (
        <Layout>
            <div className="container">
                <h2 className="text-start mt-5 mb-3">Registrar Asistencia {nombre}</h2>
                <div className="card">
                    <div className="card-header">
                        <Link
                            className="btn btn-outline-info float-right"
                            to={`/actividad/asistencia/${actividad_id}/${nombre}`}>Volver
                        </Link>
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="horallegada">Hora de llegada</label>
                                <input
                                    onChange={(event) => { setHoraLlegada(event.target.value) }}
                                    value={horallegada}
                                    type="time"
                                    className="form-control"
                                    id="horallegada"
                                    name="horallegada" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="miembro">Miembro</label>
                                <select
                                    onChange={(event) => { setMiembroId(event.target.value) }}
                                    value={miembro_id}
                                    type="number"
                                    className="form-control"
                                    id="miembro_id"
                                    name="miembro_id" >
                                    {miembroList.map((miembro, key) => {
                                        return (
                                            <option key={key} value={miembro.id}>{miembro.nombre} {miembro.apellido}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <button
                                disabled={isSaving}
                                onClick={handleSave}
                                type="button"
                                className="btn btn-outline-primary mt-3">
                                Registrar Asistencia
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
export default ProjectList;