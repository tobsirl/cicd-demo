import dotenv from 'dotenv';
import express from 'express';
import contactsRouter from './api/contacts';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

const port = process.env.PORT;

// configure body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static('public'));

app.use('/api/contacts', contactsRouter);

app.listen(port, () => {
  console.info(`Server running at ${port}`);
});
