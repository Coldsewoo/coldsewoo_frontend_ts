// dev - localhost(for testing)
const API_URL = 'http://localhost:5000'
// prod - aws EC2 backend
// const API_URL = 'https://coldsewoo-backend.cf'
const monthEng = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const currencyCode = [
  { header: 'Main Currencies' },
  { name: 'US Dollar/USD', code: 'USD', flag: 'us' },
  { name: 'Euro/EUR', code: 'EUR', flag: 'eu' },
  { name: 'Korean Won/KRW', code: 'KRW', flag: 'kr' },
  { name: 'Japanese Yen/JPY', code: 'JPY', flag: 'jp' },
  { name: 'British Pound/GBP', code: 'GBP', flag: 'gb' },
  { name: 'Chinese Yuan/CNY', code: 'CNY', flag: 'cn' },
  { name: 'Canadian Dollar/CAD', code: 'CAD', flag: 'ca' },
  { name: 'Hong Kong Dollar/HKD', code: 'HKD', flag: 'hk' },
  { name: 'Indian Rupee/INR', code: 'INR', flag: 'in' },
  { name: 'Russian Ruble/RUB', code: 'RUB', flag: 'ru' },
  { name: 'Singapore Dollar/SGD', code: 'SGD', flag: 'sg' },
  { name: 'Thailand Baht/THB', code: 'THB', flag: 'th' },
  { divider: true },
  { header: 'Other Currencies' },
  { name: 'Australian Dollar/AUD', code: 'AUD', flag: 'au' },
  { name: 'Brazilian Real/BRL', code: 'BRL', flag: 'br' },
  { name: 'Bulgarian Lev/BGN', code: 'BGN', flag: 'bg' },
  { name: 'Croatia Kuna/HRK', code: 'HRK', flag: 'hr' },
  { name: 'Czech Koruna/CZK', code: 'CZK', flag: 'cz' },
  { name: 'Danish Krone/DKK', code: 'DKK', flag: 'dk' },
  { name: 'Hungary Forint/HUF', code: 'HUF', flag: 'hu' },
  { name: 'Iceland Krona/ISK', code: 'ISK', flag: 'is' },
  { name: 'Indonesia Rupiah/IDR', code: 'IDR', flag: 'id' },
  { name: 'Malaysian Ringgit/MYR', code: 'MYR', flag: 'my' },
  { name: 'Mexican Peso/MXN', code: 'MXN', flag: 'mx' },
  { name: 'New Israeli Sheqel/ILS', code: 'ILS', flag: 'il' },
  { name: 'New Zealand Dollar/NZD', code: 'NZD', flag: 'nz' },
  { name: 'Norwegian Krone/NOK', code: 'NOK', flag: 'no' },
  { name: 'Philippine Peso/PHP', code: 'PHP', flag: 'ph' },
  { name: 'Poland Zloty/PLN', code: 'PLN', flag: 'pl' },
  { name: 'Romanian Leu/RON', code: 'RON', flag: 'ro' },
  { name: 'South Africa Rand/ZAR', code: 'ZAR', flag: 'za' },
  { name: 'Swedish Krona/SEK', code: 'SEK', flag: 'se' },
  { name: 'Swiss Franc/CHF', code: 'CHF', flag: 'ch' },
  { name: 'Turkish Lira/TRY', code: 'TRY', flag: 'tr' },
]

module.exports = {
  API_URL,
  monthEng,
  currencyCode,
}
