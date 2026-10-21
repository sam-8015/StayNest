
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { sampleUsers, sampleListings } = require("./sampleData.js");

const DB_URL = process.env.SEED_DB_URL || process.env.ATLASDB_URL;
const PASSWORD = "demo";
const PLACEHOLDER = "https://placehold.co/800x600/png?text=StayNest";

// Returns true if the image link opens (so broken links never reach the site).
async function imageWorks(url) {
  try {
    const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(8000) });
    return res.ok;
  } catch {
    return false;
  }
}

async function seed() {
  if (!DB_URL) throw new Error("Set ATLASDB_URL (or SEED_DB_URL) in your .env file");
  await mongoose.connect(DB_URL);
  console.log("Connected to database");

  // 1. Remove old copies of the demo users + their listings (makes re-running safe)
  const usernames = sampleUsers.map((u) => u.username);
  const oldUsers = await User.find({ username: { $in: usernames } });
  const oldIds = oldUsers.map((u) => u._id);
  const oldListings = await Listing.find({ owner: { $in: oldIds } });
  await Review.deleteMany({ _id: { $in: oldListings.flatMap((l) => l.reviews) } });
  await Listing.deleteMany({ owner: { $in: oldIds } });
  await User.deleteMany({ _id: { $in: oldIds } });

  // 2. Create users (passport-local-mongoose hashes the password for us)
  const idByName = {};
  for (const u of sampleUsers) {
    const created = await User.register(new User({ username: u.username, email: u.email }), PASSWORD);
    idByName[u.username] = created._id;
  }
  console.log(`Created ${sampleUsers.length} users (password: ${PASSWORD})`);

  // 3. Check image links, then insert listings
  let broken = 0;
  const docs = [];
  for (const l of sampleListings) {
    const ok = await imageWorks(l.image.url);
    if (!ok) {
      broken++;
      console.log(`  Broken image for "${l.title}" -> using placeholder\n    ${l.image.url}`);
    }
    docs.push({ ...l, image: ok ? l.image : { ...l.image, url: PLACEHOLDER }, owner: idByName[l.owner] });
  }
  await Listing.insertMany(docs);
  console.log(`Inserted ${docs.length} listings (${broken} placeholder images)`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
