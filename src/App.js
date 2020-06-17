import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Converter from "./Components/converter";
import { Jumbotron, Container, Row, Col } from "react-bootstrap";


// API provided
const BASE_URL = "https://open.exchangerate-api.com/v6/latest";

function App() {
  // FIRST, we need to define our changing value points. Fetching our API will change these points by setting the state
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [OGCurrency, setOGCurrency] = useState();
  const [newCurrency, setnewCurrency] = useState();
  const [exchangeRate, setExchangeRate] = useState();
  const [amount, setAmount] = useState(1);
  const [amountInOGCurrency, setAmountInOGCurrency] = useState(true);

  // Thanks Monarch Wadia for the fix! Anything other than EUR and USD didn't work before!
  let newAmount, OGAmount;
  if (amountInOGCurrency) {
    OGAmount = amount;
    newAmount = amount * exchangeRate;
  } else {
    newAmount = amount;
    OGAmount = amount / exchangeRate;
  }

  //on selecting our data via converter, we set the state and render real time! This is necessary for our graph. 
  useEffect(() => {
    fetch(BASE_URL)
      .then((res) => res.json())
      .then((data) => {
        const firstCurrency = Object.keys(data.rates)[0];
        setCurrencyOptions([data.base, ...Object.keys(data.rates)]);
        setOGCurrency(data.base);
        setnewCurrency(firstCurrency);
        setExchangeRate(data.rates[firstCurrency]);
      });
  }, []);

  useEffect(() => {
    if (OGCurrency != null && newCurrency != null) {
      fetch(`${BASE_URL}?base=${OGCurrency}&symbols=${newCurrency}`)
        .then((res) => res.json())
        .then((data) => setExchangeRate(data.rates[newCurrency]));
    }
  }, [OGCurrency, newCurrency]);

  function handleOGAmountChange(e) {
    setAmount(e.target.value);
    setAmountInOGCurrency(true);
  }

  function handlenewAmountChange(e) {
    setAmount(e.target.value);
    setAmountInOGCurrency(false);
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //BAR GRAPH
  const graphdata = {
    labels: [OGCurrency, newCurrency],
    datasets: [
      {
        label: "Currency Values",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: [OGAmount, newAmount],
      },
    ],
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Notice how we use Converter to set OGCurrency and set newCurrency values for each one. This is a one way conversion but we're on a timelimit
  return (
    <>
      <Container fluid style={{backgroundColor: "lightGrey"}}>
        <Jumbotron style={{backgroundColor: "black", color: "white"}}>
          <h1>Conversion thing... Now with a Graph</h1>
        </Jumbotron>
        <Row>
          <Col>
            <Converter
              currencyOptions={currencyOptions}
              selectedCurrency={OGCurrency}
              onChangeCurrency={(e) => setOGCurrency(e.target.value)}
              onChangeAmount={handleOGAmountChange}
              amount={OGAmount}
            />
          </Col>
          <Col>
            <Converter
              currencyOptions={currencyOptions}
              selectedCurrency={newCurrency}
              onChangeCurrency={(e) => setnewCurrency(e.target.value)}
              onChangeAmount={handlenewAmountChange}
              amount={newAmount}
            />
          </Col>
        </Row>
        <Row>
          {/* BAR GRAPH HERE */}
          <Bar
            data={graphdata}
            width={80}
            height={30}
            options={{
              maintainAspectRatio: true,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                    },
                  },
                ],
              },
            }}
          />
        </Row>
      </Container>
    </>
  );
}

export default App;



