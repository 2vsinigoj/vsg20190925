import React, { Component } from 'react';
import PubSub from 'pubsub-js';

import {
    Table,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Alert
} from 'reactstrap';
import { combineLatest } from 'rxjs';

class FormLibros extends Component {

    state = {
        modelo: {
            idlibro: 0,
            titulo: '',
            autor: '',
            edicion: 0,
            numcopias: 0
        }
    }

    setValues = (e, field) => {
        const { modelo } = this.state;
        modelo[field] = e.target.value;
        this.setState({ modelo });
    }

    create = () => {
        this.setState({ modelo: { idlibro: 0, titulo: '', autor: '', edicion: 0, numcopias: 0 } });
        this.props.libroCrear(this.state.modelo)
    }

    componentWillMount() {
        PubSub.subscribe('edit-libro', (topic, libro) => {
            this.setState({ modelo: libro });
        });
    }

    render() {
        return (
            <Form>
                <FormGroup>
                    <Input id="idlibro" type="hidden" value={this.state.modelo.idlibro}
                    /><br />
                    <Label for="titulo">Titulo:</Label>
                    <Input required
                        id="titulo"
                        type="text"
                        value={this.state.modelo.titulo}
                        onChange={e => this.setValues(e, 'titulo')}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="autor">Autor:</Label>
                    <Input required
                        id="autor"
                        type="text"
                        value={this.state.modelo.autor}
                        onChange={e => this.setValues(e, 'autor')}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="edicion">Edición:</Label>
                    <Input required
                        id="edicion"
                        type="number"
                        min="1980"
                        value={this.state.modelo.edicion}
                        onChange={e => this.setValues(e, 'edicion')}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="numcopias">Num.Copias:</Label>
                    <Input required
                        id="numcopias"
                        type="number"
                        min="1"
                        value={this.state.modelo.numcopias}
                        onChange={e => this.setValues(e, 'numcopias')}
                    />
                </FormGroup>

                <Button type="submit" color="info" block onClick={this.create}> Grabar </Button>
            </Form>
        );
    }
}
class ListarLibros extends Component {

    delete = (id) => {
        this.props.deleteLibro(id);
    }

    onEditar = (libro) => {
        PubSub.publish('edit-libro', libro);
    }
    render() {
        return (
            <Table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>IdLibro</th>
                        <th>Titulo</th>
                        <th>Autor</th>
                        <th>Edición</th>
                        <th>Num.Copias</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.datos.map((item, i) => {
                            return (
                                <tr key={item.idlibro}>
                                    <td>{i + 1}</td>
                                    <td>{item.titulo}</td>
                                    <td>{item.autor}</td>
                                    <td>{item.edicion}</td>
                                    <td>{item.numcopias}</td>
                                    <td className="text-center">
                                        <Button color="success" size="sm" onClick={e => this.onEditar(item)}>PUT</Button>
                                        &nbsp;&nbsp;&nbsp;
                                        <Button color="danger" size="sm" onClick={e => this.delete(item.idlibro)}>DELETE</Button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
        )
    }
}

export default class MasterLibros extends Component {

    Url = 'http://localhost:8089/libros';
    state = { libros: [], message: { texto: '', alerta: '' } }

    Mostrarlibros() {
        fetch(this.Url)
            .then((response) => {
                return response.json()
            })
            .then((librosjson) => {
                this.setState({ libros: librosjson })
            })
    }

    componentDidMount() {
        this.Mostrarlibros();
    }

    save = (libro) => {
        let data = {
            idlibro: parseInt(libro.idlibro),
            titulo: libro.titulo,
            autor: libro.autor,
            edicion: parseInt(libro.edicion),
            numcopias: parseInt(libro.numcopias),
        };
        console.log(data);

        const requestInfo = {
            method: data.idlibro !== 0 ? 'PUT' : 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }

        if (data.titulo !== '') {
            if (data.idlibro === 0) {
                // post
                fetch(this.Url, requestInfo)
                    .then(response => response.json())
                    .then(newLibro => {
                        let { libros } = this.state;
                        libros.push(newLibro);
                        this.setState({ libros, message: { texto: 'Libro creado!', alerta: 'info' } });
                        this.timerMessage(3000);
                        this.Mostrarlibros();
                    })

            } else {
                // put
                fetch(this.Url + '/' + data.idlibro, requestInfo)
                    .then(response => response.json())
                    .then(updLibro => {
                        let { libros } = this.state;
                        let posicion = libros.findIndex(libro => libro.idlibro === data.idlibro);
                        libros[posicion] = updLibro;
                        this.setState({ libros, message: { texto: 'Libro actualizado!', alerta: 'success' } });
                        this.timerMessage(3000);
                        this.Mostrarlibros();
                    })

            }
        } else {
            let { libros } = this.state;
            this.setState({ libros, message: { texto: 'Debe llenar los datos!', alerta: 'dark' } });
            this.timerMessage(3000);
        }
    }

    delete = (id) => {
        fetch(this.Url + '/' + id, { method: 'DELETE' })
            .then(response => response.json())
            .then(rows => {
                const libros = this.state.libros.filter(libro => libro.idlibro !== id);
                this.setState({ libros, message: { texto: 'Libro eliminado', alerta: 'danger' } });
                this.timerMessage(3000);
                this.Mostrarlibros();
            })
    }

    timerMessage = (tiempo) => {
        setTimeout(() => {
            this.setState({ message: { texto: '', alerta: '' } });
        }, tiempo);
    }

    render() {
        return (
            <div>
                {
                    this.state.texto !== '' ? (
                        <Alert
                            color={this.state.message.alerta}
                            className="capaAlert text-center">
                            {this.state.message.texto}
                        </Alert>
                    ) : ''
                }


                <div className="row">
                    <div className="col-md-3">
                        <h2>Formulario</h2>
                        <FormLibros libroCrear={this.save} />
                    </div>
                    <div className="col-md-9">
                        <h2>Tabla libros</h2>
                        <ListarLibros datos={this.state.libros} deleteLibro={this.delete} />
                    </div>
                </div>

            </div>
        );
    }
}
