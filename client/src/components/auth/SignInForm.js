import { Form, Button } from 'react-bootstrap'
import { Error } from '../error/Error'

export const SignInForm = ({ loginHandler, loading, refs: { email, password } }) => {
    return (
        <Form className='w-100'>
            <Form.Control
                type='email'
                placeholder='Please enter your email'
                size='sm'
                className='mb-3 input lato'
                ref={email} 
                required
            />
            <Form.Control 
                type='password' 
                placeholder='Please enter your password' 
                size='sm'
                className='input lato'  
                ref={password}
                required
            />
            <Error />
            <Button 
                onClick={loginHandler}
                type='submit'
                className='btn lato'
                disabled={loading}
            >
                { loading ? 'Loading...' : 'Login' }
            </Button>
        </Form>
    )
}