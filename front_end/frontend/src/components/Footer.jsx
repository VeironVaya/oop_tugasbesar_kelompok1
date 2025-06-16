import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        <div>
          <img className='mb-5 w-32' src={assets.logo} alt="STYLOW Logo" />
          <p className='w-full md:w-2/3 text-gray-600'>
            Stylow (Stylish Low Budget) adalah aplikasi web e-commerce yang dikembangkan sebagai tugas besar mata kuliah Pemrograman Berorientasi Objek (PBO). Aplikasi ini menyediakan platform belanja daring yang mudah diakses, terutama untuk produk fashion dan kebutuhan sehari-hari dengan harga terjangkau.
          </p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>STYLOW</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>Home</li>
            <li>Collection</li>
            <li>About us</li>
          </ul>
        </div>

      </div>

      <div>
        <hr />
        <p className='py-5 text-sm text-center'>
          Copyright 2024@ forever.com - All Right Reserved.
        </p>
      </div>

    </div>
  )
}

export default Footer
