import mongoose from 'mongoose';

const athleteSchema = new mongoose.Schema({
    name:       { type: String, required: true, trim: true },
    slug:       { type: String, required: true, trim: true },
    country:    { type: String, default: '' },
    events:     { type: [String], default: [] },
    careerHigh: { type: String, default: '' },
    img:        { type: String, default: '' },
    img2:       { type: String, default: '' },
    isActive:   { type: Boolean, default: true },
}, {
    timestamps: true,
});

athleteSchema.index({ slug: 1 });

export default mongoose.model('Athlete', athleteSchema);
