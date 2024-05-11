#! /usr/bin/env node

console.log(
    'This script populates some test albums, artists, and genres to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Album = require("./models/album");
  const Artist = require("./models/artist");
  const Genre = require("./models/genre");
  
  const genres = [];
  const artists = [];
  const albums = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createGenres();
    await createArtists();
    await createAlbums();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  // We pass the index to the ...Create functions so that, for example,
  // genre[0] will always be the Fantasy genre, regardless of the order
  // in which the elements of promise.all's argument complete.
  async function genreCreate(index, name) {
    const genre = new Genre({ name: name });
    await genre.save();
    genres[index] = genre;
    console.log(`Added genre: ${name}`);
  }

  
  async function artistCreate(index, name, d_origin, d_breakup) {
    const artistdetail = { name: name };
    if (d_origin != false) artistdetail.date_of_origin = d_origin;
    if (d_breakup != false) artistdetail.date_of_breakup = d_breakup;
  
    const artist = new Artist(artistdetail);
  
    await artist.save();
    artists[index] = artist;
    console.log(`Added artist: ${name}`);
  }
  
  async function albumCreate(index, title, artist, tracks, release, genre, price, stock, description) {
    const albumdetail = {
      title: title,
      artist: artist,
      tracks: tracks,
      release: release,
      genre: genre,
      price: price,
      stock: stock,
      description: description,
    };
    if (genre != false) albumdetail.genre = genre;
  
    const album = new Album(albumdetail);
    await album.save();
    albums[index] = album;
    console.log(`Added album: ${title}`);
  }
  
  async function createGenres() {
    console.log("Adding genres");
    await Promise.all([
      genreCreate(0, "Emo"),
      genreCreate(1, "Pop"),
      genreCreate(2, "Rap"),
    ]);
  }
  
  async function createArtists() {
    console.log("Adding artists");
    await Promise.all([
      artistCreate(0, "Joyce Manor", "2009, 02, 15", false),
      artistCreate(1, "Taylor Swift", "1989, 12, 13", false),   
      artistCreate(2, "Prince Daddy & the Hyena", "2014, 12, 04", false),
      artistCreate(3, "Snowing", "2009, 07, 01", "2011, 09, 12"),
      artistCreate(4, "MF DOOM", "1971, 07, 13", "2020, 10, 31"),
      artistCreate(5, "Olivia Rodrigo", "2003, 02, 20", false)
    ]);
  }
  
  async function createAlbums() {
    console.log("Adding Albums");
    await Promise.all([
      albumCreate(0,
        "Joyce Manor",
        artists[0],
        10,
        2011,
        [genres[0]],
        20,
        10,
        "White with Black Splatter",
      ),
      albumCreate(1,
        "Never Hungover Again",
        artists[0],
        10,
        2014,
        [genres[0]],
        20,
        13,
        "Transparent Teal"
      ),
      albumCreate(2,
        "Red",
        artists[1],
        16,
        2012,
        genres[1],
        30,
        27,
        "Red",
      ),
      albumCreate(3,
        "Cosmic Thrill Seekers",
        artists[2],
        14,
        2019,
        genres[0],
        25,
        6,
        "Foggy Midnight Blue",
      ),
      albumCreate(4,
        "I Could Do Whatever I Wanted If I Wanted",
        artists[3],
        11,
        2011,
        genres[0],
        15,
        3,
        "Black",
        ),
      albumCreate(5,
        "Operation: Doomsday",
        artists[4],
        19,
        1999,
        [genres[2]],
        30,
        12,
        "Steel Gray",
        ),
      albumCreate(6,
        "Guts",
        artists[5],
        12,
        2023,
        genres[1],
        30,
        23,
        "Lavender"
        ),    
    ]);
  }
