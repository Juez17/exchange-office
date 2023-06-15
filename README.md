# exchange-office
Just a simple exchange rate app with data fetched from an external API...

Languages used:
-TypeScript
-Sass
-HTML

Prevented behaviour: 1) trying to convert using the same currencies, 2) providing invalid input (such as non-numeric values, negative numbers, etc.), 3) hammering the exchange button (the app prevents sending multiple requests simultaneously).

Usage: one is only allowed to convert from left to right (meaning that you have to fill the input on the left - the right one is read-only).

The result is rounded to 2 decimal places.
