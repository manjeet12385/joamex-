import mongoose from 'mongoose';

const siteContentSchema = new mongoose.Schema({
  documentId: { type: String, required: true, default: 'global' },
  data: {
    type: Object,
    required: true,
    default: {}
  }
}, { timestamps: true });

export default mongoose.models.SiteContent || mongoose.model('SiteContent', siteContentSchema);
