const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
    // first_name: { type: String, required: true, maxLength: 100 },
    // family_name: { type: String, required: false, maxLength: 100 },
    name: { type: String, required: true, maxLength: 200 },
    date_of_origin: { type: Date },
    date_of_breakup: { type: Date},
});

// Virtual for artist's URL
ArtistSchema.virtual("url").get(function () {
    // We dont use an arrow function as we'll need the this object
    return `/catalog/artist/${this._id}`;
});

// Virtual for artist's dates

ArtistSchema.virtual("date_of_origin_formatted").get(function () {
    return DateTime.fromJSDate(this.date_of_origin).toLocaleString(DateTime.DATE_MED);
});

ArtistSchema.virtual("date_of_breakup_formatted").get(function () {
    if (this.date_of_breakup != "") {
        return DateTime.fromJSDate(this.date_of_breakup).toLocaleString(DateTime.DATE_MED);
    }
});

// export model
module.exports = mongoose.model("Artist", ArtistSchema);