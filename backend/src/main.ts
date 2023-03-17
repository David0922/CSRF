import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

interface User {
  username: string;
  role: 'user' | 'admin';
}

interface Session {
  user: User;
}

const main = async () => {
  const app = express();

  const bind_addr = '0.0.0.0';
  const port = 3000;

  app.use(cors({ origin: 'http://localhost:8080', credentials: true }));
  app.use(cookieParser());
  app.use(express.json());

  const sessions = new Map<string, Session>();
  const users = new Map<string, User>();

  users.set('a', { username: 'a', role: 'admin' });
  users.set('b', { username: 'b', role: 'user' });

  app.post('/login', (req, res) => {
    const user: User | undefined = users.get(req.body.username);

    if (!user) {
      res.sendStatus(401); // unauthorized
      return;
    }

    const sessionId = crypto.randomUUID();

    sessions.set(sessionId, { user });

    res
      .cookie('sessionId', sessionId, {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
      })
      .send(`login as ${user.username}`);
  });

  app.get('/currUser', (req, res) => {
    const session = sessions.get(req.cookies.sessionId);

    if (!session || !session.user) {
      res.send('no user is logged in');
    } else {
      res.send(`curr user = ${session.user.username}`);
    }
  });

  app.get('/sensitiveData', (req, res) => {
    const session = sessions.get(req.cookies.sessionId);

    if (!session) {
      res.sendStatus(401); // unauthorized
      return;
    }

    if (session.user.role !== 'admin') {
      res.sendStatus(403); // forbidden
      return;
    }

    res.send('sensitive data');
  });

  app.post('/deleteSelf', (req, res) => {
    const session = sessions.get(req.cookies.sessionId);

    if (!session) {
      res.sendStatus(401); // unauthorized
      return;
    }

    sessions.delete(req.cookies.sessionId);
    users.delete(session.user.username);

    res.send(`${session.user.username} deleted`);
  });

  app.listen(port, bind_addr, () => {
    console.log(`listening at ${bind_addr}:${port}`);
  });
};

main().catch(console.error);
