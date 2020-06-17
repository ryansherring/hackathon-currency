import React from "react";
import { Container, Col, Row } from "react-bootstrap";

export default function Converter(props) {
  const {
    currencyOptions,
    selectedCurrency,
    onChangeCurrency,
    onChangeAmount,
    amount,
  } = props;
  return (
    <Row>
      <Col xs lg={2} />
      <Col style={{ margin: "0" }}>
        <input
          type="number"
          className="input"
          value={amount}
          onChange={onChangeAmount}
        />
      </Col>
      <Col style={{ margin: "0" }}>
        <select value={selectedCurrency} onChange={onChangeCurrency}>
          {currencyOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Col>
      <Col xs lg={2} />
    </Row>
  );
}

// still learning bootstrap grid have mercy on my soul