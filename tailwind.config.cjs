const config = {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {},
	},
	plugins: [
		require('daisyui')
	],
	daisyui: {
		themes: [
			'dark',
			'light'
		]
	}
};

module.exports = config;
