import('./src/data/exercises.js').then((mod) => {
  console.log(Object.keys(mod));
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
