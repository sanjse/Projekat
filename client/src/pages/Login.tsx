import React, { useState } from 'react'
//import { RouteComponentProps, withRouter } from 'react-router'
import { Button, Container, Form } from 'semantic-ui-react'
import { User } from '../model'
import axios from 'axios';
import { SERVER_URL } from '../constants';
import { useNavigate, useParams } from 'react-router-dom';

axios.defaults.withCredentials = true;
interface Props {
    setUser: (user: User) => void
}

export default (function Login(props: Props) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const params = useParams();
    let navigate = useNavigate();
    const onSubmit = async () => {
        try {
            const result = await axios.post(SERVER_URL + '/login', { username: username, password: password });
            const user = result.data;
            props.setUser(user);
        } catch (error) {
            setError('Neuspesna prijava')
        }
    }
    return (
        <Container className='login' >
            <Form onSubmit={onSubmit} error size='big' className='logg' >
                <Form.Input required onChange={(e) => {
                    const value = e.currentTarget.value;
                    setUsername(value);
                }} value={username} label='Korisničko ime:' placeholder='Unesite korisničko ime:' />
                <Form.Input required onChange={(e) => {
                    const value = e.currentTarget.value;
                    setPassword(value);
                }} value={password} type='password' label='Šifra:' placeholder='Unesite šifru:' />
                <br />
                <Form.Button className='dugme' error={error || undefined} fluid color='pink'>PRIJAVI SE</Form.Button>
            </Form>
            <br /><br /><br /><br />
            <Button className='dugme' fluid color='pink' onClick={() => {
                navigate('/register')
            }}>Nemate nalog?</Button>
        </Container>
    )
})
