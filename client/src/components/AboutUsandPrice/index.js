import React from "react";

class AboutUsandPrice extends React.Component {
  render() {
    return (
      <div className="builder-block css-hitm5w">
        <div className="builder-block css-78ypib">
          <h1 className="builder-block  css-mwga5u">
            <span className="builder-text css-1qggkls">Tentang Kami</span>
          </h1>
          <p className="builder-block css-gmszm9">
            <span className="builder-text css-1qggkls">
              Kami beranggotakan 5 mahasiswa Politeknik Negeri Bandung dari
              jurusan Teknik Komputer dan Informatika dan juga Manajemen Aset:
              Ali Nurdin (Teknik Informatika) Alvira Putrina Daradjat (Teknik
              Informatika) Farra Jessica (Teknik Informatika) Marissa Nur Amalia
              (Teknik Informatika) nadya Sylvha Chairin (Manajemen Aset)
            </span>
          </p>
        </div>
        <div className="builder-block css-1y9pq1n"></div>
        <div className="builder-block css-lnwuwv">
          <h1 className="builder-block  css-mwga5u">
            <span className="builder-text css-1qggkls">
              Alasan Kami Membuat Aplikasi Ini
            </span>
          </h1>
          <p className="builder-block css-gmszm9">
            <span className="builder-text css-1qggkls">
              Indonesia merupakan salah satu negara yang paling menarik bagi
              investor jangka panjang karena profil demografisnya yang
              menguntungkan. Di Indonesia sendiri, terdapat pertumbuhan yang
              besar untuk investor pemula di sektor ritel. Jumlah investor di
              pasar modal telah meningkat secara signifikan selama setahun
              terakhir. Pemerintah telah menempatkan fokus baru pada sektor
              ekonomi digital, yang akan memberikan akses terbuka bagi UMKM ke
              dalam rantai ekonomi global. Bagaimanpun, investor pemula mungkin
              lebih cenderung menyimpang dari rencana yang ditetapkan daripada
              pedagang berpengalaman. Oleh karena itu, kami membuat aplikasi
              pembelajaran saham berbasis simulasi berdasarkan berita dan
              informasi yang mengikuti pergerakannya. Berita/informasi diambil
              dari berita pada waktu tertentu yang memiliki hubungan erat dengan
              harga saham pada waktu yang sama. Berita ini kemudian akan
              disajikan kepada pengguna dan pengguna akan menganalisis berita
              tersebut. Hasil analisis akan memutuskan pembelian atau penjualan
              saham di aplikasi.
            </span>
          </p>
        </div>
        <div className="builder-block css-fh7fjh">
          <PriceCard
            {...{
              title: "Premium 1",
              features: [
                "Semua Kode Saham yang Tersedia",
                "Tips Bagi Investor Pemula",
                "Panduan Investasi Saham"
              ],
              price: "Rp. 50.000/1 bulan"
            }}
          />
          <PriceCard
            {...{
              title: "Premium 2",
              features: [
                "Semua Kode Saham yang Tersedia",
                "Tips Bagi Investor Pemula",
                "Panduan Investasi Saham"
              ],
              price: "Rp. 240.000/6 bulan"
            }}
          />
          <PriceCard
            {...{
              title: "Premium 3",
              features: [
                "Semua Kode Saham yang Tersedia",
                "Tips Bagi Investor Pemula",
                "Panduan Investasi Saham"
              ],
              price: "Rp. 360.000/12 bulan"
            }}
          />
        </div>
        <div className="builder-block css-1y9pq1n"></div>
        <div className="builder-block css-1xbb6o8">
          <span className="builder-block css-1xodsls">
            <span className="builder-text css-1qggkls">
              Dibuat dengan ❤ di Ciwaruga
            </span>
          </span>
        </div>
      </div>
    );
  }
}

export default AboutUsandPrice;

class PriceCard extends React.Component {
  render() {
    const { title, features, price } = this.props;
    return (
      <div className="builder-block css-196a46z">
        <span className="builder-block css-mwga5u">
          <span className="builder-text css-1qggkls">{title}</span>
        </span>
        <div className="builder-block css-16ex2h3"></div>
        <div className="builder-block css-2mseyl">{feature(features)}</div>
        <div className="builder-block css-16ex2h3"></div>
        <div className="builder-block  css-lmt07">
          <span className="builder-block  css-1dnda6k">
            <span className="builder-text css-1qggkls">Harga</span>
          </span>
          <div className="builder-block  css-y9sxmy">
            <span className="builder-block  css-1wax2q4">
              <span className="builder-text css-1qggkls">{price}</span>
            </span>
          </div>
        </div>
        <button className="builder-block css-z0fpat">
          <span className="builder-block  css-dvd2j0">
            <span className="builder-text css-1qggkls">KONTAK KAMI</span>
          </span>
        </button>
      </div>
    );
  }
}

function feature(section) {
  var listItems = section.map((item) => {
    return (
      <div className="builder-block css-1ajtaqb">
        <div className="builder-block css-1ckov9d">
          <img
            alt="checked"
            loading="lazy"
            className=" css-1hbf805"
            src="assets/checked.svg"
          />
          <div className=" css-3ggpzh"> </div>
        </div>
        <span className="builder-block css-tk1x5e">
          <span className="builder-text css-1qggkls">{item}</span>
        </span>
      </div>
    );
  });
  return listItems;
}
