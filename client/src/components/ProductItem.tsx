import React from 'react'
//import { RouteComponentProps, withRouter } from 'react-router'
import { Button, Card, Image } from 'semantic-ui-react'
import { Product } from '../model'
import {useParams} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

interface Props {
    product: Product,
    addOrder: () => void
}
export default (function ProductItem(props: Props) {
    const params = useParams();
    let navigate = useNavigate();
    return (
        <Card centered link >
            <Image className='short' onClick={() => {
                navigate('/products/' + props.product.id)
            }} src={`data:image/jpeg;base64,${props.product.picture}`} wrapped ui={false} />
            <Card.Content onClick={() => {
                navigate('/products/' + props.product.id)
            }} >
                <Card.Header>{props.product.name}</Card.Header>
                <Card.Description >{props.product.price}RSD</Card.Description >
            </Card.Content>
            <Card.Content extra>
                <Button  floated='right' fluid color='black' onClick={() => {
                    props.addOrder();
                }}><p>Dodaj u korpu</p></Button>

            </Card.Content>
        </Card>
    )
})
