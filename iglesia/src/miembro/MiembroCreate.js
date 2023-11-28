import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
import axios from 'axios'
import Layout from "../components/Layout"
import {urlPhpMicroservicio} from './../helpers/Url';


function ProjectCreate() {
    const [ci, setCi] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [celular, setCelular] = useState('');
    const [correo, setCorreo] = useState('');
    const [direccion, setDireccion] = useState('');
    const [sexo, setSexo] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [fechaRegistroMiembro, setfechaRegistroMiembro] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token') == null) {
            navigate("/");
        }
    }, [])

    const axiosInstance = axios.create({
        baseURL: `${urlPhpMicroservicio}miembro/`,
    });

    const handleSave = () => {
        setIsSaving(true);
        axiosInstance.post('/registrar', {
            nombre: nombre,
            apellido: apellido,
            ci: ci,
            celular: celular,
            direccion: direccion,
            sexo: sexo,
            correo: correo,
            fecha_nacimiento: fechaNacimiento,
            fecha_registro_miembro: fechaRegistroMiembro
        })
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Project saved successfully!',
                    showConfirmButton: false,
                    timer: 1500
                })
                setIsSaving(false);
                setNombre('')
                setApellido('')
                setDireccion('')
                setfechaRegistroMiembro('')
                setFechaNacimiento('')
                setCelular('')
                setCi('')
                setCorreo('')
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
                <h2 className="text-start mt-5 mb-3">Crear nuevo miembro</h2>
                <div className="card">
                    <div className="card-header">
                        <Link
                            className="btn btn-outline-info float-right"
                            to="/dashboard">Volver
                        </Link>
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="ci">Carnet de identidad</label>
                                <input
                                    onChange={(event) => { setCi(event.target.value) }}
                                    value={ci}
                                    type="text"
                                    className="form-control"
                                    id="ci"
                                    name="ci" />
                            </div>
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
                                <label htmlFor="apellido">Apellido</label>
                                <textarea
                                    value={apellido}
                                    onChange={(event) => { setApellido(event.target.value) }}
                                    className="form-control"
                                    id="apellido"
                                    rows="1"
                                    name="apellido"></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="correo">Correo</label>
                                <textarea
                                    value={correo}
                                    onChange={(event) => { setCorreo(event.target.value) }}
                                    className="form-control"
                                    id="correo"
                                    rows="1"
                                    name="correo"></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="celular">Celular</label>
                                <input
                                    onChange={(event) => { setCelular(event.target.value) }}
                                    value={celular}
                                    type="text"
                                    className="form-control"
                                    id="celular"
                                    name="celular" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="direccion">Direccion</label>
                                <input
                                    onChange={(event) => { setDireccion(event.target.value) }}
                                    value={direccion}
                                    type="text"
                                    className="form-control"
                                    id="direccion"
                                    name="direccion" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="sexo">Sexo</label>
                                <select
                                    onChange={(event) => { setSexo(event.target.value) }}
                                    value={sexo}
                                    type="text"
                                    className="form-control"
                                    id="sexo"
                                    name="sexo" >
                                        <option value="M">Masculino</option>
                                        <option value="F">Femenino</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="fecha_nacimiento">Fecha de nacimiento</label>
                                <input
                                    onChange={(event) => { setFechaNacimiento(event.target.value) }}
                                    value={fechaNacimiento}
                                    type="date"
                                    className="form-control"
                                    id="fecha_nacimiento"
                                    name="fecha_nacimiento" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="fecha_registro_miembro">Fecha registro miembro</label>
                                <input
                                    onChange={(event) => { setfechaRegistroMiembro(event.target.value) }}
                                    value={fechaRegistroMiembro}
                                    type="date"
                                    className="form-control"
                                    id="fecha_registro_miembro"
                                    name="fecha_registro_miembro" />
                            </div>
                            <button
                                disabled={isSaving}
                                onClick={handleSave}
                                type="button"
                                className="btn btn-outline-primary mt-3">
                                Guardar miembro
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default ProjectCreate;