module.exports = {
  mode: 'jit',
  purge: {
    enabled: true,
    content: ["./src/**/*.{html,ts}"],
  },
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
