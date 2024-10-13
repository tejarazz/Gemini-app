import mongoose from "mongoose";

const userChatsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    chats: [
      {
        _id: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true } // This adds createdAt and updatedAt automatically
);

// Ensure model name is capitalized
export default mongoose.models.UserChats ||
  mongoose.model("UserChats", userChatsSchema);
