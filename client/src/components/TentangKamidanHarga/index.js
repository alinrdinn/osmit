import React from "react";
import styles from "./styles.module.css";

class TentangKamidanHarga extends React.Component {
  render() {
    return (
      <div className={styles.body}>
        <div className={styles.tentang_kami}>
          <h1 className={`${styles.title} roboto-bold-black-24px`}>
            Tentang Kami
          </h1>
          <div className={`${styles.text_1} roboto-normal-black-18px`}>
            Kami beranggotakan 5 mahasiswa Politeknik Negeri Bandung dari
            jurusan Teknik Komputer dan Informatika dan juga Manajemen Aset:
            <br />
            - Ali Nurdin (Teknik Informatika)
            <br />
            - Alvira Putrina Daradjat (Teknik Informatika)
            <br />
            - Farra Jessica (Teknik Informatika)
            <br />
            - Marissa Nur Amalia (Teknik Informatika)
            <br />- Nadya Sylvha Chairin (Manajemen Aset)
          </div>
        </div>
        <div className={styles.tentang_kami_1}>
          <div className={`${styles.title} roboto-bold-black-24px`}>
            Alasan Kami Membuat Aplikasi Ini
          </div>
          <div className={`${styles.text_3} roboto-normal-black-18px`}>
            Indonesia merupakan salah satu negara yang paling menarik bagi
            investor jangka panjang karena profil demografisnya yang
            menguntungkan. Di Indonesia sendiri, terdapat pertumbuhan yang besar
            untuk investor pemula di sektor ritel. Jumlah investor di pasar
            modal telah meningkat secara signifikan selama setahun terakhir.
            Pemerintah telah menempatkan fokus baru pada sektor ekonomi digital,
            yang akan memberikan akses terbuka bagi UMKM ke dalam rantai ekonomi
            global. Bagaimanpun, investor pemula mungkin lebih cenderung
            menyimpang dari rencana yang ditetapkan daripada pedagang
            berpengalaman.
            <br />
            Oleh karena itu, kami membuat aplikasi pembelajaran saham berbasis
            simulasi berdasarkan berita dan informasi yang mengikuti
            pergerakannya. Berita/informasi diambil dari berita pada waktu
            tertentu yang memiliki hubungan erat dengan harga saham pada waktu
            yang sama. Berita ini kemudian akan disajikan kepada pengguna dan
            pengguna akan menganalisis berita tersebut. Hasil analisis akan
            memutuskan pembelian atau penjualan saham di aplikasi.
          </div>
          <div className={`${styles.title} roboto-bold-black-24px`}>
            Kontak kami via +62 851-5710-8911 untuk membeli paket premium, atau
            klik rencana dibawah ini:
          </div>
        </div>
        <div className={styles.kartu}>
          <KartuHarga
            {...{
              judul: "Premium 1",
              fitur1: "Semua Kode Saham yang Tersedia",
              fitur2: "Tips Bagi Investor Pemula",
              fitur3: "Panduan Investasi Saham",
              harga1: "Rp. 50.000/1 bulan"
            }}
          />
          <KartuHarga
            {...{
              judul: "Premium 2",
              fitur1: "Semua Kode Saham yang Tersedia",
              fitur2: "Tips Bagi Investor Pemula",
              fitur3: "Panduan Investasi Saham",
              harga1: "Rp. 240.000/6 bulan"
            }}
          />
          <KartuHarga
            {...{
              judul: "Premium 3",
              fitur1: "Semua Kode Saham yang Tersedia",
              fitur2: "Tips Bagi Investor Pemula",
              fitur3: "Panduan Investasi Saham",
              harga1: "Rp. 360.000/12 bulan"
            }}
          />
        </div>
        <div className={styles.dibuat_dengan_cinta}>
          <div className={`${styles.text_7} roboto-normal-black-18px`}>
            Dibuat dengan <span className={styles.love}>❤</span> di Ciwaruga
          </div>
        </div>
      </div>
    );
  }
}

export default TentangKamidanHarga;

class KartuHarga extends React.Component {
  render() {
    const {
      judul,
      fitur1,
      fitur2,
      fitur3,
      harga1,
      harga2,
      harga3
    } = this.props;
    return (
      <div className={`${styles.kartu_harga} border-0-7px-mountain-mist`}>
        <div className={`${styles.place} roboto-normal-cinder-22px`}>
          {judul}
        </div>
        <div className={styles.fitur_2}>
          <Fitur p={fitur1} />
          {!fitur2 ? null : <Fitur p={fitur2} />}
          {!fitur3 ? null : <Fitur p={fitur3} />}
        </div>
        <div className={styles.harga_1}>
          <div className={`${styles.harga} opensans-normal-storm-gray-12px`}>
            Harga
          </div>
          <div className={`${styles.place_1} opensans-normal-cinder-24px`}>
            {harga1}
          </div>
          {!harga2 ? null : (
            <div className={`${styles.place_1} opensans-normal-cinder-24px`}>
              {harga2}
            </div>
          )}
          {!harga2 ? null : (
            <div className={`${styles.place_1} opensans-normal-cinder-24px`}>
              {harga3}
            </div>
          )}
        </div>
        <a
          href="https://api.whatsapp.com/send/?phone=6285157108911&text=Halo%2C+saya+ingin+membeli+product+key+OSMIT"
          className="align-self-flex-start"
        >
          <div className={`${styles.submit} border-1px-black`}>
            <div
              className={`${styles.ganti} valign-text-middle roboto-normal-black-14px`}
            >
              Beli
            </div>
          </div>
        </a>
      </div>
    );
  }
}

class Fitur extends React.Component {
  render() {
    const { p } = this.props;

    return (
      <div className={styles.fitur_1_1}>
        <div className={styles.vector}>
          <svg
            width="17"
            height="15"
            viewBox="0 0 17 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.5 8.192L5.361 12L15.5 2"
              stroke="#FFC700"
              stroke-width="3"
            />
          </svg>
        </div>
        <div className={`${styles.address} opensans-normal-cinder-14px`}>
          {p}
        </div>
      </div>
    );
  }
}
