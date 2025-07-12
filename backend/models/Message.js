class Message {
  constructor({ id, senderId, receiverId, content, timestamp, read }) {
    this.id = id;
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.content = content;
    this.timestamp = timestamp;
    this.read = read;
  }
}
module.exports = Message;