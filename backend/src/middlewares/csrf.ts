import csrf from 'csurf'

const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    },
})

export default csrfProtection
