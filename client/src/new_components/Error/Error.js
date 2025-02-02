import React from 'react'

const Error = () => {
    return (
        <div className='w-screen h-screen flex flex-col justify-center items-center bg-[#222831]'>
            <div className='text-5xl capitalize text-[#EEEEEE]'>Error 404: Page not found</div>
            <div className='text-3xl mt-12 text-[#EEEEEE]'>It's OK to get lost every once in a while...</div>
            <a href="/" className='hover:underline text-2xl mt-4 text-[#EEEEEE]'>Navigate to Home</a>
        </div>
    )
}

export default Error