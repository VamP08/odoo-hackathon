// filepath: backend/models/Swap.js
class Swap {
  constructor({ id, itemId, requesterId, ownerId, status, createdDate, message }) {
    this.id = id;
    this.itemId = itemId;
    this.requesterId = requesterId;
    this.ownerId = ownerId;
    this.status = status; // pending, accepted, rejected, completed
    this.createdDate = createdDate;
    this.message = message;
  }
}
module.exports = Swap;