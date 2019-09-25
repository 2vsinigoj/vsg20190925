import React, { Component } from 'react';

class FormLibros extends Component {
    constructor(props) {
        super(props);
        this.state = {
            libro: {}
        }
        this.sendForm = this.sendForm.bind(this);
    }

    sendForm(ev) {
        ev.preventDefault();

        fetch('http://localhost:8089/libros/',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state.libro)
            }
        );
    }

    render() {
        return (
            <form className="card-body" onSubmit={this.sendForm}>
            <input type="hidden" name="idlibro" value="0" />
                <p>
                    <label>Título</label>
                    <input
                        type="text"
                        name="titulo"
                        className="form-control"
                        onChange={ (ev) => { this.setState({libro: { ...this.state.libro, titulo: ev.target.value } }) }} 
                    />
                </p>
                <p>
                    <label>Autor</label>
                    <input
                        type="text"
                        name="autor"
                        className="form-control"
                        onChange={ (ev) => { this.setState({libro: { ...this.state.libro, autor: ev.target.value } }) }} 
                    />
                </p>
                <p>
                    <label>Edición</label>
                    <input
                        type="text"
                        name="edicion"
                        className="form-control"
                        onChange={ (ev) => { this.setState({libro: { ...this.state.libro, edicion: ev.target.value } }) }} 
                    />
                </p>
                <p>
                    <label>Num.Copias</label>
                    <input
                        type="text"
                        name="numcopias"
                        className="form-control"
                        onChange={ (ev) => { this.setState({libro: { ...this.state.libro, numcopias: ev.target.value } }) }} 
                    />
                </p>
                <p>
                    <input
                        className="btn btn-info"
                        type="submit"
                        value="POST" />
                </p>
            </form>
        )
    }
}
export default FormLibros;
