import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import { Button, Container, Form, Grid, Ref, Table } from 'semantic-ui-react';
import { Cart, Product, ProductCategory } from '../model';
axios.defaults.withCredentials = true;
interface Props {
    products: Product[],
    categories: ProductCategory[],
    updateProduct: (id: number, name: string, price: number, category: number, description: string) => Promise<any>
    createProduct: (formData: FormData) => Promise<any>,
    deleteProduct: (id: number) => Promise<any>,
    carts: Cart[]
}

export default function Admin(props: Props) {
    const [selectedProductIndex, setselectedProductIndex] = useState(-1);
    const fileRef = useRef<HTMLDivElement>(null);
    const [price, setPrice] = useState(0);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategoryID, setSelectedCategoryID] = useState(props.categories[0].id);



    useEffect(() => {

        if (selectedProductIndex === -1) {
            setPrice(0);
            setName('');
            setDescription('');
            setSelectedCategoryID(0);
        } else {
            const product = props.products[selectedProductIndex];
            setPrice(product.price);
            setName(product.name);
            setDescription(product.description);
            setSelectedCategoryID(product.productCategory.id);
        }
    }, [selectedProductIndex, props.products])
    return (
        <Container>
            <Grid padded>
                <Grid.Row columns='16'>
                    <Grid.Column width='9'>
                        <Table padded selectable>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>ID</Table.HeaderCell>
                                    <Table.HeaderCell>Naziv</Table.HeaderCell>
                                    <Table.HeaderCell>Kategorija</Table.HeaderCell>
                                    <Table.HeaderCell>Cena</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {
                                    props.products.map((element, index) => {
                                        return (
                                            <Table.Row key={element.id} active={index === selectedProductIndex} onClick={() => {
                                                setselectedProductIndex(prev => {
                                                    return prev === index ? -1 : index;
                                                })
                                            }}>
                                                <Table.Cell>{element.id}</Table.Cell>
                                                <Table.Cell>{element.name}</Table.Cell>
                                                <Table.Cell>{element.productCategory.name}</Table.Cell>
                                                <Table.Cell>{element.price}</Table.Cell>
                                            </Table.Row>
                                        )
                                    })
                                }
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                    <Grid.Column width='7'>
                        <h3>
                            {selectedProductIndex === -1 ? 'Kreiraj novi proizvod' : 'Izmeni proizvod'}
                        </h3>
                        <Form encType="multipart/form-data" onSubmit={async e => {
                            if (selectedProductIndex > -1) {
                                await props.updateProduct(props.products[selectedProductIndex].id, name, price, selectedCategoryID, description);
                                setselectedProductIndex(-1);
                                return;
                            }
                            const data = new FormData();
                            const inputElement = fileRef.current?.lastChild?.lastChild as HTMLInputElement;

                            if (!inputElement.files) {
                                return;
                            }

                            data.append('file', inputElement.files[0]);
                            data.append('name', name);
                            data.append('price', price + '');
                            data.append('description', description);
                            data.append('productCategory', selectedCategoryID + '');
                            props.createProduct(data);
                        }} >
                            <Form.Input value={name} onChange={(e) => {
                                const value = e.currentTarget.value;
                                setName(value);
                            }} label='Naziv' />
                            <Form.Input value={price} onChange={(e) => {
                                const value = e.currentTarget.value;
                                setPrice(parseFloat(value));
                            }} label='Cena' type='number' />
                            <Form.Dropdown label='Kategorija' value={selectedCategoryID} selection options={props.categories.map(element => {
                                return {
                                    text: element.name,
                                    value: element.id,
                                    key: element.id,
                                    onClick: () => {
                                        setSelectedCategoryID(element.id)
                                    }
                                }
                            })} />
                            {selectedProductIndex === -1 && (
                                <Ref innerRef={fileRef}>
                                    <Form.Input required inverted type='file' label='Slika' />

                                </Ref>
                            )}
                            <Form.TextArea value={description} onChange={e => {
                                const value = e.currentTarget.value;
                                setDescription(value);
                            }} label='Opis' />
                            <Form.Button fluid color='pink'>Sačuvaj</Form.Button>
                        </Form>
                        {
                            selectedProductIndex > -1 && (
                                <Button fluid negative onClick={() => {
                                    const id = props.products[selectedProductIndex].id;
                                    props.deleteProduct(id).then(() => {
                                        setselectedProductIndex(-1);
                                    })
                                }}>Obriši</Button>
                            )
                        }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row centered>
                    <h3>Statistički podaci</h3>
                </Grid.Row>
                <Grid.Row className='whiteBackground'>
                    <BarChart

                        className='whiteBackground'

                        width={1200}
                        height={500}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 15,
                        }}

                        data={props.products.map(product => {
                            const res: any = {
                                name: product.name
                            }
                            let ammount = 0;
                            let totalPrice = 0;

                            for (let cart of props.carts) {
                                for (let item of cart.items) {
                                    totalPrice += item.ammount * item.product.price;
                                    if (item.product.id === product.id) {
                                        ammount += item.ammount;

                                    }
                                }
                            }
                            const total = ammount * product.price / totalPrice;
                            res.ammount = ammount;
                            res.total = total * 100;
                            return res;

                        })}
                    >
                        <CartesianGrid strokeDasharray="1 1" />
                        <XAxis dataKey="name" />

                        <YAxis />
                        <Tooltip />
                        <Legend />

                        <Bar name='Ukupan naručeni iznos' dataKey="ammount" fill="#9400D3" />
                        <Bar name='Prosečno ucešće u korpi' dataKey="total" fill="#C71585" />
                    </BarChart>
                </Grid.Row>
            </Grid>
        </Container>
    )
}

