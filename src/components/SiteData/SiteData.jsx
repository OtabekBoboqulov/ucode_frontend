import React, {useEffect, useState} from 'react';
import './SiteData.css';
import {BASE_URL} from "../../constants.jsx";

const SiteData = () => {
  const [data, setData] = useState([]);
  const getData = async () => {
    const response = await fetch(`${BASE_URL}/api/statistics/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setData(data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="site-data">
      <div className="site-data-card">
        <div className="site-data-number">{Math.floor(data.users_count / 10) * 10}+</div>
        <div className="site-data-text">o`quvchilar</div>
      </div>
      <div className="site-data-card">
        <div className="site-data-number">{data.certificates_count}</div>
        <div className="site-data-text">bitiruvchilar</div>
      </div>
      <div className="site-data-card">
        <div className="site-data-number">{data.courses_count}</div>
        <div className="site-data-text">kurslar</div>
      </div>
    </div>
  );
};

export default SiteData;
