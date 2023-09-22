import app from './app';

const { NODE_LOCAL_PORT = 5000 } = process.env;

app.listen(NODE_LOCAL_PORT, () => {
  console.log(`Listening: http://localhost:${NODE_LOCAL_PORT}`);
});
