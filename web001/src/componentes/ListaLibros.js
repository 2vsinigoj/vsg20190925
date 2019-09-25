import React, { Component } from 'react';

class ListaLibros extends Component {

    render() {
        return (
            <tbody>
                {
                    this.props.datos.map((item, i) => {
                        return (
                            <tr>
                                <td>{item.idlibro}</td>
                                <td>{item.titulo}</td>
                                <td>{item.autor}</td>
                                <td>{item.edicion}</td>
                                <td>{item.numcopias}</td>
                                <td></td>
                            </tr>
                        )
                    })
                }
            </tbody>
        )
    }
}
export default ListaLibros;