
class PointTransaction {
  constructor({ id, userId, amount, type, date, description }) {
    this.id = id;
    this.userId = userId;
    this.amount = amount;
    this.type = type; // earn, spend
    this.date = date;
    this.description = description;
  }
}
export default PointTransaction;