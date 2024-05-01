#! /usr/bin/env node

console.log(
    'This script populates some test albums, artists, and genres to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Album = require("./models/album");
  const Artist = require("./models/artist");
  const Genre = require("./models/genre");
  const Format = require("./models/format")
  
  const genres = [];
  const artists = [];
  const albums = [];
  const formats = [];
  
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
    await createFormats();
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

  async function formatCreate(index, name) {
    const format = new Format({ name: name });
    await format.save();
    formats[index] = format;
    console.log(`Added format: ${name}`);
  }
  
  async function artistCreate(index, first_name, family_name, d_origin, d_breakup) {
    const artistdetail = { first_name: first_name, family_name: family_name };
    if (d_origin != false) artistdetail.date_of_origin = d_origin;
    if (d_breakup != false) artistdetail.date_of_breakup = d_breakup;
  
    const artist = new Artist(artistdetail);
  
    await artist.save();
    artists[index] = artist;
    console.log(`Added artist: ${first_name} ${family_name}`);
  }
  
  async function albumCreate(index, title, artist, tracks, release, genre, format) {
    const albumdetail = {
      title: title,
      artist: artist,
      tracks: tracks,
      release: release,
      genre: genre,
      format: format,
    };
    if (genre != false) albumdetail.genre = genre;
    if (format != false) albumdetail.format = format;
  
    const album = new Album(albumdetail);
    await album.save();
    albums[index] = album;
    console.log(`Added album: ${title}`);
  }
  
//   async function bookInstanceCreate(index, book, imprint, due_back, status) {
//     const bookinstancedetail = {
//       book: book,
//       imprint: imprint,
//     };
//     if (due_back != false) bookinstancedetail.due_back = due_back;
//     if (status != false) bookinstancedetail.status = status;
  
//     const bookinstance = new BookInstance(bookinstancedetail);
//     await bookinstance.save();
//     bookinstances[index] = bookinstance;
//     console.log(`Added bookinstance: ${imprint}`);
//   }
  
  async function createGenres() {
    console.log("Adding genres");
    await Promise.all([
      genreCreate(0, "Emo"),
      genreCreate(1, "Pop"),
      genreCreate(2, "Rap"),
    ]);
  }

  async function createFormats() {
    console.log("Adding formats");
    await Promise.all([
        formatCreate(0, "Vinyl"),
        formatCreate(1, "CD"),
        formatCreate(2, "Cassette")
    ])
  }
  
  async function createArtists() {
    console.log("Adding artists");
    await Promise.all([
      artistCreate(0, "Joyce Manor", "", "2009, 02, 15", false),
      artistCreate(1, "Taylor", "Swift", "1989, 12, 13", false),   
      artistCreate(2, "Prince Daddy & the Hyena", "", "2014, 12, 04", false),
      artistCreate(3, "Snowing", "", "2009, 07, 01", "2011, 09, 12"),
      artistCreate(4, "MF DOOM", "", "1971, 07, 13", "2020, 10, 31"),
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
        [formats[0], formats[1]],
      ),
      albumCreate(1,
        "Never Hungover Again",
        artists[0],
        10,
        2014,
        [genres[0]],
        [formats[0], formats[1]],
      ),
      albumCreate(2,
        "Red",
        artists[1],
        16,
        2012,
        genres[1],
        [formats[0], formats[1], formats[2]]),
      albumCreate(3,
        "Cosmic Thrill Seekers",
        artists[2],
        14,
        2019,
        genres[0],
        [formats[0], formats[1]]),
      albumCreate(4,
        "I Could Do Whatever I Wanted If I Wanted",
        artists[3],
        11,
        2011,
        genres[0],
        [formats[0], formats[1], formats[2]]),
      albumCreate(5,
        "Operation: Doomsday",
        artists[4],
        19,
        1999,
        [genres[2]],
        [formats[0], formats[1], formats[2]])    
    ]);
  }
  
//   async function createBookInstances() {
//     console.log("Adding authors");
//     await Promise.all([
//       bookInstanceCreate(0, books[0], "London Gollancz, 2014.", false, "Available"),
//       bookInstanceCreate(1, books[1], " Gollancz, 2011.", false, "Loaned"),
//       bookInstanceCreate(2, books[2], " Gollancz, 2015.", false, false),
//       bookInstanceCreate(3,
//         books[3],
//         "New York Tom Doherty Associates, 2016.",
//         false,
//         "Available"
//       ),
//       bookInstanceCreate(4,
//         books[3],
//         "New York Tom Doherty Associates, 2016.",
//         false,
//         "Available"
//       ),
//       bookInstanceCreate(5,
//         books[3],
//         "New York Tom Doherty Associates, 2016.",
//         false,
//         "Available"
//       ),
//       bookInstanceCreate(6,
//         books[4],
//         "New York, NY Tom Doherty Associates, LLC, 2015.",
//         false,
//         "Available"
//       ),
//       bookInstanceCreate(7,
//         books[4],
//         "New York, NY Tom Doherty Associates, LLC, 2015.",
//         false,
//         "Maintenance"
//       ),
//       bookInstanceCreate(8,
//         books[4],
//         "New York, NY Tom Doherty Associates, LLC, 2015.",
//         false,
//         "Loaned"
//       ),
//       bookInstanceCreate(9, books[0], "Imprint XXX2", false, false),
//       bookInstanceCreate(10, books[1], "Imprint XXX3", false, false),
//     ]);
//   }