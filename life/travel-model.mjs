// Data preparation is independent of the map so malformed entries cannot break the page.
export function prepareTrips(input) {
  if (!Array.isArray(input)) return { trips: [], invalid: 1 };
  const trips = [];
  const ids = new Set();
  let invalid = 0;
  const text = value => typeof value === 'string' ? value.trim() : '';
  for (const item of input) {
    const id = text(item?.id);
    const title = text(item?.title);
    if (!id || !title || ids.has(id) || !Array.isArray(item.stops) || !item.stops.length) { invalid++; continue; }
    const stops = item.stops.map(stop => {
      const coordinates = stop?.coordinates;
      if (!text(stop?.name) || !Array.isArray(coordinates) || coordinates.length !== 2 ||
          !coordinates.every(Number.isFinite) || Math.abs(coordinates[0]) > 85 || Math.abs(coordinates[1]) > 180) return null;
      return { name: text(stop.name), country: text(stop.country), countryCode: text(stop.countryCode), region: text(stop.region), regionId: text(stop.regionId), date: text(stop.date), note: text(stop.note), coordinates: [...coordinates] };
    });
    if (stops.includes(null)) { invalid++; continue; }
    ids.add(id);
    trips.push({ id, title, dates: text(item.dates), description: text(item.description), stops });
  }
  return { trips, invalid };
}

// Follow the short connection across the date line instead of circling the globe.
export function routePoints(stops) {
  return stops.reduce((points, stop) => {
    let [latitude, longitude] = stop.coordinates;
    if (points.length) {
      const previous = points[points.length - 1][1];
      while (longitude - previous > 180) longitude -= 360;
      while (longitude - previous < -180) longitude += 360;
    }
    points.push([latitude, longitude]);
    return points;
  }, []);
}
