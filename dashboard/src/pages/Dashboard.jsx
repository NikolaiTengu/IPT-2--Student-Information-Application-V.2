import React, { useState, useRef } from 'react';
import '../styles/Dashboard.css';
import { TextField, Button } from '@mui/material';

const Dashboard = () => {
  const brandRef = useRef(null);
  const modelRef = useRef(null);
  const yearRef = useRef(null);
  const colorRef = useRef(null);

  const [car, setCar] = useState({ brand: '', model: '', year: '', color: '' });
  const [carList, setCarList] = useState([]); 

  const handleClick = () => {
    const newCar = {
      brand: brandRef.current.value,
      model: modelRef.current.value,
      year: yearRef.current.value,
      color: colorRef.current.value
    };

    setCar(newCar);
    setCarList([...carList, newCar]);
  
    brandRef.current.value = '';
    modelRef.current.value = '';
    yearRef.current.value = '';
    colorRef.current.value = '';

    brandRef.current.focus();
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome to Saint Mary's University</h1>

      <div className="car-form">
        <h2>Add Car Details</h2>
        <TextField label="Brand" variant="outlined" inputRef={brandRef} fullWidth margin="normal" />
        <TextField label="Model" variant="outlined" inputRef={modelRef} fullWidth margin="normal" />
        <TextField label="Year" variant="outlined" type="number" inputRef={yearRef} fullWidth margin="normal" />
        <TextField label="Color" variant="outlined" inputRef={colorRef} fullWidth margin="normal" />

        <Button variant="contained" color="primary" onClick={handleClick} style={{ marginTop: '10px' }}>
          Change Car
        </Button>
      </div>

      <h3>Latest Car:</h3>
      <p>{`${car.brand} ${car.model} - ${car.year} (${car.color})`}</p>

      <h3>Car List:</h3>
      <ul>
        {carList.map((c, index) => (
          <li key={index}>{`${c.brand} ${c.model} - ${c.year} (${c.color})`}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
