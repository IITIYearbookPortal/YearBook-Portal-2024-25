import React from 'react'

const Error = () => {
    return (
        <div className='w-screen h-screen flex flex-col justify-center items-center'>
            <div className='text-5xl capitalize'>Error 404: Page not found</div>
            <div className='text-3xl mt-12'>It's OK to get lost every once in a while...</div>
            <a href="/" className='hover:underline text-2xl mt-4'>Navigate to Home</a>
        </div>
    )
}

export default Error