import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom"
import Swal from 'sweetalert2'
import axios from 'axios'
import Layout from "../../components/Layout"
import { urlPhpMicroservicio } from '../../helpers/Url';

function ProjectList() {
    const { id, nombre } = useParams();
    const [actividad_id, setActividadId] = useState(id);
    const [monto, setMonto] = useState('');
    const [ingreso_id, setIngresoId] = useState(1);

    const [ingresoList, setIngreso] = useState([])

    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token') == null) {
            navigate("/");
        }
        fetchProjectList();
    }, [])

    const axiosInstance = axios.create({
        baseURL: `${urlPhpMicroservicio}recaudacion/`,
    });

    const axiosInstanceIngreso = axios.create({
        baseURL: `${urlPhpMicroservicio}ingreso/`,
    });

    const fetchProjectList = () => {
        axiosInstanceIngreso.get(`listar`)
            .then(function (response) {
                setIngreso(response.data.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    const handleSave = () => {
        setIsSaving(true);
        console.log("El valor de ingreso_id es: ",ingreso_id);
        axiosInstance.post('registrar', {
            "actividad_id": actividad_id,
            "ingreso_id": parseInt(ingreso_id),
            "monto": monto
        })
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Recaudación registrada exitosamente',
                    showConfirmButton: false,
                    timer: 1500
                })
                setIsSaving(false);
                setIngresoId('');
                setMonto(0);
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
                <h2 className="text-start mt-5 mb-3">Registrar Recaudación {nombre}</h2>
                <div className="card">
                    <div className="card-header">
                        <Link
                            className="btn btn-outline-info float-right"
                            to={`/actividad/recaudacion/${actividad_id}/${nombre}`}>Volver
                        </Link>
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="monto">Monto</label>
                                <input
                                    onChange={(event) => { setMonto(event.target.value) }}
                                    value={monto}
                                    type="number"
                                    className="form-control"
                                    id="monto"
                                    name="monto" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="ingreso">Ingreso</label>
                                <select
                                    onChange={(event) => { setIngresoId(event.target.value) }}
                                    value={ingreso_id}
                                    type="number"
                                    className="form-control"
                                    id="ingreso_id"
                                    name="ingreso_id" >
                                    {ingresoList.map((ingreso, key) => {
                                        return (
                                            <option key={key} value={ingreso.id}>{ingreso.nombre}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <button
                                disabled={isSaving}
                                onClick={handleSave}
                                type="button"
                                className="btn btn-outline-primary mt-3">
                                Registrar Recaudación
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
export default ProjectList;