import Link from "next/link"
import React, { useState } from "react"
import { Modal, Form, Button, Alert } from "react-bootstrap"
import { useLoginMutation } from "../generated/graphql"
import { IFormModal } from "../interfaces"


const LoginModal: React.FC<IFormModal> = ({ isVisible, handleClose }) => {

    const [_, login] = useLoginMutation()
    const [username, setUsername] = useState<string | null>("")
    const [password, setPassword] = useState<string | null>("")
    const [errorMessage, setErrorMessage] = useState<string | null>("")
    const handleUsernameChange = (e: any) => setUsername(e.target.value)
    const handlePasswordChange = (e: any) => setPassword(e.target.value)



    const handleSubmit = async (e: any) => {
        e.preventDefault()
        if (username && password) {
            try {
                const response = await login({ options: { username, password } })
                const data = response.data?.login
                console.log(data)
                if (data?.user) {
                    //clear the input feilds
                    setUsername("")
                    setPassword("")
                    //clear the errors
                    setErrorMessage("")
                    //close the modal
                    handleClose()
                } else {
                    //if registeration fails show error
                    setErrorMessage(data!.message!.message)
                }

            } catch (error) {
                console.log(error)
            }
        }
    }


    return (
        <Modal show={isVisible} onHide={handleClose} >
            <Modal.Header closeButton className="bg-light-black text-light">
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-light-black text-light">
                {errorMessage ? <Alert variant="danger">{errorMessage}</Alert> : null}
                <Form className="w-100" onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text"
                            className="bg-black"
                            placeholder="Enter username"
                            value={username!}
                            onChange={handleUsernameChange}
                            required />

                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control className="bg-black" type="password" placeholder="Password" value={password!} onChange={handlePasswordChange} required />
                        <Form.Text as={Link} href="/forgot-password">
                            Forgot Passoword?
                    </Form.Text>
                    </Form.Group>
                    <Button block variant="danger" type="submit">
                        Login
                </Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default LoginModal
