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
      }, 5000 * index);
    }
  }, [data, myChart]);

  const changeHandler = (event) => {
    event.preventDefault();
    setStockInput((prevState) => ({
      ...prevState,
      [event.target.name]: parseInt(event.target.value, 10)
    }));
  };

  return (
    <div class="builder-block css-h6kvej">
      <div class="builder-block css-1xcng19">
        <canvas
          class="builder-block builder-canvas css-12dm0k"
          ref={chartRef}
          id="myChart"
        ></canvas>
        <div class="builder-block css-awle9n">
          <div class="builder-block css-euewnx">
            <h1 class="builder-block  css-mwga5u">
              <span class="builder-text css-1qggkls">Aset yang dimiliki</span>
            </h1>
            <span class="builder-block css-gmszm9">
              <span class="builder-text css-1qggkls">Uang: {assets.money}</span>
            </span>
            <span class="builder-block css-gmszm9">
              <span class="builder-text css-1qggkls">
                Saham: {assets.stock}
              </span>
            </span>
            <span class="builder-block css-gmszm9">
              <span class="builder-text css-1qggkls">
                Total aset: {assets.total_aset}
              </span>
            </span>
          </div>
          <div class="builder-block css-euewnx">
            <h1 class="builder-block  css-mwga5u">
              <span class="builder-text css-1qggkls">Info Saham Kemarin</span>
            </h1>
            <span class="builder-block css-gmszm9">
              <span class="builder-text css-1qggkls">Harga: {lastStock}</span>
            </span>
          </div>
          <div class="builder-block css-1wckx14">
            <div class="builder-block css-e42lb">
              <label class="builder-block css-gy6hil">
                <span class="builder-text css-1qggkls">Beli</span>
              </label>
              <input
                class="builder-block css-wjk3sb"
                name="buy"
                type="number"
                step="1"
                min="0"
                value={stockInput.buy}
                onChange={changeHandler}
              />
            </div>
            <div class="builder-block css-k2py9l">
              <label class="builder-block css-gy6hil">
                <span class="builder-text css-1qggkls">Jual</span>
              </label>
              <input
                class="builder-block css-wjk3sb"
                name="sell"
                type="number"
                step="1"
                min="0"
                value={stockInput.sell}
                onChange={changeHandler}
              />
            </div>
          </div>
        </div>
      </div>
      <div class="builder-block css-10qcwwg">
        <h1 class="builder-block  css-mwga5u">
          <span class="builder-text css-1qggkls">
            {today ? "Hari ini " + today.x : "Simulasi Berakhir"}
          </span>
        </h1>
        <p class="builder-block css-gmszm9">
          <span class="builder-text css-1qggkls">
            {today ? (today.Berita === "" ? "Tidak Ada" : today.Berita) : null}
          </span>
        </p>
      </div>
    </div>
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
  }, [params, res]);

  const mulai = () => {
    setStarted(true);
  };

  return (
    <>
      {res.success ? (
        started ? (
          <Stock data={res.data} />
        ) : (
          <div class="builder-block css-h6kvej">
            <div class="builder-block css-10qcwwg">
              <h1 class="builder-block  css-mwga5u">
                <span class="builder-text css-1qggkls">Simulasi (Panduan)</span>
              </h1>
              <p class="builder-block css-gmszm9">
                <span class="builder-text css-1qggkls">
                  Kali ini, kamu akan diberkan aset artifisial sebesar Rp
                  1.000.000 untuk melakukan trading. Kamu harus membesarkan aset
                  ini menjadi lebih banyak. Kamu dapat dikatakan berhasil, jika
                  aset kamu bertambah (yang asalnya Rp 1.000.0000 menjadi lebih
                  besar). Jika tidak, kamu harus belajar lagi. Perlu diingat,
                  transaksi jual beli akan diproses untuk hari ke-3 dan
                  seterusnya (dengan kata lain, transkasi hari ke-1/untuk hari
                  ke-2 tidak akan diproses). Tekan tombol di bawah ini untuk
                  mulai melakukan simulasi trading.
                </span>
              </p>
              <button class="builder-block css-fwoxf8">
                <span class="builder-block css-dvd2j0">
                  <span class="builder-text css-1qggkls" onClick={mulai}>
                    LANJUT
                  </span>
                </span>
              </button>
            </div>
          </div>
        )
      ) : null}
      <div class="builder-block css-1y9pq1n"></div>
      <div class="builder-block css-1xbb6o8">
        <span class="builder-block css-1xodsls">
          <span class="builder-text css-1qggkls">
            Dibuat dengan ❤ di Ciwaruga
          </span>
        </span>
      </div>
    </>
  );
};

export default Simulasi;
