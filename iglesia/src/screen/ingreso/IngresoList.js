import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
import axios from 'axios'
import Layout from "../../components/Layout"
import NavSidebar from '../../components/NavSidebar'
import { urlPhpMicroservicio } from '../../helpers/Url';


function ProjectList() {

    const navigate = useNavigate();
    const [ingresoList, setIngreso] = useState([])

    useEffect(() => {
        if (localStorage.getItem('token') == null) {
            navigate("/");
        }
        fetchProjectList();

    }, [])



    const axiosInstance = axios.create({
        baseURL: `${urlPhpMicroservicio}ingreso/`,
    });


    const fetchProjectList = () => {
        axiosInstance.get('/listar')
            .then(function (response) {
                setIngreso(response.data.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosInstance.delete(`/eliminar/${id}`)
                    .then(function (response) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Ingreso deleted successfully!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        fetchProjectList()
                    })
                    .catch(function (error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'An Error Occured!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    });
            }
        })
    }

    const Logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("tipo");
        navigate("/");
    }
    return (
        <NavSidebar>
            <Layout>
                <div className="container">
                    <h2 className="text-center mt-5 mb-3">Gestionar Ingreso</h2>
                    <div className="card">
                        <div className="card-header">
                            <Link className="btn btn-outline-primary" to="/ingreso/create">Crear Ingreso </Link>
                            <button onClick={() => Logout()} className="btn btn-outline-danger float-end"> Logout </button>
                        </div>
                        <div className="card-body">

                            <table className="table table-bordered table-striped" id="tabla-actividad">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th width="240px">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ingresoList.map((ingreso, key) => {
                                        return (
                                            <tr key={key}>
                                                <td>{ingreso.nombre}</td>
                                                <td>
                                                    <Link
                                                        className="btn btn-outline-success mx-1"
                                                        to={`/ingreso/edit/${ingreso.id}`}>
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(ingreso.id)}
                                                        className="btn btn-outline-danger mx-1">
                                                        Delete
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
export default ProjectList;