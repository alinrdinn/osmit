import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import styles from "./styles.module.css";
import Chart from "chart.js/auto";
const config = require("../config");

const Stock = ({ data }) => {
  const chartRef = useRef(null);
  const [myChart, setMyChart] = useState(null);

  const [assets, setAssets] = useState({
    money: 1000000,
    stock: 0,
    total_aset: 1000000
  });
  const [today, setToday] = useState(null);

  const [stockInput, setStockInput] = useState({ buy: 0, sell: 0 });
  const [lastStock, setLastStock] = useState(0);
  // const []

  useEffect(() => {
    if (!chartRef) return;
    const ctx = chartRef.current.getContext("2d");
    const myChart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Harga",
            data: [],
            borderColor: "rgba(255, 180, 0, 1)",
            backgroundColor: "rgba(255, 180, 0, 0.5)"
          }
        ]
      }
    });
    setMyChart(myChart);
  }, [data, chartRef]);

  useEffect(() => {
    var stock_buyed = stockInput.buy;
    var stock_selled = stockInput.sell;
    if (stockInput.buy * lastStock > assets.money) {
      stock_buyed = Math.floor(assets.money / lastStock);
    }
    if (stockInput.sell > assets.stock) {
      stock_selled = assets.stock;
    }
    const money =
      assets.money - lastStock * stock_buyed + lastStock * stock_selled;
    const stock = assets.stock + stock_buyed - stock_selled;
    setAssets((prevState) => ({
      money: money,
      stock: stock,
      total_aset: stock * lastStock + money
    }));
    setStockInput({ buy: 0, sell: 0 });
  }, [lastStock]);

  useEffect(() => {
    if (!myChart) return;
    var temp = [];
    for (let index = 0; index < data.length; index++) {
      setTimeout(() => {
        // Setting Berita Hari ini
        if (index + 1 === data.length) {
          setToday(null);
        } else {
          setToday({
            x: data[index + 1].x,
            Berita: data[index + 1].Berita
          });
        }
        setLastStock(data[index].y);
        temp.push({ x: data[index].x, y: data[index].y });
        myChart.data.datasets[0].data = temp;
        myChart.update();
      }, 1000 * index);
    }
  }, [data, myChart]);

  const changeHandler = (event) => {
    event.preventDefault();
    setStockInput((prevState) => ({
      ...prevState,
      [event.target.name]: parseInt(event.target.value)
    }));
  };

  return (
    <>
      <div className={styles.simulasi}>
        <div>
          <canvas ref={chartRef} id="myChart" width="600" height="400" />
        </div>
        <form>
          <div className={styles.password}>
            <div className={`roboto-normal-black-18px`}>Beli</div>
            <div>
              <input
                className={`${styles.masukkan_password} roboto-normal-limed-spruce-18px ${styles.rectangle} border-1px-mountain-mist`}
                name="buy"
                placeholder="..."
                type="number"
                step="1"
                min="0"
                value={stockInput.buy}
                onChange={changeHandler}
              />
            </div>
          </div>
          <div className={styles.password}>
            <div className={`${styles.password_1} roboto-normal-black-18px`}>
              Jual
            </div>
            <div className={styles.overlap_group1}>
              <input
                className={`${styles.masukkan_password} roboto-normal-limed-spruce-18px ${styles.rectangle} border-1px-mountain-mist`}
                name="sell"
                placeholder="..."
                type="number"
                step="1"
                min="0"
                value={stockInput.sell}
                onChange={changeHandler}
              />
            </div>
          </div>
          <h1 className={`${styles.title} roboto-bold-black-24px`}>
            Aset yang dimiliki
          </h1>
          <p className={`${styles.text_3} roboto-normal-black-18px`}>
            Uang: {assets.money}
          </p>
          <p className={`${styles.text_3} roboto-normal-black-18px`}>
            Saham: {assets.stock}
          </p>
          <p className={`${styles.text_3} roboto-normal-black-18px`}>
            Total Aset: {assets.total_aset}
          </p>
        </form>
      </div>
      <h1 className={`${styles.title} roboto-bold-black-24px`}>
        {today ? "Hari ini " + today.x : "Simulasi Berakhir"}
      </h1>
      <p className={`${styles.text_3} roboto-normal-black-18px`}>
        {today ? (today.Berita === "" ? "Tidak Ada" : today.Berita) : null}
      </p>
    </>
  );
};

const Simulasi = () => {
  const params = useParams();
  const [res, setRes] = useState({});
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (Object.keys(res).length !== 0) return;
    console.log(params);
    Axios.get(config.api_url + "/courses/data/" + params.id, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
      .then((res) => {
        setRes({ ...res.data });
      })
      .catch((err) => {
        setRes({ success: false });
        console.log(err);
      });
  }, [res]);

  const mulai = () => {
    setStarted(true);
  };

  return (
    <>
      <div className={styles.body}>
        {res.success ? (
          started ? (
            <Stock data={res.data} />
          ) : (
            <>
              <p className={`${styles.text_3} roboto-normal-black-18px`}>
                Kali ini, kamu akan diberkan aset artifisial sebesar Rp
                1.000.000 untuk melakukan trading. Kamu harus membesarkan aset
                ini menjadi lebih banyak. Kamu dapat dikatakan berhasil, jika
                aset kamu bertambah (yang asalnya Rp 1.000.0000 menjadi lebih
                besar). Jika tidak, kamu harus belajar lagi. Perlu diingat,
                transaksi jual beli akan diproses untuk hari ke-3 dan seterusnya
                (dengan kata lain, transkasi hari ke-1/untuk hari ke-2 tidak
                akan diproses). Tekan tombol di bawah ini untuk mulai melakukan
                simulasi trading.
              </p>
              <button
                onClick={mulai}
                className={`${styles.submit} ${styles.ganti} valign-text-middle roboto-normal-black-14px border-1px-black`}
              >
                Selanjutnya
              </button>
            </>
          )
        ) : null}
        <div className={styles.dibuat_dengan_cinta}>
          <div className={`${styles.text_7} roboto-normal-black-18px`}>
            Dibuat dengan <span className={styles.love}>❤</span> di Ciwaruga
          </div>
        </div>
      </div>
    </>
  );
};

export default Simulasi;
