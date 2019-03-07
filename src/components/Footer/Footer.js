import React from 'react'

const Footer = () => (
    <p>
        Copyright &copy; {
            '20' + (new Date().getYear() - 100)
        } Senate of Virginia
    </p>
);

export default Footer