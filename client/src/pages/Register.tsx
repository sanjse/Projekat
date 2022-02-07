import React, { useState } from 'react'
import { Container, Form } from 'semantic-ui-react'
import axios from 'axios'

import { SERVER_URL } from '../constants';
import { User } from '../model';


axios.defaults.withCredentials = true;
interface Props {
    setUser: (user: User) => void
}

export default function Register(props: Props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setlLastname] = useState('');
    const [passError, setPassError] = useState('')
    const onSubmit = async () => {
        if (password !== confirmPassword) {
            setPassError('Lozinke se ne podudaraju');
            return;
        }
        setPassError('');
        try {
            const result = await axios.post(SERVER_URL + '/register', {
                username: username,
                password: password,
                firstName: firstname,
                lastName: lastname
            })
            props.setUser(result.data);
        } catch (error) {
            console.log('ovde baca exeption');
        }
    }
    return (
        <Container className='register'>
            <Form onSubmit={onSubmit} size='big' className='reg'>
                <Form.Input placeholder='Unesite ime:' value={firstname} onChange={(e) => {
                    const value = e.currentTarget.value;
                    setFirstname(value);
                }} required label='Ime:' />
                <Form.Input placeholder='Unesite prezime:' value={lastname} onChange={(e) => {
                    const value = e.currentTarget.value;
                    setlLastname(value);
                }} required label='Prezime:' />
                <Form.Input placeholder='Unesite korisničko ime:' value={username} onChange={(e) => {
                    const value = e.currentTarget.value;
                    setUsername(value);
                }} required label='Korisničko ime:' />
                <Form.Input placeholder='Unesite lozniku:' type='password' value={password} onChange={(e) => {
                    const value = e.currentTarget.value;
                    setPassword(value);
                }} required label='Lozinka:' />
                <Form.Input type='password' placeholder='Ponovite lozinku:' value={confirmPassword} onChange={(e) => {
                    const value = e.currentTarget.value;
                    setConfirmPassword(value);
                }} required error={passError || undefined} label='Ponovi lozinku' />
                <br />
                <Form.Button fluid color='pink'>REGISTRACIJA</Form.Button>
            </Form>
        </Container>
    )
}
