import React from "react";
import { useNavigate } from "react-router-dom";
import "./error-page.css";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className='error-page'>
      <p className='error-title'>Oops! Aconteceu um erro {">~<"}</p>
      <p className='error-subtitle'>
        Não se preocupe, já estamos trabalhando nisso.
        <p /> Por hora, retorne a tela inicial e se puder,
        <p /> nos dê o feedback sobre esse erro!
      </p>
      <p className='home-link' onClick={() => navigate("/")}>
        Página Inicial
      </p>
      <p
        className='home-link'
        onClick={() => {
          window.location.href = "mailto:lucaspozzif20@gmail.com";
        }}
      >
        Relatar Erro
      </p>
    </div>
  );
};

export default ErrorPage;
