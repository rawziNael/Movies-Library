    DROP TABLE IF EXISTS bestMovie;

    CREATE TABLE IF NOT EXISTS bestMovie(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    release_date INTEGER,
    poster_path VARCHAR(255),
    overview VARCHAR(255)
    );
    
