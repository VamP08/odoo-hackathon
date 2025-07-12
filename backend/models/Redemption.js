
class Redemption {
  constructor({ id, userId, itemId, status, createdAt, updatedAt }) {
    this.id = id;
    this.userId = userId;
    this.itemId = itemId;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export default Redemption;