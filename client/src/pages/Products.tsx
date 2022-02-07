import React, { useState } from 'react';
import { CardGroup, Container, Dropdown, Form, Grid, Header } from 'semantic-ui-react';
import ProductItem from '../components/ProductItem';
import { Product, ProductCategory } from '../model';

interface Props {
    products: Product[],
    categories: ProductCategory[],
    addOrder: (product: Product, ammount?: number) => void
}


export default function Products(props: Props) {



    const [sort, setSort] = useState(1);
    const [categoryId, setCategoryId] = useState(0);
    const totalMinPrice = (props.products.length === 0) ? 0 : props.products.reduce((min, element) => {
        return Math.min(min, element.price)
    }, props.products[0].price)
    const totalMaxPrice = (props.products.length === 0) ? 0 : props.products.reduce((max, element) => {
        return Math.max(max, element.price)
    }, props.products[0].price)
    const [minPrice, setMinPrice] = useState(totalMinPrice);
    const [maxPrice, setMaxPrice] = useState(totalMaxPrice);
    const [name, setName] = useState('')


    return (
        <Container >
            <Grid padded columns='16' >
                <Grid.Row centered>
                    <Grid.Column style={{ background: 'pink', padding: '4%', borderRadius: '10px'}} width='4' >
                        <Header>Sortiraj proizvode</Header>
                        <Dropdown selection value={sort} options={[{
                            key: 1,
                            value: 1,
                            text: 'Po rastucoj ceni',
                            onClick: () => { setSort(1) }
                        }, {
                            key: 2,
                            value: -1,
                            text: 'Po opadajucoj ceni',
                            onClick: () => { setSort(-1) }
                        }]} />
                        <Form style={{ marginTop: '20px' }} >
                            <Header>Pretrazi proizvode</Header>
                            <Form.Input value={name} onChange={e => {
                                const value = e.currentTarget.value;
                                setName(value);
                            }} fluid label='Naziv' />
                            <Form.Dropdown value={categoryId} clearable onChange={(e, data) => {
                                setCategoryId((data.value || 0) as number);
                            }} selection label='Kategorija' options={props.categories.map(element => {
                                return {
                                    key: element.id,
                                    value: element.id,
                                    text: element.name,

                                }
                            })} />
                            <Form.Field>

                                <Form.Input onChange={(e) => {
                                    const value = Number(e.currentTarget.value);
                                    if (value < maxPrice) {
                                        setMinPrice(value);
                                    }
                                }} value={minPrice} inline type='range' label='Najmanja cena' min={totalMinPrice} max={totalMaxPrice} />
                                {minPrice}
                            </Form.Field>
                            <Form.Field>

                                <Form.Input onChange={(e) => {
                                    const value = Number(e.currentTarget.value);
                                    if (value > minPrice) {
                                        setMaxPrice(value);
                                    }
                                }} value={maxPrice} inline type='range' label='Najveca cena' min={totalMinPrice} max={totalMaxPrice} />
                                {maxPrice}
                            </Form.Field>
                        </Form>
                    </Grid.Column>
                    <Grid.Column width='12'>
                        <CardGroup itemsPerRow='3' >
                            {
                                props.products.filter(element => {
                                    return element.name.includes(name) && (categoryId === 0 || element.productCategory.id === categoryId) && element.price >= minPrice && element.price <= maxPrice
                                }).sort((a, b) => {
                                    return sort * (a.price - b.price)
                                }).map(element => {
                                    return (
                                        <ProductItem key={element.id} product={element} addOrder={() => {
                                            props.addOrder(element, 1);
                                        }} />
                                    )
                                })
                            }
                        </CardGroup>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    )
}
