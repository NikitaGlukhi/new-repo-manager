import * as mongoose from 'mongoose';

export const GithubRepositoriesSchema = new mongoose.Schema({
  repoName: {
    type: String,
    required: true,
  },
  repoType: {
    type: String,
    required: true,
  },
  organization: {
    type: String,
    required: true,
  },
  dataSource: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  branches: {
    type: Object,
    required: true
  }
}, { versionKey: false, _id: false });