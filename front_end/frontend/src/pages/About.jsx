import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"DESKRIPSI"} text2={"APLIKASI"} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.about_img}
          alt="Stylow App"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            <b>Stylow</b> (Stylish Low Budget) adalah aplikasi web e-commerce
            yang dikembangkan sebagai tugas besar mata kuliah Pemrograman
            Berorientasi Objek (PBO). Aplikasi ini menyediakan platform belanja
            daring yang mudah diakses, terutama untuk produk fashion dan
            kebutuhan sehari-hari dengan harga terjangkau.
          </p>
          <p>
            Pengembangan aplikasi ini mengadopsi prinsip Pemrograman
            Berorientasi Objek untuk membangun sistem yang modular, fleksibel,
            dan dapat dikembangkan lebih lanjut. Frontend aplikasi menggunakan
            teknologi modern seperti React.js dengan pendekatan komponen yang
            reusable dan terstruktur.
          </p>
          <b className="text-gray-800">Misi Stylow</b>
          <p>
            Misi utama Stylow adalah menyediakan pengalaman belanja online yang
            nyaman, efisien, dan stylish bagi pengguna dengan anggaran terbatas.
            Selain itu, aplikasi ini menjadi media praktik penerapan konsep OOP
            seperti kelas, objek, inheritance, dan encapsulation dalam konteks
            pengembangan aplikasi nyata.
          </p>
        </div>
      </div>

      <div className="text-xl py-4">
        <Title text1={"FITUR"} text2={"UTAMA"} />
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Pencarian dan Filter Produk:</b>
          <p className="text-gray-600">
            Memudahkan pengguna menemukan produk berdasarkan kategori dan
            subkategori.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Sistem Keranjang Belanja (Cart):</b>
          <p className="text-gray-600">
            Pengguna dapat menambahkan produk ke keranjang untuk proses checkout
            yang efisien.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Login dan Manajemen Pengguna:</b>
          <p className="text-gray-600">
            Pengguna dapat membuat akun, login, dan mengelola profil serta
            pesanan mereka.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
