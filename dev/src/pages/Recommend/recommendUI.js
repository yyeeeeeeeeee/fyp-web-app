import React, { useState } from 'react';

export default function Recommendations() {
  const [data, setData] = useState([]);

  const getRecommendations = async () => {
    try {
        const res = await fetch(`https://localhost::5000/recommendations?genre=Pop&mood=Happy`);
        if (res.ok) {
            setData(res.data.recommendations);
        }
    } catch (error) {
        console.error("error while get recommendation:", error.message);
    }
  };

  return (
    <div>
      <button onClick={getRecommendations}>Get Recommendations</button>
      <ul>
        {data.map((song, idx) => <li key={idx}>{song}</li>)}
      </ul>
    </div>
  );
}
