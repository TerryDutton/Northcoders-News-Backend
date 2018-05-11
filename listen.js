const app = require('./app.js');
const PORT = process.env.PORT || 9090; 

app.listen(PORT, (err) => {
  if (err) throw err; 
  console.log(`Listening on port ${PORT}`);
});