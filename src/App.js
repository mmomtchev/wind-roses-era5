import './App.css';
import React from 'react';
import { Chart } from 'react-windrose-chart/dist/index.dev.js';

const WIND_MAX = 32;
const WIND_STEP = 4;

const columns = ['angle'];
for (let s = 0; s < WIND_MAX; s += WIND_STEP)
  columns.push(`${s}-${s + WIND_STEP}`);
columns.push(`${WIND_MAX}+`);
const direction = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];

function App() {
  const [data, setData] = React.useState([]);
  const [period, setPeriod] = React.useState(1);

  const years = [];
  for (let y = 1959; y <= 2022; y += period) {
    years.push([y, y + period - 1]);
  }

  React.useEffect(() => {
    fetch('fichier.csv').then((resp) => resp.text()).then((resp) => {
      const lines = resp.split('\n');
      const r = [];
      for (const line of lines) {
        // 0 year, 1 month, 2 day, 3 hour, 4 speed, 5 direction
        const el = line.split(',');
        r.push(el);
      }
      setData(r);
    });
  }, []);

  const getData = React.useCallback((yearStart, yearEnd) => {
    const selection = data.filter((el) => (el[0] >= yearStart) && (el[0] <= yearEnd));
    const r = [];
    for (const dir of direction) {
      const obj = { angle: dir, total: 0 };
      for (let s = 0; s < WIND_MAX; s += WIND_STEP)
        obj[`${s}-${s + WIND_STEP}`] = 0;
      obj[`${WIND_MAX}+`] = 0;
      r.push(obj);
    }
    for (const el of selection) {
      const bucket_dir = Math.round(el[5] / 22.5) % direction.length;
      const s = Math.floor(el[4] / WIND_STEP) * WIND_STEP;
      const bucket_speed = s < WIND_MAX ? `${s}-${s + WIND_STEP}` : `${WIND_MAX}+`;
      r[bucket_dir][bucket_speed]++;
      r[bucket_dir].total++;
    }
    return r;
  }, [data]);


  return (
    <div className="App">
      <div>
        <h1>Vent météo en Juin à 250hPa (~10km) au-dessus du col de la Forclaz</h1>
      </div>
      <div>
        <h3>
        <label htmlFor="period">Grouper par:</label>
        <select id="period" name="period" onChange={(v) => setPeriod(+v.target.value)}>
          {
            [1, 2, 3, 4, 5, 10].map((p) =>
              <option key={p} value={p}>{p}</option>
            )
          }
        </select>
        </h3>
      </div>
      <div className="grid">
        {
          data.length > 0 ?
            years.map((y, i) =>
              <div key={'' + period + ':' + i} className="rose">
                {y[0] !== y[1] ? `${y[0]} - ${Math.min(y[1], 2022) }` : y[0]}
                <Chart
                  chartData={getData(y[0], y[1])}
                  responsive
                  columns={columns}
                />
              </div>
            )
            :
            null
        }
      </div>
    </div>
  );
}

export default App;
