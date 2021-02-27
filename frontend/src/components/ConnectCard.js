import { useEffect, useState } from 'react';
import { Box, Button, Card, Link } from '@material-ui/core';
import Prism from 'prismjs';

import expressLogo from '../assets/images/express.png';

function ResponseBlock(props) {
  useEffect(() => {
    Prism.highlightAll();
  }, []);
  return (
    <pre>
      <code className={props.language}>{`${props.code}`}</code>
    </pre>
  );
}

function ConnectCard(props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const { classes } = props;

  const fetchData = () => {
    fetch('/api/v1/')
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setData(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  const resetCounter = () => {
    fetch('/api/v1/reset/')
      .then((res) => res.json())
      .then((data) => fetchData());
  };

  useEffect(() => fetchData(), []);

  const codeBlock = `101 |  router.get('/api/v1/reset', async function (req, res, next) {
102 |    const counters = await db.Counter.findAll();
103 |    const count = await resetCounter(counters[0]);
104 |    res.json({response: count})
105 |  });`;

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else
    return (
      <Card className={classes.card}>
        <h2>Connect to a server</h2>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          mt={-3}
          mb={-1}
        >
          <Box mr={1}>
            <h3>Powered by</h3>
          </Box>
          <img
            width="75px"
            height="100%"
            src={expressLogo}
            alt="Express Logo"
          />
        </Box>
        <p>
          This React frontend is connected to an Express server. Below is the
          response message we receive when we ping the server:
        </p>

        <pre className={classes.pre}>
          <p className={classes.response}>
            {'>'} {data.response}
          </p>
        </pre>

        <p>
          The server ping count is stored to the database. Click below to{' '}
          <b>reset the counter:</b>
        </p>
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            size="small"
            className={classes.contained}
            onClick={resetCounter}
          >
            Reset Counter
          </Button>
        </Box>
        <p>
          The <b>endpoint</b> that resets the ping counter is located in{' '}
          <code>
            <Link
              className={classes.link}
              href={`${process.env.REACT_APP_STARTER_REPO_URL}backend/src/routes/index.js#L101-L105`}
              target="_blank"
            >
              backend/src/routes/index.js
            </Link>
          </code>
          :
        </p>
        <ResponseBlock language="language-js" code={codeBlock} />
      </Card>
    );
}

export default ConnectCard;
