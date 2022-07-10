const fs = require('fs');
const gdal = require('gdal-async');

gdal.config.set('GRIB_NORMALIZE_UNITS', 'NO');

const ds = gdal.open(process.argv[2]);

const data = {};
let line = 0;
for (const band of ds.bands) {
    const ref_time = band.getMetadata().GRIB_REF_TIME;
    const el = band.getMetadata().GRIB_ELEMENT;

    const date = +ref_time * 1000;

    if (!data[date])
        data[date] = {};
    data[date][el] = band.pixels.get(0, 0);
    if (line++ % 1000 === 0) process.stdout.write('.');
}

for (const hour of Object.keys(data)) {
    const u = data[hour].U;
    const v = data[hour].V;

    const speed = Math.sqrt(u*u + v*v);
    const dir = (270 - (180 / Math.PI) * Math.atan2(v, u)) % 360;

    data[hour] = { speed, dir };
    if (line++ % 1000 === 0) process.stdout.write('+');
}

const csv = fs.createWriteStream(process.argv[3], 'utf-8');
csv.write('year,month,day,hour,speed,direction');
for (const hour of Object.keys(data)) {
    const date = new Date(+hour);
    csv.write(`${date.getUTCFullYear()},${date.getUTCMonth() + 1},${date.getUTCDate()},${date.getUTCHours()},${data[hour].speed},${data[hour].dir}\n`);
    if (line++ % 1000 === 0) process.stdout.write('.');
}
csv.close();
process.stdout.write('\n');
