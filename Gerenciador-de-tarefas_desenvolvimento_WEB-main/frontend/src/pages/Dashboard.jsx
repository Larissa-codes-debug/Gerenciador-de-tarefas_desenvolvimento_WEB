import React, {useState} from 'react';
import {LayoutDashboard, CheckSquare, Users, BarChart2, Bell, User} from 'lucide-react';
import logoImg from '../assets/LOGO_GERENCIAMENTO.png';
import './Dashboard.css';

const dadosGerais = {
    total: 385,
    pendentes: 78,
    andamento:40,
    concluídas: 40,
    atrasadas:20
};

export default function Dashboard(){
    return(
        <div className="dashboard-container">
        {/* O menu lateral e o conteúdo principal vão entrar aqui! */}        
        
    


    <aside className="sidebar">
        <div className="sidebar-logo">
            <img src={logoImg} alt="taskflow logo"/>
            <h3>TaksFlow</h3>
        </div>

        <nav className="sidebar-menu">
            <button className="menu-item active">
                <LayoutDashboard size={20}/> Dashboard
            </button>
            <button className="menu-item">
                <CheckSquare size={20}/> Minhas tarefas
            </button>
        </nav>
    </aside>

    <main className="main-content">
        <header className="topbar">
            <div className="page-title">
                <h2>Dashboard</h2>
                <p>Visão geral das atividades e desempenho da equipe</p>
            </div>

            <div className="user-profile">
                <span className="user-name">NOME DO USUÁRIO</span>
                <div className="user-avatar">
                    <User size={24}/>
                </div>
            </div>
        </header>

        <div className="summary-cards">

            <div className="card">
                <span className="card-title">Total de Tarefas</span>
                <span className="card-value">{dadosGerais.total}</span>
            </div>

            <div className="card error">
                <span className="card-title">Total de Tarefas</span>
                <span className="card-value">{dadosGerais.atrasadas}</span>
            </div>
        </div>

    </main>
</div>
    );
}
