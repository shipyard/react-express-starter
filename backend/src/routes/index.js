const express = require('express');
const aws = require('aws-sdk');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const fileType = require('file-type');
const multiparty = require('multiparty');

const db = require('../db/models');

const router = express.Router();

const createCounter = async () => {
  const counter = await db.Counter.create({
    count: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return counter.count;
};

const incrementCounter = async (counter) => {
  const { count } = counter;
  await db.Counter.update(
    { count: count + 1 },
    {
      where: { count: count },
    }
  );
  return count + 1;
};

const resetCounter = async (counter) => {
  const { count } = counter;
  await db.Counter.update(
    { count: 0 },
    {
      where: { count: count },
    }
  );
  return count + 1;
};

const config = {
  accessKeyId: 'abc',
  secretAccessKey: '123',
  endpoint: 'http://localstack:4566',
  s3ForcePathStyle: true,
  ACL: 'public-read',
};

router.get('/api/v1/files', async function (req, res, next) {
  const s3 = new aws.S3(config);
  s3.createBucket = promisify(s3.createBucket);
  s3.listObjects = promisify(s3.listObjects);
  await s3.createBucket({ Bucket: 'test-bucket' });
  const data = await s3.listObjects({ Bucket: 'test-bucket' });

  res.json(data);
});

router.post('/api/v1/files/upload/', (req, res) => {
  const s3 = new aws.S3(config);

  const uploadFile = async (fileName) => {
    const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
      Bucket: 'test-bucket',
      Key: `upload-${Date.now()}.jpg`, // File name you want to save as in S3
      Body: fileContent,
    };

    // Uploading files to the bucket
    s3.upload(params, function (err, data) {
      if (err) {
        throw err;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
      return `${params['Bucket']}/${params['Key']}`;
    });
  };

  const form = new multiparty.Form();

  form.parse(req, async (error, fields, files) => {
    if (error) {
      return res.status(500).send(error);
    }
    try {
      const path = files.file[0].path;
      const response = await uploadFile(path);
      return res.send(response);
    } catch (err) {
      return res.status(500).send(err);
    }
  });
});

router.get('/api/v1/reset', async function (req, res, next) {
  const counters = await db.Counter.findAll();
  const count = await resetCounter(counters[0]);
  res.json({ response: count });
});

router.get('/api/v1/', async function (req, res, next) {
  const counters = await db.Counter.findAll();
  const counter = counters.length
    ? await incrementCounter(counters[0])
    : await createCounter();

  const response = `Express server running on port 8080. Pinged ${counter} ${
    counter === 1 ? 'time' : 'times'
  }, most recently on ${new Date()}`;

  res.json({ response: response });
});

module.exports = router;
