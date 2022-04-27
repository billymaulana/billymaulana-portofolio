const startAt = Date.now();
let count = 0;
const pageview = () => ({
  pageview: count++,
  startAt
});

export { pageview as default };
//# sourceMappingURL=pageview.mjs.map
