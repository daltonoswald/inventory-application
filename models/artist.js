const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
    first_name: { type: String, required: true, maxLength: 100 },
    family_name: { type: String, required: false, maxLength: 100 },
    date_of_origin: { type: Date },
    date_of_breakup: { type: Date},
});

// Virtual for Artist's full name
ArtistSchema.virtual("name").get(function () {
    // To avoid errors in cases where an artist does not have either a family name or first name
    // We want to make sure we handle the exception by returning an empty string for tht case
    let fullname = "";
    if (this.first_name && this.family_name) {
        fullname = `${this.family_name}, ${this.first_name}`;
    }
    return fullname;
});

// Virtual fro artist's URL
ArtistSchema.virtual("url").get(function () {
    // We dont use an arrow function as we'll need the this object
    return `/catalog/artist/${this._id}`;
});

// export model
module.exports = mongoose.model("Artist", ArtistSchema);