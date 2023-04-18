const TOKEN = {
  DataSource: {
    Postgres: Symbol.for('PostgresDataSource'),
  },
  Repositories: {
    User: Symbol.for('UserRepository'),
    Post: Symbol.for('PostRepository'),
    Event: Symbol.for('EventRepository'),
  },

  Services: {
    User: Symbol.for('UserService'),
    Post: Symbol.for('PostService'),
    Event: Symbol.for('EventService'),
  },
};

export default TOKEN;
