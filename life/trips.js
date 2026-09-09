// Visits and their order were supplied by the owner. Coordinates are city centers.
// Paris intentionally has no date: none was supplied.
window.TRAVEL_TRIPS = [
  {
    id: 'germany-2024', title: 'Arriving in Germany', dates: 'August 2024',
    stops: [
      { name: 'Frankfurt am Main', country: 'Germany', countryCode: 'DEU', region: 'Hessen', regionId: 'DE-HE', date: 'August 2024', coordinates: [50.1109, 8.6821] },
      { name: 'Saarbrücken', country: 'Germany', countryCode: 'DEU', region: 'Saarland', regionId: 'DE-SL', date: 'August 2024', coordinates: [49.2402, 6.9969] }
    ]
  },
  {
    id: 'nrw-2025', title: 'Cologne & Düsseldorf', dates: 'March 2025',
    stops: [
      { name: 'Cologne', country: 'Germany', countryCode: 'DEU', region: 'Nordrhein-Westfalen', regionId: 'DE-NW', date: 'March 2025', coordinates: [50.9375, 6.9603] },
      { name: 'Düsseldorf', country: 'Germany', countryCode: 'DEU', region: 'Nordrhein-Westfalen', regionId: 'DE-NW', date: 'March 2025', coordinates: [51.2277, 6.7735] }
    ]
  },
  {
    id: 'paris', title: 'Paris', dates: '',
    stops: [{ name: 'Paris', country: 'France', countryCode: 'FRA', region: 'Île-de-France', regionId: 'FR-IDF', coordinates: [48.8566, 2.3522] }]
  },
  {
    id: 'scandinavia-2026', title: 'Denmark & Sweden', dates: 'September 2026',
    stops: [
      { name: 'Copenhagen', country: 'Denmark', countryCode: 'DNK', region: 'Hovedstaden', regionId: 'DK-84', date: 'September 2026', coordinates: [55.6761, 12.5683] },
      { name: 'Malmö', country: 'Sweden', countryCode: 'SWE', region: 'Skåne län', regionId: 'SE-M', date: 'September 2026', coordinates: [55.6050, 13.0038] },
      { name: 'Lund', country: 'Sweden', countryCode: 'SWE', region: 'Skåne län', regionId: 'SE-M', date: 'September 2026', coordinates: [55.7047, 13.1910] }
    ]
  }
];
