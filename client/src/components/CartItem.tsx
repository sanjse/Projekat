import React from 'react'
import { Grid, Segment, Table } from 'semantic-ui-react'
import { Cart } from '../model'
import Property from './Property'

interface Props {
    cart: Cart
}

export default function CartItem(props: Props) {
    return (
        <Segment  >
            <Grid >
                <Property name='Korisnik' value={props.cart.user.firstName + ' ' + props.cart.user.lastName} />
                <Property name='Adresa' value={props.cart.adress} />
                <Property name='Broj telefona' value={props.cart.phone} />
                <Property name='Ukupan iznos' value={props.cart.items.reduce((prev, curr) => { return prev + curr.product.price * curr.ammount }, 0)} />
                <Grid.Row centered textAlign='center'>
                    <h3>Poruceni proizvodi</h3>
                </Grid.Row>
                <Grid.Row>
                    <Table>
                        <Table.Header>
                            <Table.Row >
                                <Table.HeaderCell>Naziv proizvoda</Table.HeaderCell>
                                <Table.HeaderCell>Kolicina</Table.HeaderCell>
                                <Table.HeaderCell>Ukupno</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body className='tabela'>
                            {props.cart.items.map(element => {
                                return (
                                    <Table.Row key={element.product.id}>
                                        <Table.Cell>{element.product.name}</Table.Cell>
                                        <Table.Cell>{element.ammount}</Table.Cell>
                                        <Table.Cell>{element.product.price * element.ammount}</Table.Cell>
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                    </Table>
                </Grid.Row>
            </Grid>
        </Segment>
    )
}
