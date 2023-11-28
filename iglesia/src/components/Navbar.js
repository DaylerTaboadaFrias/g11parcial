import React from 'react'
export default function Navbar() {
  const renderizarContenido = () => {
    let contenido = null;
    if(localStorage.getItem('tipo') == null){
      return <></>;
    }
    else if (localStorage.getItem('tipo') == 'Administrador') {
      return(
        <>
          <li className="nav-item">
            <a className="nav-link text-color-default" aria-current="page" href="/bi">Dashboard</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-color-default" aria-current="page" href="/sermon">G.Sermon</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-color-default" aria-current="page" href="/dashboard">Gestionar miembro</a>
          </li>
          {/* <li className="nav-item">
            <a className="nav-link text-color-default" href="#">Gestionar visitante</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-color-default" href="#">Gestionar ministerio</a>
          </li> */}
          <li className="nav-item">
            <a className="nav-link text-color-default" href="/actividad/list">Gestionar Actividad</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-color-default" href="/ingreso/list">Gestionar Ingreso</a>
          </li>
          </>
          );
        
    }else if (localStorage.getItem('tipo') == 'Miembro'){
      return(<li className="nav-item">
      <a className="nav-link text-color-default" aria-current="page" href="/sermonMiembro">Sermones</a>
    </li>);
    }
    return null;
  };
  
  return (
    <nav className="navbar-default navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
      <a className="navbar-brand text-color-default" href="/dashboard">
          <img src="/logo_church.png" alt="Logo" style={{width: '50px'}} /> {/* Añade tu logo aquí */}
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
          {renderizarContenido()}
          {/* <li className="nav-item">
            <a className="nav-link text-color-default" aria-disabled="true">Disabled</a>
          </li> */}
        </ul>
      </div>
    </div>
  </nav>
  )
}
