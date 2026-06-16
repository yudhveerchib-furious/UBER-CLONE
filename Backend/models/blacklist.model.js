import mongoose from "mongoose";

const { Schema } = mongoose;

const BlacklistSchema = new Schema({
	token: { type: String, required: true, unique: true },
	// expiry date set to 24 hours from creation by default
	createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400
    }
});

// TTL index: document will be removed once expiresAt <= now
BlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Blacklist = mongoose.model('BlacklistToken', BlacklistSchema);

export default Blacklist;